# Workflow OS end-to-end test — 2026-08-23/24

Both machines at `a15d4bb`, identical. Every row below has a log or a command behind it.

## HQ (MacBook)

| Check | Result |
|---|---|
| `workflow-health.py` | 40/41 required — the one FAIL is `gh active account` (see gap 9) |
| `bin/verify` | exit 0 — 275 passed, 2 skipped, 54 subtests (`results/hq-verify3.log`) |
| Hooks fired as the harness fires them | 37/37 invocations, 0 crashes (`results/hook-smoke.json`) |
| Guards fed what they exist to stop | 4/4 denied |
| `hook-safety-check.py` | 31/31 safe to enable |
| Codex lane | runs, its own hooks fire |
| LangGraph shadow twin | 85 tests + backtest, exit 0 (`results/langgraph-backtest.log`) |
| gitleaks pre-commit | fires on every commit |
| `test-can-fail` | 5/5 — the suite can actually fail |
| ssh `pc` / `vm` / `vm-fast` / `hq` / `anchor-core` | all 5 good (last two fixed today) |

## Server (anchor-core)

| Check | Result |
|---|---|
| `bin/verify` | exit 0 — 268 passed, 5 skipped |
| Headless Claude | opus-5, prompt caching active, 1M context window |
| Sub-agents, one of each employee type | **7/7 PASS**, 87% cache-read ratio |
| Concurrent spawn | 3 at once; `subagent-model-guard` blocked the un-modelled attempts |
| `SubagentStop` logging | writes |
| LYNQ REST | full CRUD round-trip, board left clean |
| anchor-gateway | 4 local models, `"simulated": false` |
| tmux `hq` | 7 windows, 4 live Opus sessions |
| GitHub | in sync with HQ, same commit |

## Gaps found — nothing here is guessed

1. **anchor-core was never provisioned by `./setup server`.** No `machine.json`;
   `workflow-portal.service` and `workflow-overseer.timer` are absent. **The weekly reboot
   agent and the RAM pause/resume guard have never run.** The script itself works — I ran
   `server-overseer.py` by hand and it wrote `health.json`, memory 38.5%.
2. **`gh` not authenticated on the server.**
3. **Server Codex session revoked** — `401 token_invalidated`, needs `codex login`.
4. **`claude-weekly-mail` keychain password missing on the Mac** → the Friday email cannot send.
5. **token-optimizer MCP fails on the server**; Inkbox + Linear MCP need auth on both.
6. **200k compaction is configured but unproven on the server** — `compactions.jsonl` is empty.
7. **quota-pacer reads sigma 111.1%, projected 352%** ("Claude reached the 98% hard stop").
8. **Seed / "C" is not wired at all** — no third machine has ever run `./setup seed DEVICE`.
9. **`gh` on HQ has no `vedhith` account.** `gh auth status` lists `viji-real21`,
   `vedhithkrishnakumar-cell`, `kk-vp` — and `workflow-health.py` requires the active
   account to be `vedhith`, because `github-publisher` polls the private `vedhith/vedhith.com`
   repo every 15 minutes. Git pushes still work: they authenticate through a separate
   `vedhith` token in the macOS keychain, which is why this never surfaced as a broken push.
   So github-publisher on HQ is running against the wrong identity. `gh auth login` as
   `vedhith` fixes it.

## Fixed this run

`12bee90` `2bc0b0b` `7ed6282` `402cb0b` `a15d4bb` — pushed, pulled onto the server.

- `bin/verify` → pytest (68 tests were never being collected)
- `tests/test_perf_guard.py` skip branches on the runner, not on importability
- `design/PIPELINE.md` false-positive allowlist
- `bin/workflow-health.py` works on Linux + checks the systemd units
- `bin/lane-health.py` reads the macOS Keychain; codex is `unproven`, never `ok`
- `~/.ssh/config`: `hq` and `anchor-core` off check-gated port 22
