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

1. ~~**anchor-core was never provisioned by `./setup server`.**~~ **FIXED 08-24.** No
   `machine.json`; `workflow-portal.service` and `workflow-overseer.timer` were absent, so
   the weekly reboot agent and the RAM pause/resume guard had never run. `./setup server`
   ran on his go-ahead: role=server, portal live on `100.127.100.60:4280` (HTTP 200 from
   HQ), overseer timer writing `health.json` every minute, `fleet-hq.service` enabled so a
   reboot no longer returns a healthy VM with a dead fleet.
2. **`gh` not authenticated on the server.**
3. **Server Codex session revoked** — `401 token_invalidated`, needs `codex login`.
4. **`claude-weekly-mail` keychain password missing on the Mac** → the Friday email cannot send.
5. **token-optimizer MCP fails on the server**; Inkbox + Linear MCP need auth on both.
6. **200k compaction is configured but unproven on the server** — `compactions.jsonl` is empty.
7. **quota-pacer reads sigma 111.1%, projected 352%** ("Claude reached the 98% hard stop").
   That reading is HQ's, and HQ is on the separate $20 plan — the server reads
   `ENRICH sigma 0.6% ramp 36.6% e -36.0 (AHEAD) projected 2%`, i.e. plenty of headroom.
   The pacer was still telling HQ to hard-stop off the wrong meter.
8. **Seed / "C" is not wired at all** — no third machine has ever run `./setup seed DEVICE`.
9. **`gh` on HQ has no `vedhith` account.** `gh auth status` lists `viji-real21`,
   `vedhithkrishnakumar-cell`, `kk-vp` — and `workflow-health.py` requires the active
   account to be `vedhith`, because `github-publisher` polls the private `vedhith/vedhith.com`
   repo every 15 minutes. Git pushes still work: they authenticate through a separate
   `vedhith` token in the macOS keychain, which is why this never surfaced as a broken push.
   So github-publisher on HQ is running against the wrong identity. `gh auth login` as
   `vedhith` fixes it.
10. ~~**quota-pacer had never completed a single run on the server.**~~ **FIXED 08-24.**
    It called `osascript` unconditionally, so on Linux it raised `FileNotFoundError` — after
    writing its state file but *before* the `codex-fleet-backup` handoff. The machine that
    burns the most therefore had a governor that crashed on every tier change and had never
    once failed over to Codex. Guarded by `sys.platform == "darwin"`; the server now
    completes a run and reports ENRICH.
11. **The fleet allocator's two timers raced on their shared state file** — found live in
    its first minute, at 08:26:39: the ramp read `force=1` and wrote 5; the cycle, holding a
    pre-ramp copy, wrote 1 back over it. The journal said `RAMP -> 5%` and the fleet sat at
    1%, which would have looked like a working ramp forever. **Fixed** with an `flock` (gates
    run outside it) and a pid-unique temp file; the regression test is proven to fail with
    the lock stubbed out.
12. **The allocator's busy detector trusted a footer line that rotates.** Live dispatch #7,
    08:55: visionAnchor was 29 minutes into a turn and took a dispatch anyway, because
    `is_idle()` keyed on "esc to interrupt" and Claude Code was showing the `/btw` tip on
    that frame instead. **Fixed** — it reads the elapsed-time spinner (`(29m 33s ·`), which
    is on screen for the whole turn, and also requires an empty composer. Since the fix the
    allocator correctly holds: "all 10 windows busy — holding the turn".

13. **The allocator gave 93% of the fleet to a 4% project.** At 710 dispatches gitpop had
    659 and visionAnchor, at 42%, had 4. The picker was fine — the eligible pool was
    restricted to *idle* windows, and gitpop was the only project that finished a turn in
    seconds while the other five sat mid-turn for half an hour. So idleness silently
    became the priority function, and it inverts his order: the projects doing real work
    are the ones that stay busy. **Fixed** — a project is ineligible once it is more than
    2 turns ahead of its own share of turns spent, and the cycle holds rather than
    substituting a lower-priority project. Cost, per the pacer: 12.2% of the week.
14. **No GitHub auth on anchor-core at all**, and no single account can reach his repos:
    `VisionANCHOR/anchor` (the 42% project) is `kk-vp`-only, `vedhith/*` is `vedhith`-only,
    `viji-real21/gembound` is `viji-real21`-only. `gh auth switch` is global, so whichever
    account is active, something 403s — and the fleet pushes to all six unattended.
    **Fixed** by `bin/git-credential-gh-router.py`, a credential helper that answers with
    the token of whichever account can actually push to the repo git is asking about.
    Also fixed under it: gh labels an account by the login it had when it was *added*, so
    HQ says `vedhithkrishnakumar-cell` and anchor-core says `vedhith` for the same account
    (`gh api user` returns `vedhith` on both) — three scripts hard-coded the old label and
    swallowed the failed switch with `|| true`. And four repos carried hand-pinned
    per-repo credential config, two of which set `helper =` empty, which RESETS the helper
    list and silently discarded the router in exactly the repos that needed it.

### The 30-minute ramp, as it ran

| Time | Rung | Gates | Note |
|---|---|---|---|
| 08:26 | 1% | 9/9 PASS | dispatch #1 → visionAnchor |
| 08:31 | 5% | 9/9 PASS | rung repeated once — the race in gap 11 ate a step |
| 08:36 | 12% | 9/9 PASS | |
| 08:42 | 25% | 9/9 PASS | #2 flintted, #3 amethyst — first `submitted: true` |
| 08:47 | 45% | 9/9 PASS | |
| 08:52 | 70% | 9/9 PASS | #7 exposed gap 12 |
| 08:57 | 100% | 9/9 PASS | 11 turns placed; then all six busy, holding |

Share at 11 turns is 64/18 — too few turns to mean anything, and the small projects have
each had exactly one. Replaying the picker forward from the **live** deficit lands on
42/30/12/9/4/3 at turn 100, i.e. **72% and 7%**, his two constraints exactly.

## Fleet allocator — his 2026-08-24 shares, running

`bin/fleet-allocator.py`, deficit round-robin, two systemd timers (dispatch 1 min, ramp 5 min).

| Project | Share | | Constraint | Actual |
|---|---|---|---|---|
| visionAnchor | 42% | | visionAnchor + flintted **> 70** | **72%** |
| flintted | 30% | | gitpop + convair **5–10** | **7%** |
| amethyst | 12% | | ramp reaches full within **30 min** | 7 rungs × 5 min = 30 |
| enfermal | 9% | | | |
| gitpop | 4% | | | |
| convair | 3% | | | |

Ramp `1 → 5 → 12 → 25 → 45 → 70 → 100`, each rung gated on: all six windows present,
`health.json` < 300 s old, memory < 85%, pacer sigma < 0.98, not paused. 20 unit tests.

## Fixed this run

`12bee90` `2bc0b0b` `7ed6282` `402cb0b` `a15d4bb` — pushed, pulled onto the server.

- `bin/verify` → pytest (68 tests were never being collected)
- `tests/test_perf_guard.py` skip branches on the runner, not on importability
- `design/PIPELINE.md` false-positive allowlist
- `bin/workflow-health.py` works on Linux + checks the systemd units
- `bin/lane-health.py` reads the macOS Keychain; codex is `unproven`, never `ok`
- `~/.ssh/config`: `hq` and `anchor-core` off check-gated port 22
