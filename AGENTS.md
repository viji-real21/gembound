# Rules for AI agents (Cursor, Codex, any AGENTS.md reader)

<!-- Portable copy of ~/.claude/CLAUDE.md (Claude Code reads that itself); this is for
     every other tool. Copy into any new project root. -->

## Responses (ADHD-friendly, always)
No walls of text or complicated words. **Answer first**: one short sentence, the outcome, before anything else. **Short** sentences, paragraphs ≤ 3. **Simple words**; unavoidable jargon gets a plain gloss inline. **Chunk**: one idea per bullet, small sections, clear headers. **Bold the key word** per point so I can skim. **Action items = numbered checklist**, clearly marked, never buried in prose. **Cut nice-to-know**: only what changes my next step; offer "want more detail?", don't dump.

## Code
Simple/boring; fewer files + abstractions, no speculative flexibility. TypeScript for new web apps; a repo's existing stack beats preference. Never half-done: implement, test, verify, report.

## Glossary
**Intelligence** = hardest problem handled unsupervised · **Taste** = UI/UX, code, API design, copy · **Shell out** = call another model from the terminal · **Trumped** = PR/branch obsoleted by a better PR or already-merged work.

## Model routing
`codex` CLI: installed, effectively free on my OpenAI sub; zero conversation context → prompt it short, self-contained, exact paths, expected output format. Missing/not logged in → say so plainly, do the work yourself.
- **Bulk mechanical** (clear-spec impls, migrations, log digging, big specs/PDFs) → `codex exec -s read-only "<self-contained prompt>"` to investigate; `codex exec -s workspace-write --cd <worktree> "<spec>"` for bounded impl in a git worktree.
- **Computer use / app verification** (browser automation, screenshots, testing a flow) → Codex; it saves screenshot evidence to a temp dir, reports pass/fail per step. Verify its claims before reporting them to me.
- **Independent code review** → Codex read-only on the diff; verify important findings against the actual code before presenting. Found nothing → say so clearly + what it inspected.
- **User-facing** (UI, copy, API design) → highest-taste Claude model available. Judge output, not price tag; escalate smarter without asking if it misses the bar.

## Git, GitHub, PRs
**CURRENT MODE: prototype.** No PRs — commit + push every completed change straight to main automatically, small clear commit messages. When the user says the site is live, delete this line, switch to shipped mode.
Shipped mode (dormant until launch): worktrees for parallel/risky work, never experiment on the main checkout · multi-PR: plan in `TODO.md`, tick off + commit as you go · one bounded concern per PR, per the repo's guidelines · no merge till the PR's automated code reviewers approve · merge to main = staging deploy only, production always human-in-the-loop · **end every task report with the save level** so I know where the work lives: `Status: edited only`/`committed (local)`/`pushed`/`PR: <link>` — never say "done" without it.
