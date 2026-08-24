#!/usr/bin/env python3
"""Fire every hook wired in settings.json with a realistic payload and record what it did.

Static tests prove a hook's logic. This proves the hook the harness actually runs -- the
path in settings.json, through device-gate.py, with a payload shaped like the real event --
starts, reads stdin, and exits on a defined code instead of crashing.

A hook may legitimately exit 0 (allow), 1 (non-blocking error) or 2 (block). What it may
never do is raise: a traceback on stderr is the failure this looks for.

  python3 hook-smoke.py            # run every event
  python3 hook-smoke.py PreToolUse # one event
"""
from __future__ import annotations

import json
import os
import shlex
import subprocess
import sys
import tempfile
from pathlib import Path

HOME = Path.home()
SETTINGS = HOME / ".claude/settings.json"
TIMEOUT = 45

# One payload per event. Fields follow Claude Code's hook input contract; extra keys are
# harmless and several of these hooks read repo/session state rather than the payload.
TRANSCRIPT = Path(tempfile.gettempdir()) / "wfos-e2e-transcript.jsonl"


def payload(event: str, matcher: str) -> dict:
    base = {
        "session_id": "wfos-e2e-smoke",
        "transcript_path": str(TRANSCRIPT),
        "cwd": str(Path(__file__).resolve().parent),
        "hook_event_name": event,
    }
    if event == "PreToolUse":
        tool = (matcher.split("|")[0] if matcher and matcher != "*" else "Bash")
        base["tool_name"] = tool
        base["tool_input"] = {
            "Bash": {"command": "echo wfos-e2e", "description": "smoke"},
            "Agent": {"description": "smoke", "prompt": "smoke", "subagent_type": "critic",
                      "model": "opus"},
            "Workflow": {"script": "export const meta = {name:'x',description:'x'}"},
            "Write": {"file_path": str(Path(tempfile.gettempdir()) / "wfos-e2e-smoke.txt"),
                      "content": "smoke"},
            "Read": {"file_path": str(SETTINGS)},
            "TaskOutput": {"task_id": "wfos-e2e"},
        }.get(tool, {})
    elif event == "PostToolUse":
        base["tool_name"] = "Bash"
        base["tool_input"] = {"command": "echo wfos-e2e"}
        base["tool_response"] = {"stdout": "wfos-e2e\n", "stderr": "", "interrupted": False}
    elif event == "UserPromptSubmit":
        base["prompt"] = "wfos-e2e hook smoke: no action required"
    elif event in ("Stop", "SubagentStop"):
        base["stop_hook_active"] = False
    elif event == "SessionStart":
        base["source"] = "startup"
    elif event == "SessionEnd":
        base["reason"] = "other"
    elif event in ("PreCompact", "PostCompact"):
        base["trigger"] = matcher if matcher in ("auto", "manual") else "manual"
        base["custom_instructions"] = ""
    elif event == "StopFailure":
        base["error_type"] = "wfos_e2e_probe"
        base["error_message"] = "synthetic — hook smoke only"
    elif event == "ConfigChange":
        base["config_path"] = str(SETTINGS)
    return base


def run_one(event: str, matcher: str, command: str) -> dict:
    body = json.dumps(payload(event, matcher))
    env = dict(os.environ)
    # Hooks that would page him, steal focus or write to the live board must not do so
    # from a smoke run. Every one of these is read by the scripts themselves.
    env.update({"WFOS_SMOKE": "1", "CLAUDE_HOOK_SMOKE": "1"})
    try:
        proc = subprocess.run(["bash", "-lc", command], input=body, text=True,
                              capture_output=True, timeout=TIMEOUT, env=env)
        code, out, err = proc.returncode, proc.stdout, proc.stderr
    except subprocess.TimeoutExpired:
        code, out, err = "TIMEOUT", "", f"exceeded {TIMEOUT}s"
    crashed = isinstance(err, str) and "Traceback (most recent call last)" in err
    return {"event": event, "matcher": matcher, "command": command, "exit": code,
            "crashed": crashed, "stdout": out.strip()[:400], "stderr": err.strip()[-600:]}


def main() -> int:
    only = sys.argv[1] if len(sys.argv) > 1 else None
    TRANSCRIPT.parent.mkdir(parents=True, exist_ok=True)
    if not TRANSCRIPT.exists():
        TRANSCRIPT.write_text("")
    cfg = json.loads(SETTINGS.read_text())
    results = []
    for event, matchers in cfg.get("hooks", {}).items():
        if only and event != only:
            continue
        for group in matchers:
            matcher = group.get("matcher", "*")
            for hook in group.get("hooks", []):
                cmd = hook.get("command")
                if not cmd:
                    continue
                results.append(run_one(event, matcher, cmd))

    width = max((len(shlex.split(r["command"])[-1].split("/")[-1]) for r in results), default=20)
    crashed = [r for r in results if r["crashed"]]
    for r in results:
        name = shlex.split(r["command"])[-1].split("/")[-1]
        flag = "CRASH" if r["crashed"] else "ok   "
        print(f"{flag}  {r['event']:<18} {name:<{width}}  exit={r['exit']}")
    print(f"\n{len(results)} hook invocations, {len(crashed)} crashed")
    for r in crashed:
        print(f"\n--- {r['event']} / {r['command']}\n{r['stderr']}")
    out = Path(__file__).resolve().parent / "results/hook-smoke.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(results, indent=2) + "\n")
    return 1 if crashed else 0


if __name__ == "__main__":
    sys.exit(main())
