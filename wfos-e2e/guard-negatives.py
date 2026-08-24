#!/usr/bin/env python3
"""Negative probes: feed each guard the thing it exists to stop and require exit 2.

hook-smoke.py proves no hook crashes. That is only half the check -- a hook that always
exits 0 also never crashes. This half proves the guards bite. Each case states the rule it
is testing and the exit code that means the rule held.

Payloads are built in Python and piped straight to the hook, never assembled on a shell
command line: writing the browser case as a bash string is itself caught by
block-nonsandbox-browsers.py at the outer PreToolUse, which is a fine live proof but makes
the probe unrunnable.
"""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

HOOKS = Path.home() / ".claude/hooks"
CWD = str(Path(__file__).resolve().parent)

CASES = [
    ("subagent-model-guard.py", "his rule: a sub-agent must be spawned with model opus",
     {"hook_event_name": "PreToolUse", "tool_name": "Agent",
      "tool_input": {"description": "x", "prompt": "x", "subagent_type": "critic"}}),
    ("block-nonsandbox-browsers.py", "agents never drive his real browser profile",
     {"hook_event_name": "PreToolUse", "tool_name": "Bash",
      "tool_input": {"command": "open -a 'Google Chrome' https://example.com"}}),
    ("hidden-app-guard.py", "an agent never steals focus from what he is doing",
     {"hook_event_name": "PreToolUse", "tool_name": "Bash",
      "tool_input": {"command": "osascript -e 'tell application \"Safari\" to activate'"}}),
    ("r1r2-gate.py", "a new sourced page type is blocked until SOURCES.md names a real url",
     {"hook_event_name": "PreToolUse", "tool_name": "Write",
      "tool_input": {"file_path": str(Path.home() / "Developer/wfos-e2e-probe/pricing.html"),
                     "content": "<html><body>pricing</body></html>"}}),
]


def main() -> int:
    rows, bad = [], 0
    for script, rule, extra in CASES:
        body = json.dumps({"session_id": "wfos-e2e-neg", "cwd": CWD,
                           "transcript_path": str(Path(tempfile.gettempdir()) / "wfos-e2e-transcript.jsonl"),
                           **extra})
        proc = subprocess.run([sys.executable, str(HOOKS / script)], input=body, text=True,
                              capture_output=True, timeout=45)
        # Two deny protocols are in use and both are correct: exit 2 with a reason on
        # stderr (the older one) and exit 0 with hookSpecificOutput.permissionDecision
        # == "deny" (the JSON one). Grading only on exit 2 marked two working guards as
        # failures on the first run of this probe.
        decision = ""
        try:
            decision = json.loads(proc.stdout or "{}").get(
                "hookSpecificOutput", {}).get("permissionDecision", "")
        except json.JSONDecodeError:
            pass
        blocked = proc.returncode == 2 or decision == "deny"
        bad += 0 if blocked else 1
        reason = (proc.stderr or proc.stdout).strip().splitlines()
        how = "exit 2" if proc.returncode == 2 else f"json {decision or 'none'}"
        rows.append((script, rule, how, blocked, reason[0][:150] if reason else ""))

    for script, rule, code, blocked, reason in rows:
        print(f"{'BLOCKED' if blocked else 'ALLOWED'}  via {code:<11} {script}")
        print(f"         rule: {rule}")
        if reason:
            print(f"         said: {reason}")
    print(f"\n{len(rows)} guards probed, {len(rows)-bad} bit, {bad} let it through")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
