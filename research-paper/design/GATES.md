# GATES — lamplight.html (S10 evidence)

Page: `design/themes/lamplight.html` · Run date: 2026-08-24

## Machine gates — somebody else's rulebook

Command:

```
node ~/Developer/vedhith-workflow-os/bin/design-gates.mjs design/themes/lamplight.html
```

Exit 0. Per device (axe-core WCAG 2.1 AA + best-practice, reflow SC 1.4.10, resize-text SC 1.4.4 at 200%, geometry clip check):

| Device | axe violations | overflow px | overflow @200% | clipped @200% |
|---|---|---|---|---|
| iPhone 15 (390) | 0 | 0 | 0 | 0 |
| iPad mini (768) | 0 | 0 | 0 | 0 |
| MacBook Air (1440) | 0 | 0 | 0 | 0 |
| Desktop 1080p (1920) | 0 | 0 | 0 | 0 |

INP (1440, motion live, every on-page control clicked): **p75 32 ms** — bar is <100 ms.

What the run forced: a `<main>` landmark, focusable + uniquely-labelled scrollable table regions, `overflow-x:auto` on both table wrappers, `overflow-wrap:break-word` on h2 ("harbourmaster" clipped at 200% zoom on 390px), `#scheduler` reflow fix.

## Lighthouse

Command (server killed same turn, never left running):

```
python3 -m http.server 8734 &   # from research-paper/
npx lighthouse http://127.0.0.1:8734/design/themes/lamplight.html \
  --chrome-flags="--headless=new" --only-categories=performance,accessibility --output=json
kill %1
```

| Category | Score | Bar |
|---|---|---|
| Performance | **99** | ≥95 |
| Accessibility | **100** | ≥95 |

LCP 2.0 s · CLS 0 · TBT 0 ms. What the run forced: fonts subset to latin woff2 (WorkSans 189 KB → 13 KB, Outfit ×2 111 KB → 24 KB, via `pyftsubset --flavor=woff2`), `<link rel="preload">` on the two above-the-fold fonts, `width`/`height` on all four plates (CLS 0), `fetchpriority="high"` on the first plate. Before: perf 90, LCP 3.3 s — the 189 KB TTF was the whole gap.

## Our own rulebook (S7, already green)

`design-prove.py page` — contrast, type scale, spacing grid, hit targets: PASS at 390/768/1440/1920. Palette provenance: `check_palette_from_plates` — bg `#050506` / ink `#bf651d` / accent `#fba503` extract exactly from the six harbour plates in `assets/lamplight/PROVENANCE.json`.
