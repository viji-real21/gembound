# Pipeline Execute Log

## 2026-08-25 — Ownership enforcement

- Added root `CODEOWNERS` entries for the design lane using CODEOWNERS syntax.
- Added a fail-closed `pre-commit` `commit-msg` hook. It checks all staged
  paths, including both sides of renames and deletions, against `CODEOWNERS`.
- Owned changes require an exact commit-message token:
  `OWNERSHIP-OVERRIDE: <CODEOWNERS path>`.
- Wired hook installation through `bin/install-git-hooks.py`, which `install.sh`
  invokes.
- The initial checkout lacked the stated existing installer, hook directory,
  protected paths, and execution log; no protected path was changed while adding
  this gate.
- Verification in an isolated Git repository after running `install.sh`:
  deleting `design/fixture.txt` was rejected (exit 1) with the required
  `OWNERSHIP-OVERRIDE: /design/` token; an `outside.txt` commit passed (exit 0).
  A rename from `design/rename-source.txt` to `outside-renamed.txt` was also
  rejected (exit 1), confirming that the source side of renames is checked.
