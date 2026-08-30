attacks:
- Full automated suite: `uv run pytest -q` completed at `[100%]` with 86/86 passing.
- Lowercase marker: `PACER unmetered:local-model False`; provider received `local-model`.
- Uppercase marker: `PACER UNMETERED:local-model False`; provider received `local-model`.
- Mixed-case marker: `PACER UnMeTeReD:local-model False`; provider received `local-model`.
- Rechecked prior cap, crash replay, priority, inactive-project, timestamp, freshness, resetless, mismatched, alias, and empty-metering variants through the expanded suite; no regression surfaced.
findings:
- None in the final scoped implementation. The pacer and executor now apply the same case-insensitive marker recognition, and an empty stripped model remains rejected.
- Tooling note, not a runtime defect: `ruff` is not declared in the dev dependency group, so `uv run --group dev ruff ...` reports `Failed to spawn: ruff`; pytest remains green.
verdict: PASS — no remaining implementation defect found in the scoped token-governor, pacing, queue, containment, or unmetered-marker behavior.
