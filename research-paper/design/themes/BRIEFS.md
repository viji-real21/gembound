# Theme briefs — five worlds for the Fleet landing

All five share the identity (night-watch trust, harbour metaphor, honesty-first) and
differ in layout + type + colour + motion + subject. Two are plated and built
(lamplight, dreamscape); three are briefed with locked graphs, plates on demand —
recorded here so the picker's 5-way choice is real, not five recolours.

---

## 1. lamplight — BUILT (the S4t coherence fix)

**World.** A harbourmaster's night ledger printed in one ink. Every image — photographic
harbour, painted sea, mascot — passes through one ordered-dither halftone press, so the
page reads as a single printed material under sodium light.

**Locked graph.** madroid/flux.1-schnell-mflux-4bit, 4 steps, 1344×768, seeds 3191–3196
(harbour), 5101–5105 (dreamscape sources), 4101/4204/4205 (mascot). Style blocks verbatim
in `PLATES.json`.
**Locked treatment (the identity lives here, not in the prompt):**
`design-treat.py --ink #fba503 --paper #050506 --gamma 1.55 --floor 6 --ceil 238` — cell 3 Bayer 8×8
ordered halftone, scanline period 4 depth 0.22. PROVENANCE.json names all 13 sources.

**Palette out of plates** (design-palette.py over harbour set): bg `#050506`,
ink `#bf651d`, accent `#fba503`; ink-on-bg 7.16:1.
**Type pairing.** Outfit (display, from round 2's licensed set) + Work Sans (text) +
mono for numerals/provenance tags.
**Motion grammar.** Lamp-flicker on the accent dot (2 motifs: nav chip + CTA dot,
desynced CSS vars); scroll reveals 1.4s; hero drift 1.06 on the plate; all gated behind
prefers-reduced-motion; bookend: hero lamp motif returns at the footer colophon.
**Subjects.** Moored hulls, bollards, coiled rope, mast antennae, gangway, sparks over
water; lantern-beacon mascot.

## 2. dreamscape — BUILT (his round-2 pick, mascot fixed to match)

**World.** Painterly matte-painting night: indigo starfield, cumulus catching last
light, near-black mountains. The medium is *gouache*, so every element on the page must
be painted — the mascot ships through the same treatment or as a painted plate, never
flat vector (that was the round-2 defect).
**Locked graph.** Same model; 1344×768; seeds 5101–5105; the dreamscape style block in
`PLATES.json` verbatim.
**Palette out of plates.** bg deep indigo `#0b0d1f`-family, ink starlit cream, accent
dusty rose band — extract with design-palette.py at S5 if picked.
**Type.** Fraunces (soft display serif) + Work Sans. **Motion.** Slow cloud parallax
(60s loop), star twinkle at 2 desynced periods; reveals 1.7s.
**Subjects.** Lone sailboat, foreshore + birds, cumulus over ridges, mirrored lake.

## 3. signal-flags — briefed, plates on demand

**World.** International maritime signal flags: hard-edged geometric panels, daylight,
navy/white/red on bone. Layout becomes flag-grid modules (each section a hoist);
headline typography interleaves flag glyphs.
**Locked graph.** Same model, 4 steps, 1024×1024, seeds 6201–6206; style: "flat
geometric maritime signal flag composition, hard edges, screen print, navy white
signal-red on bone paper, off-register by 1px, no text". Treatment: none needed — the
subject IS flat; palette locked by the flag system.
**Type.** Archivo Black + IBM Plex Mono. **Motion.** Flag-hoist reveals (clip-path
rise, 0.9s stagger); crisp, no drift.

## 4. chart-room — briefed, plates on demand

**World.** The navigation chart table: engraved-linework nautical charts on cream,
depth soundings as data texture, compass roses, red course-plot lines. Sections sit as
chart insets with neat-line borders and margin annotations.
**Locked graph.** Seeds 6301–6306, 1344×768; style: "antique nautical chart, fine
engraved linework, cream paper, soundings and hachures, single red plotted course line,
no text, no labels". Treatment: `--ink #1d2a44 --paper #f4ecd9` (dark ink on cream —
the light-mode world), accent picked from the plotted-course red.
**Type.** Spectral (bookish serif) + mono annotations. **Motion.** Course line draws on
scroll (SVG stroke-dashoffset scrubbed); compass needle settles on section enter.

## 5. dead-reckoning — briefed, plates on demand

**World.** The instrument panel at night: radar sweep greens, phosphor CRT glow,
engraved bezels. The page is the bridge at 3am — coverage becomes a radar plot, lanes
become instrument dials.
**Locked graph.** Seeds 6401–6406, 1024×1024; style: "night ship bridge instrument,
radar CRT phosphor glow, deep black, single green trace, film grain, no text".
Treatment: `--ink #37e08c --paper #020604 --gamma 1.6` — same press as lamplight,
different ink, so the two night worlds stay materially coherent siblings.
**Type.** Space Grotesk + mono everywhere (instrument voice). **Motion.** Radar sweep
(8s rotation, one per page), numeric odometer ticks on scroll enter.

---

**Why five and not five recolours:** 1 is a print press, 2 is a painting, 3 is daylight
geometry, 4 is light-mode engraving, 5 is instrument glow — different layout modules,
type, colour temperature, motion grammar and subjects each.
