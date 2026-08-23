# PERF — Fleet landing (research-paper)

Skeleton (S0 precondition): `fleet-pitch.html` is the 3-colour text twin — 6,606 bytes,
0 `<script>` tags, system type, real routes to the evidence paper, all figures from
langgraph-shadow/EVIDENCE.md. It shipped first (commit 23a671c) and stays live as the
plain twin; the design phase styles it, never replaces it.

Measured 2026-08-22:

| Page | Bytes (HTML) | Scripts | Images |
|---|---|---|---|
| fleet-pitch.html (skeleton) | 6,606 | 0 | 0 |
| fleet.html (round 2, rejected media mix) | 51,026 | 1 | 3 avif |
| Treated plate set (lamplight, 13 plates) | 396 KB total | — | 1-bit PNG, 11–52 KB each |

Budget holds: the whole treated image set (13 plates) is smaller than ONE raw S4 plate
(~1 MB). Every plate ships ≤52 KB. No framework, no webfont-blocking (fonts preloaded,
`font-display: swap`), single HTML file per page, no external requests.

Click-ack < 50 ms: pure anchor navigation + CSS-only interactions — nothing async in the
click path. Reduced-motion: all reveals gated behind `prefers-reduced-motion`.
