# theme: lamplight

**World.** A harbourmaster's night ledger, printed in one ink. Every image on the page
— photographic harbour, painted sea, the lantern-beacon mascot — has been through one
press: Bayer 8×8 ordered halftone, scanline bias, 1-bit posterise, colorised to one ink
on one paper. The page itself is the same print: one ink, one paper, one lamp.

**Palette — extracted from the plates** (`design-palette.py` over the 6 harbour
sources; PROVENANCE.json in `assets/lamplight/` names them):

| role | value | from |
|---|---|---|
| bg (paper) | `#05060c` | darkest weighty cluster / the treatment's paper |
| ink | `#bf651d` | lightest weighty cluster, lifted along its own hue — 7.16:1 on bg |
| accent | `#fba503` | most saturated cluster — the sodium lamp, and the treatment's ink |

Neutrals are the ink at reduced opacity (55% for demoted lines) — never grey. Accent on
one element per screen (the lamp dot / the live chip), area well under 10%.

**Type pairing.** Outfit (display, Bold + Regular, OFL, self-hosted) for headings;
Work Sans (Regular, OFL) for body; monospace (system) for numerals, provenance tags and
the price line. ≤6 sizes. H1 tracking −0.005em; micro-labels uppercase mono 0.2em.

**Motion grammar.** Two repeated motifs, desynced CSS vars, bookended:
1. *lamp-flicker* — the accent dot breathes on a 7s/11s pair (nav chip + hero CTA dot),
   returning on the footer colophon dot (the bookend).
2. *press-reveal* — sections develop like a print pulled off the bed: 1.4s opacity/blur
   reveal, 24vh graduated seam between hero and body, no hard edge.
Hero plate drifts at 1.06 over 20s. All of it dies under `prefers-reduced-motion`;
2.5s failsafe reveal.

**Locked graph (S4).** madroid/flux.1-schnell-mflux-4bit · 4 steps · 1344×768 ·
seeds 3191–3196 / 5101–5105 / 4101–4205 · style blocks verbatim in `themes/PLATES.json`.
**Locked treatment (S4t — the identity lives here).**
`design-treat.py --ink #fba503 --paper #05060c --gamma 1.7 --floor 34`
(cell 3, scanline period 4 depth 0.22). Re-running this line on any future plate is what
keeps the world one material.

**Mascot rule.** The mascot appears only as a treated plate (`mascot-0N--treated.png`)
— never the flat-vector SVG on this surface (that was the round-2 media clash). Nav
uses the wordmark + a 1-colour lamp glyph, not the character.
