# wfos-e2e — the test project that exercises Workflow OS end to end

**Why this exists.** Every part of Workflow OS had a unit test; nothing had ever run the
whole thing *as the harness runs it* — the hook path in `settings.json`, through
`device-gate.py`, with a real payload, on both machines. Asked for on 2026-08-23:
"trigger every agent, call, tool, every hook, every external agent."

## What's here

| File | What it proves |
|---|---|
| `hook-smoke.py` | every hook wired in `settings.json` starts, reads stdin, exits on a defined code — never a traceback |
| `guard-negatives.py` | the four guards actually **bite**: fed the thing each exists to stop, each denies |
| `results/` | raw logs kept as evidence, not summaries |

`hook-smoke.py` alone is not enough — a hook that always exits 0 also never crashes. That
is why `guard-negatives.py` exists: half the suite proves nothing breaks, half proves
something is enforced.

## Decisions made during the run (WHY)

- **`bin/verify` runs pytest, not `unittest discover`.** Six test modules are plain
  `def test_*` functions, which unittest silently does not collect: 206 tests ran where 274
  existed. A dangling reference in `design/PIPELINE.md` survived days because the test that
  catches exactly that was one of the 68 uncollected. Missing pytest is now a hard failure,
  never a quiet skip.
- **`workflow-health.py` branches on platform.** It crashed with `FileNotFoundError('launchctl')`
  on Linux, so the one machine that runs unattended had no working health check at all.
  Server side now checks the systemd units `setup server` installs.
- **`lane-health.py` never reports codex `ok` without a probe.** anchor-core's `auth.json`
  was valid for another week and the session behind it had still been revoked server-side.
  `unproven` is the true state; claiming `ok` is worse than saying nothing.
- **`ssh hq` / `ssh anchor-core` moved to port 2222.** Port 22 is Tailscale SSH, which is
  check-gated and hangs. The config comment already knew this — only `vm` had been moved.

## Not built, deliberately

- **`./setup server` on anchor-core.** It installs `workflow-overseer.timer`, which reboots
  the box every Friday 23:00. That box holds live Claude sessions. His call, not mine.
- **Live-firing `workflows/*.js`.** Statically checked only (`node --check`). The standing
  rule is not to run workflows unless asked.
