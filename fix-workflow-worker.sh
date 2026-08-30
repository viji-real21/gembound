#!/bin/zsh
# Fix the leaked Hatchet action-listener orphans and the unbounded worker logs.
#
# Diagnosis: launchd terminates the worker but does not reap the multiprocessing
# grandchildren that run Hatchet's action listeners. Each restart leaks a pair
# that reconnects forever to an embedded-engine gRPC port that no longer exists.
# They never exit -- the SDK's retry counter resets under exponential backoff, so
# it never reaches its own ceiling and never raises -- they keep the inherited
# stdout descriptor, and they flood worker.log at roughly 390 lines per minute.
#
# This script is idempotent. Run it as many times as you like.

set -euo pipefail

repo="/Users/vedhith/Developer/vedhith-workflow-os"
runtime="$repo/runtime"
state_dir="/Users/vedhith/.local/state/vedhith-workflow"
launch_script="$runtime/services/run-worker-macos.sh"
venv_python="$runtime/.venv/bin/python3"

# Kill orphaned listeners: reparented to launchd (PPID 1), running our venv
# python, and not a live `workflow worker` parent.
reap_orphans() {
  local signal="$1" count=0 pid ppid_of cmd
  for pid in ${(f)"$(pgrep -f "$venv_python" 2>/dev/null || true)"}; do
    [[ -n "$pid" ]] || continue
    [[ "$pid" == "$$" ]] && continue
    ppid_of="$(ps -o ppid= -p "$pid" 2>/dev/null | tr -d ' ' || true)"
    [[ "$ppid_of" == "1" ]] || continue
    cmd="$(ps -o command= -p "$pid" 2>/dev/null || true)"
    [[ "$cmd" == *"workflow worker"* ]] && continue
    print "    orphan pid=$pid -> $signal"
    kill "-$signal" "$pid" 2>/dev/null || true
    count=$((count + 1))
  done
  return $count
}

print "==> 1. Reaping orphaned action listeners"
reap_orphans TERM || true
sleep 3
reap_orphans KILL || true

print "==> 2. Patching $launch_script so restarts stop leaking"
/usr/bin/python3 - "$launch_script" "$venv_python" <<'PYTHON'
import pathlib
import shutil
import sys
import time

path = pathlib.Path(sys.argv[1])
venv_python = sys.argv[2]
marker = "# --- orphan reap and log rotation (managed by fix-workflow-worker.sh) ---"
source = path.read_text()

if marker in source:
    print("    already patched, skipping")
    sys.exit(0)

anchor = 'if [[ -f "$environment_file" ]]; then'
if anchor not in source:
    sys.exit("    ERROR: anchor line not found; launch script left unchanged")

block = f'''{marker}
# launchd does not reap the multiprocessing grandchildren that run Hatchet's
# action listeners. Each leaked pair reconnects forever to an engine port that no
# longer exists and floods worker.log. Reap the orphans before starting a
# replacement. A live worker is also a direct launchd child, so it is excluded by
# command line rather than by parent pid.
venv_python="{venv_python}"
for pid in ${{(f)"$(pgrep -f "$venv_python" 2>/dev/null || true)"}}; do
  [[ -n "$pid" ]] || continue
  [[ "$pid" == "$$" ]] && continue
  listener_ppid="$(ps -o ppid= -p "$pid" 2>/dev/null | tr -d ' ' || true)"
  [[ "$listener_ppid" == "1" ]] || continue
  listener_cmd="$(ps -o command= -p "$pid" 2>/dev/null || true)"
  [[ "$listener_cmd" == *"workflow worker"* ]] && continue
  kill -TERM "$pid" 2>/dev/null || true
done

# launchd appends to these forever. Rotate at 20 MiB. Truncating in place is safe
# because the inherited descriptors are opened O_APPEND.
for log in "$state_dir/worker.log" "$state_dir/worker-error.log"; do
  [[ -f "$log" ]] || continue
  log_size="$(stat -f%z "$log" 2>/dev/null || echo 0)"
  if (( log_size > 20971520 )); then
    cp "$log" "$log.1" 2>/dev/null || true
    : > "$log"
  fi
done

'''

shutil.copy2(path, f"{path}.bak-{time.strftime('%Y%m%d-%H%M%S')}")
path.write_text(source.replace(anchor, block + anchor, 1))
print("    patched (backup written alongside)")
PYTHON

zsh -n "$launch_script" || { print "    ERROR: patched script does not parse" >&2; exit 1; }
print "    syntax check passed"

print "==> 3. Rotating the current logs"
for log in "$state_dir/worker.log" "$state_dir/worker-error.log" "$state_dir/langwatch.log"; do
  [[ -f "$log" ]] || continue
  size="$(stat -f%z "$log" 2>/dev/null || echo 0)"
  (( size > 20971520 )) && { cp "$log" "$log.1" 2>/dev/null || true }
  : > "$log"
  print "    truncated $(basename "$log") (was $size bytes)"
done

print "==> 4. Restarting the worker"
launchctl kickstart -k "gui/$(id -u)/com.vedhith.workflow.worker"
sleep 25

print "==> 5. Verifying"
print "--- worker process ---"
pgrep -fl "workflow worker" || print "    NONE (bad)"
print "--- orphaned listeners remaining ---"
remaining=0
for pid in ${(f)"$(pgrep -f "$venv_python" 2>/dev/null || true)"}; do
  [[ -n "$pid" ]] || continue
  ppid_of="$(ps -o ppid= -p "$pid" 2>/dev/null | tr -d ' ' || true)"
  [[ "$ppid_of" == "1" ]] || continue
  cmd="$(ps -o command= -p "$pid" 2>/dev/null || true)"
  [[ "$cmd" == *"workflow worker"* ]] && continue
  print "    STILL ORPHANED: $pid"
  remaining=$((remaining + 1))
done
(( remaining == 0 )) && print "    none"
print "--- current engine port ---"
grep -aoE "engine ready: grpc=127\.0\.0\.1:[0-9]+" "$state_dir/worker-error.log" | tail -1 \
  || print "    (engine still starting)"
print "--- reconnect failures since restart ---"
grep -ac "connection interrupted, retrying" "$state_dir/worker.log" || true
print "--- worker.log size now ---"
stat -f%z "$state_dir/worker.log"

print ""
print "Healthy result: one worker process, zero orphans, and a reconnect-failure count of 0."
