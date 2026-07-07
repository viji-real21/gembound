# Rules for AI agents (Cursor, Codex, and anything that reads AGENTS.md)

<!-- Portable copy of ~/.claude/CLAUDE.md. Claude Code reads that file automatically;
     this file is for every other tool. Copy it to the root of any new project. -->

## How to write responses to me (ADHD-friendly — always)

I don't process walls of text or complicated words. Every response:

- **Answer first.** One short sentence with the outcome, before anything else.
- **Short everything.** Short sentences. Paragraphs of 1–3 sentences max.
- **Simple words.** If a technical term is unavoidable, explain it in plain words right there.
- **Chunk it.** One idea per bullet. Small sections with clear headers.
- **Bold the key word** of each point so I can skim.
- **Action items = numbered checklist**, clearly marked, never buried in prose.
- **Cut the nice-to-know.** Give me what changes my next step. Offer "want more detail?" instead of dumping it.

## Code style & defaults

- Prefer simple, boring solutions. Fewer files, fewer abstractions, no speculative flexibility.
- Default to TypeScript for new web apps. Match the existing stack of a repo over personal preference.
- Never leave work half-done: implement, test, verify, then report.

## Glossary

- **Intelligence** — how hard a problem the model can handle unsupervised.
- **Taste** — UI/UX quality, code quality, API design, and copy.
- **Shell out** — call another model from the terminal.
- **Trumped** — a PR/branch made obsolete by a better PR or by work already merged.

## Model routing

The Codex CLI (`codex`) is installed and effectively free on my OpenAI subscription.
Route work accordingly:

- **Bulk mechanical work** (clear-spec implementations, migrations, log digging, big
  specs/PDFs): shell out to Codex — `codex exec -s read-only "<self-contained prompt>"`
  for investigation, `codex exec -s workspace-write --cd <worktree> "<spec>"` for
  bounded implementation in a git worktree.
- **Computer use / app verification** (browser automation, screenshots, testing a flow):
  shell out to Codex; have it save screenshot evidence to a temp dir and report
  pass/fail per step. Verify its claims before reporting them to me.
- **Independent code review**: run Codex read-only against the diff, then verify the
  important findings against the actual code before presenting them. If it finds
  nothing, say so clearly and state what it inspected.
- **Anything user-facing** (UI, copy, API design): keep with the highest-taste Claude
  model available. Judge the output, not the price tag — escalate to a smarter model
  without asking if the output doesn't meet the bar.
- Prompt Codex simply: short, self-contained, exact paths, expected output format.
  It has no context from the conversation.
- If the Codex CLI is missing or not logged in, say so plainly and do the work yourself.

## Git, GitHub, and PRs

**CURRENT MODE: prototype.** No PRs for now — commit and push every completed change
straight to main automatically, with small clear commit messages. When the user says the
site is live, delete this line and switch to the shipped-mode rules below.

Shipped-mode rules (dormant until launch):

- Work in git worktrees for anything parallel or risky; never experiment on the main checkout.
- For multi-PR efforts: write the plan to `TODO.md`, check items off and commit it as you go.
- One bounded concern per PR. Open PRs following the repo's guidelines.
- Do not merge until the automated code reviewers on the PR have approved.
- Merging to main deploys staging only. Production deploys are always human-in-the-loop.
- **End every task report with the save level**, so I always know where the work lives:
  `Status: edited only` / `committed (local)` / `pushed` / `PR: <link>`. Never say "done"
  without it.
