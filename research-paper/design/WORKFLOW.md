# The design workflow, as actually executed — Fleet landing, S0 → S9

This is the start-to-finish record of one real run of the design pipeline
(`~/Developer/vedhith-workflow-os/design/PIPELINE.md`, machine-parsed by
`bin/design-pipeline.py`). Not the theory — what happened, in order, with the gate
that closed each stage and the failures that were caught on the way. Every stage
below ends with `design-pipeline.py gate <id> <proj>` exiting 0; **a stage is never
complete because a model says so.**

Project: `research-paper/` (the Agent Fleet evidence site). Deliverable: a themed
landing page for the fleet, built through the pipeline instead of hand-styled.

---

## S0 · Skeleton green — the precondition

The product already worked as a 3-colour text site (`index.html`, real numbers from
langgraph-shadow's CI-locked EVIDENCE.md). `design/PERF.md` records the perf budget
state (click < 50 ms acknowledged, view ≤ 100 ms perceived). Design work was not
allowed to open before this existed — build order is function first, design at
project END.

**Gate:** `gate S0` — PERF.md present, > 200 b.

## S1 · Identity brief

`design/identity.md`: audience (a technical buyer who distrusts marketing),
outcome (believe 100% coverage at $319/mo because the evidence is shown), feeling
(a harbourmaster's ledger — unhurried, metered, honest), banned category cues
(purple gradient SaaS, glassmorphism, evenly-spaced feature cards), and the
through-line metaphor: **the harbour at night — lanes, berths, one lamp that stays
on.** Everything downstream (copy voice, plate subjects, motion) traces to this file.

**Gate:** `gate S1` — no placeholders, > 800 b.

## S2 · Reference sheet — before any markup

`design/SOURCES.md`: one row per section, each naming the real site whose flow and
hierarchy that section borrows — layout only, never the visual skin. Writing this
after the markup is the violation; it is an input. The S6/S7 gates later re-read it:
every `<section id>` in the wireframe and the themed page must appear here
(`check: sources-match-markup`).

**Gate:** `gate S2`.

## S3 · Theme briefs — five worlds, not five recolours

`design/themes/BRIEFS.md`: five named worlds, each with a locked style block, subject
list, seed, type pairing and motion grammar. Worlds differ in layout + type + colour
+ motion + subject; "five recolours of one layout" is the failure this stage exists
to prevent. Lamplight (night-harbour photography through one press) and dreamscape
(painterly matte-painting) were both built; three more stayed at brief level with
locked graphs so the S9 picker can offer them honestly.

**Gate:** `gate S3` — ≥ 3 kb, no placeholders.

## S4 · Plates — imagery first, and it must be a real render

`design/themes/PLATES.json` is the manifest; `bin/design-plates.py` runs it.
Graph: **madroid/flux.1-schnell-mflux-4bit · 4 steps · 1344×768**, seeds locked
per subject (3191–3196 harbour, 5101–5105, 4101–4205 mascot poses), style blocks
verbatim in the manifest. Local and free: `mflux` on-device, ~50 s per 768×1344
plate. Untreated sources live in `assets/harbour/` (six night-harbour photographs)
and `assets/mascot/` (the beacon character, drawn separately).

`check: not-black` is load-bearing: the fp8 mirror once completed "successfully"
and wrote a valid pure-black PNG that a size-only check would have passed.

**Gate:** `gate S4` — ≥ 5 plates, each > 200 kb, not black.

## S4t · Treatment — the identity lives here, not in the prompt

The round-2 rejection was three media on one surface: photographic harbour, painted
sea, flat-vector mascot. At 4 steps FLUX renders the subject and ignores style
adjectives, so the identity was moved out of the prompt and into a post-process
**every** plate goes through:

```
design-treat.py --ink #fba503 --paper #050506 --gamma 1.55 --floor 6 --ceil 238
# Bayer 8×8 ordered halftone · scanline period 4, depth 0.22 · 1-bit posterise
# → colorised to one ink on one paper
```

Ordered dither, never Floyd–Steinberg (error diffusion is content-dependent — it
would destroy two plates *differently*, which is the incoherence again). Rejected
along the way: gamma 0.85 (killed the night), floor 34 (laid a dot lattice under
type). Output: 13 treated plates in `assets/lamplight/` at 20–52 KB each (the 1-bit
result compresses ~40×, retiring the image budget as a side effect), plus
`PROVENANCE.json` naming every source — required, because a 1-bit plate can never
prove its own palette.

**Gate:** `gate S4t` — ≥ 5 plates, each > 12 kb, not black.

### The S4t gate weakness, found on this run — still open

**The gate is size-only in the one direction that matters: it passes untreated
plates.** Its checks are "≥ 12 kb" and "not black" — a raw 1.5 MB photograph
dropped into `assets/lamplight/` satisfies both, so the gate cannot tell treated
from raw. The stage whose whole point is "one press for every image" has a gate
that never verifies the press ran. The fix belongs in the gate, not in discipline:
a **palette census** — a treated plate contains only ink and paper (plus
antialiasing between them) *by construction*, so counting distinct colour clusters
against the `PROVENANCE.json` ink/paper pair is a cheap, mechanical proof of
treatment. Recorded in PLAN.md; not yet built.

## S5 · Palette out of the plates — never the other way round

`bin/design-palette.py` over the six **untreated** harbour sources (PROVENANCE.json
points back at them):

```
bg #050506 · ink #bf651d (7.16:1 on bg, lifted along its own hue) · accent #fba503
```

`design/theme.md` records the palette, type pairing (Outfit display / Work Sans
body / mono numerals), motion grammar (lamp-flicker on desynced 7 s/11 s vars,
press-reveal), and the locked graph + treatment line. The first page shipped
`#05060c` — invented, one hex off — and the S7 gate's `palette-from-plates` check
failed it; the plates were re-treated to match the extraction, not vice-versa.

**Gate:** `gate S5`.

## S5c · Character

The Fleet beacon mascot: generated poses (S4), then **quoted into the same press**
(S4t) — the mascot appears on the surface only as `mascot-0N--treated.png`, never
as the flat-vector SVG (that was the round-2 media clash). `design/character/`
holds the SVG construction; the themed page uses treated plates only.

**Gate:** `gate S5c`.

## S6 · Wireframe + S6i · Interaction map

`design/wire/index.html`: boxes, flow, real copy, zero styling; every section id
matches SOURCES.md (`check: sources-match-markup`). `design/INTERACTIONS.md`: one
behaviour per role from `lib/interactions.css` — primary action gets the roll
(label rolls up like the next ledger line), plates get grain-swell, quiet surfaces
get the ledger-line hover; nobody invents a thirteenth behaviour by accident.

**Gates:** `gate S6`, `gate S6i`.

## S7 · Themed page — apply the world, then prove it on the render

`design/themes/lamplight.html` = wireframe + plates + tokens + the mapped
behaviours. The gate runs `bin/design-prove.py` at 390/768/1440: contrast is
proved **on rendered pixels** (text hidden, backdrop sampled at the 5th/95th
luminance percentile), not read off the CSS — plus measure (45–75 ch), hit boxes,
type scale, `sameness` (AI-look detector) and `palette-from-plates`.

What the render-prover actually caught on this run, none of it visible in CSS:

- **The chip and nav CTA sat over the hero plate's hot corner** — solid paper
  fills, hairline chip border (30% ink). A CSS-walk checker would have passed both.
- **Elements' own 1px borders became their sampled backdrop**: the evidence tags
  (`SIMULATED`, `UNVERIFIED`) at 55% ink/lamp border weight failed 4.5:1 against
  their own outline (2.85–3.65:1). Fix from the theme's vocabulary: tags dropped
  to the same **hairline weight (32%)** the chip already established — one border
  system page-wide.
- **The ghost button was transparent over the plate at 390px** — the wrapped CTA
  row lands on the plate's water; same rule as the nav CTA: solid paper fill.
- Flaky prover runs (lamp-flicker animating during capture) were fixed upstream in
  the prover itself: freeze transitions, inset sampling past the element's border.

**Gate:** `gate S7` — PASS at all three widths, twice consecutively (flake check).

## S8 · Shot critic — the gate that can see

`bin/design-shot-critic.py <page> --theme theme.md`: renders **desktop fold, full
page (reduced-motion forced), phone** via playwright-core CDP
(`captureBeyondViewport`), then a **fresh `claude -p` Sonnet session** gets the
PNGs and a hostile rubric — never the code, the brief, or the conversation.
Items 1–3 (world, imagery, AI-look) are hard fails that craft cannot outvote.

Render gotchas that cost real time, now recorded: ESM ignores NODE_PATH so
playwright-core's absolute path is resolved by the caller
(`~/.hermes/node/lib/node_modules/playwright-core`); the headless shell glob is
`chromium_headless_shell-*`; and **`loading="lazy"` plates lose the race in a
capture that never scrolls** — the third plate band rendered 0 px tall in the full
shot until lazy was dropped. The full-page capture forces
`prefers-reduced-motion`, so anything missing there is also missing for every
reduced-motion user: the lazy bug was an accessibility-adjacent defect, not a
screenshot artifact.

**Verdict: PASS** (three official runs, before and after the fixes below).
Critic craft notes acted on: the phone headline orphaned "month." (no-break join),
the price pill sat off the button baseline (`align-items: baseline`), and the
lower half of the page went imagery-dark — answered with a third plate band
(the seawall lamp) before the Honesty section, plus the global paper halftone.

**Scored comparison, same scale.** The four gold-standard pages were re-scored
with the identical 7×0–10 rubric, same model, same hostile prompt, so the numbers
are comparable (the prior session's kinder scale gave Stripe 49, Linear 48,
Cursor 43, Inkbox 37 — every gold shares one failure: **the world dies mid-page**):

| page | score /70 |
|---|---|
| **Fleet lamplight (ours)** | **38–40** (three runs: 40, 38, 39) |
| Linear | 36 |
| Stripe | 32 |
| Cursor | 28 |
| Inkbox | 21 |

Ours outscores the whole gold field on the same scale; excluding the phone item
(golds have no phone shots) it still ties or beats the leader, 33–34/60 vs 33/60.
The margin is exactly the anti-"dies mid-page" moves: plate bands spaced through
the document and the paper texture running under everything.

**Gate:** `gate S8` — three shots on disk, > 20 kb each, not black.

## S9 · The picker — a file:// artifact, never a server

`design/picker.html`: neutral chrome (so it doesn't pre-sell a candidate), the two
built worlds shot desktop + phone, the three briefed worlds presented from their
locked briefs. Opened over `file://`. No server was started at any stage of this
pipeline — renders, proofs and critiques all ran on `file://`.

**Gate:** `gate S9`. **S10 (apply project-wide + machine gates) is blocked on his
pick — by design.**

---

## The shape of the whole run, compressed

1. Function first; design only opened at project end (S0).
2. Words before pixels: identity → borrowed layouts → five worlds (S1–S3).
3. Imagery before markup, and imagery is *rendered*, never asserted (S4).
4. **Identity = process, not prompt**: one press over every plate (S4t) — and the
   gate for this stage is the one found wanting (size-only; palette census needed).
5. Palette extracted out of the plates, enforced later against the live render (S5, S7).
6. Layout and behaviour written down before styling (S6, S6i).
7. Every "done" proved on rendered pixels by machines (S7) and judged by fresh
   eyes that never saw the code (S8), against real-world gold pages on one scale.
8. The human picks from a file, not a server (S9); application waits for the pick (S10).
