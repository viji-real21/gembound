# Design-pipeline benchmark: Workflow OS, Google, Amazon, and open standards

**Date:** 2026-08-25
**Scope:** public, first-party evidence only. Internal Google and Amazon production pipelines are not public, so this compares the practices their public systems actually expose—not undocumented internal tools and not their visual style.

## Answer first

Keep Workflow OS's strongest idea: **generate five distinct design worlds, let Vedhith choose, refine three, then apply one**. Improve it by making each option a small, real system—not a themed page—and by carrying the chosen system through neutral tokens, components, backend-driven UI states, motion rules, asset provenance, and CI.

The target is not “make products look like Material or AWS.” It is **use the same class of engineering discipline** visible in Material and Cloudscape: named token layers, documented components and patterns, accessibility built into components, stable testing surfaces, consistent motion, and automated release gates.

Adopt [DTCG Format 2025.10](https://www.designtokens.org/TR/2025.10/format/) as the neutral token source, then compile it with [Style Dictionary](https://github.com/style-dictionary/style-dictionary) into CSS and TypeScript. DTCG 2025.10 is a stable JSON interchange format from the Design Tokens Community Group; it is a Community Group report, **not** a W3C Recommendation. The [official DTCG repository lists both Amazon and Google as represented organizations](https://github.com/design-tokens/community-group), which makes it a directly relevant shared standard. Representation does **not** prove that either company's internal pipeline has adopted this exact format, so the honest claim is “the current open industry standard,” not “their internal format.”

## 1. Current Workflow OS: what is real now

The governing source is [`design/PIPELINE.md`](/Users/vedhith/Developer/vedhith-workflow-os/design/PIPELINE.md), not Flintted. Flintted is one proof case.

| Area | Current evidence | Assessment |
|---|---|---|
| Executable sequence | `PIPELINE.md:1-39` defines parsed `input/run/output/gate` stages; a stage is complete only when its gate exits 0. | **Keep.** This is stronger than a prose checklist. |
| Full-stack precondition | `PIPELINE.md:52-75` requires real routes, real data, and a working three-colour skeleton before design. | **Keep, then extend.** It establishes function-first work but does not yet formalize API-derived UI states. |
| Variant generation | `PIPELINE.md:118-136` requires five worlds distinct in layout, type, colour, motion, and subject. | **Keep.** This prevents five recolours of one idea. |
| Image system | `PIPELINE.md:139-217` requires rendered plates, a locked graph, a non-black gate, consistent treatment, and provenance. The image guide defines one executable graph per project/theme (`design/image-pipeline/README.md:6-14,71-81`). | **Strong but partial.** Reproducibility exists; rights, safety, accessibility metadata, and content credentials are not complete gates. |
| Theme and interaction lock | `PIPELINE.md:220-236,287-304` locks palette, type, prompt/seed, motion grammar, and one named interaction per role. | **Keep.** Move the choices into typed system artifacts. |
| Coverage | `PIPELINE.md:307-339` gates marketing, app, and docs sheets, rather than proving only the landing page. | **Good direction.** Add route-to-pattern and route-to-state coverage. |
| Human selection | `PIPELINE.md:377-396` defines the 5 → 3 → 1 picker. | **Core advantage. Preserve it.** Move the first pick earlier so five worlds do not each require a near-production build. |
| Accessibility and performance | `design-gates.mjs:35-195` runs axe across four device profiles, reflow, 200% text, and interaction timing; `design-pipeline.py:1021-1082` reruns the gate rather than trusting a report. | **Useful but incomplete.** It targets WCAG 2.1 tags, not current WCAG 2.2; Lighthouse is explicitly not run; no maintained visual baseline exists. The JS records `clipped200`, but the Python result parser does not currently fail on that field. |
| Component system | `design/kit/README.md:12-58` exposes a React package and anti-drift validation over tokens, drivers, and CSS classes. | **Candidate, not finished.** CSS remains the source; there is no DTCG source or multi-platform compilation. |
| State workbench | `design/kit/README.md:90-111` has an HTML fixture, while Storybook and the custom-effects package are explicitly not built. | **Gap.** Component states are not yet first-class review and test cases. |
| Motion | `design/entries/motion-language.md:1-41` defines a shared duration/easing scale. | **Good seed, partial system.** It needs semantic roles, per-component state contracts, reduced-motion alternatives, and deterministic tests. |

### Current live proof, with the right caveat

On 2026-08-25, `design-pipeline.py doctor` resolved all **52 prior-art claims across 14 stages**. A live `status /Users/vedhith/Developer/flintted` passed S0–S6i, S8, and S9. S7 and S10 failed because Chromium exited with **SIGABRT**, leaving `design-prove` / `design-gates` with no readable result.

That is a **current verification failure caused by the browser environment**, not proof of a Flintted design defect. The historical `GATES.md` is stale evidence and must not be treated as a current pass.

## 2. What Google and Amazon publicly demonstrate

| Practice | Google: public evidence | Amazon: public evidence | What Workflow OS should copy |
|---|---|---|---|
| System structure | [Material 3](https://m3.material.io/) publishes foundations, styles, components, and patterns. Material Web documents reference → system → component token layers and CSS-variable theming in its [theming guide](https://github.com/material-components/material-web/blob/main/docs/theming/README.md). | [Cloudscape](https://cloudscape.design/) publishes foundations, components, patterns, demos, and tools; its [design-token guide](https://cloudscape.design/foundation/visual-foundation/design-tokens/) names reusable visual decisions. | Primitive/reference → semantic/system → component tokens; components sit above tokens; patterns sit above components. |
| Platform delivery | Google's public implementations are platform-specific: [Material 3 for Jetpack Compose](https://developer.android.com/develop/ui/compose/designsystems/material3) maps colour, typography, and shape into Android APIs, while Material Web uses web components and CSS variables. | Cloudscape ships an [Apache-2.0 React component library](https://github.com/cloudscape-design/components) and CSS/token outputs for web. | Keep one neutral token source, then compile per platform. Do not make React constants or CSS the universal source. |
| Accessibility | Android's [Compose accessibility testing guidance](https://developer.android.com/develop/ui/compose/accessibility/testing) combines automated checks with manual TalkBack and Switch Access testing. Material components expose semantics through platform APIs. | Cloudscape components and patterns publish accessibility guidance, and its testing layer gives consumers stable helpers rather than asking them to depend on internal DOM. | Accessible component contracts, automated WCAG gates, and a required manual keyboard/screen-reader pass for critical flows. |
| Stable tests | Material's public repos include implementation tests, but Google does not publish one universal cross-product test API. | Cloudscape explicitly warns that component DOM can change and provides [stable DOM and browser test utilities](https://cloudscape.design/get-started/testing/introduction/) as the supported test surface. | Own stable test adapters such as `button.findLoadingIndicator()` or `table.findRows()`. App tests should not couple to private markup. |
| Motion | Material publishes motion guidance and motion tokens, although [Material Web does not implement system motion tokens](https://github.com/material-components/material-web/blob/main/docs/theming/README.md). | Cloudscape publishes [curves, durations, transition patterns, reduced-motion behavior, and a test-time motion switch](https://cloudscape.design/foundation/visual-foundation/motion/). | A small semantic motion grammar, reduced-motion equivalents, and one deterministic way to disable/finish animation in tests. |
| Theme constraints | Material exposes systematic colour generation through the Apache-2.0 [Material Color Utilities](https://github.com/material-foundation/material-color-utilities). | Cloudscape's [theming API](https://cloudscape.design/foundation/visual-foundation/theming/) supports selected visual decisions but intentionally does not let themes rewrite spacing, motion, or iconography; it prefers build-time output where possible for performance, CSP, and server rendering. | Let worlds vary enough to be distinct, then freeze structural invariants after selection. A theme is not permission to fork every component. |

### Public evidence is not the internal pipeline

- **Google:** Material guidance, utilities, Android libraries, and web code are public. However, the Material team says [Material Web is in maintenance mode because engineers moved to Google's internal Wiz framework](https://github.com/material-components/material-web/discussions/5642). Wiz's pipeline is not public. Material Web therefore remains useful evidence, but it is a poor new runtime foundation for Workflow OS.
- **Amazon:** Cloudscape's guidance and React source are public under Apache 2.0. Amazon does not publish the complete internal AWS design review, authoring, release, or compliance pipeline. We can reproduce Cloudscape's visible practices, not claim internal equivalence.

## 3. Open, closed, and partly open options

“Best” has no objective single winner. The evidence shows that the **foundation can remain open**. Closed parts cluster around hosted authoring/review tools and frontier image models.

| Option | Classification | Use here |
|---|---|---|
| [DTCG 2025.10](https://www.designtokens.org/TR/2025.10/format/) + [Style Dictionary](https://github.com/style-dictionary/style-dictionary) | **Open standard + Apache-2.0 compiler** | Recommended token source and platform build step. |
| [Cloudscape](https://github.com/cloudscape-design/components) | **Open source, Apache-2.0** | Best public Amazon reference for components, patterns, test helpers, and motion discipline. Borrow practices, not its AWS look. |
| [Material Color Utilities](https://github.com/material-foundation/material-color-utilities) / [Material Theme Builder](https://github.com/material-foundation/material-theme-builder) | **Open source, Apache-2.0** | Useful colour math and theme export references. Do not adopt Material Web as the main kit while it is in maintenance mode. |
| [Carbon](https://github.com/carbon-design-system/carbon) | **Open source, Apache-2.0** | Strong reference for tokens, React/web components, icons, and a documented motion package. |
| [Fluent UI](https://github.com/microsoft/fluentui) | **Mostly open source, MIT** | Strong component-pattern and token reference; check separate asset/font licences before reuse. |
| [React Spectrum / React Aria](https://github.com/adobe/react-spectrum) | **Open source, Apache-2.0** | Strong accessible behavior layer; React Aria is valuable when Workflow OS wants its own visual identity. |
| [Storybook](https://github.com/storybookjs/storybook) + [Playwright](https://github.com/microsoft/playwright) | **Open source** | Recommended state workbench, interaction tests, and self-hosted visual baselines. |
| Chromatic | **Closed hosted service around open Storybook** | Optional convenience, not required. [Chromatic's docs](https://www.chromatic.com/docs/quickstart/) require a hosted project/token; Playwright can keep the core gate self-hosted. |
| Figma core | **Closed product; public Plugin and REST APIs** | Optional authoring adapter, never the source of truth. Figma documents the boundary in its [API comparison](https://developers.figma.com/compare-apis/) and [Plugin API](https://developers.figma.com/docs/plugins/). |
| Rive | **Partly open** | Runtimes are public, including the [MIT web runtime](https://github.com/rive-app/rive-wasm); the editor is a hosted authoring product. Use only behind an exported-asset contract. |
| ComfyUI + FLUX.1-schnell | **Open graph runtime; model-specific licence** | [ComfyUI is GPL-3.0](https://github.com/comfyanonymous/ComfyUI). [FLUX.1-schnell code/weights are Apache-2.0](https://github.com/black-forest-labs/flux); other FLUX variants have different terms. Pin the exact model and licence in the asset manifest. |
| Google Imagen / Amazon Nova Canvas | **Closed hosted models** | Optional lanes, not required for the pipeline. Google documents [Imagen with SynthID](https://deepmind.google/models/imagen/). AWS's [Nova Canvas service card](https://docs.aws.amazon.com/ai/responsible-ai/nova-canvas/overview.html) explicitly calls it proprietary and documents invisible watermarking plus C2PA Content Credentials. Their model internals and production pipelines are not open. |

Use “open source” carefully for AI. The [Open Source AI Definition](https://opensource.org/ai/open-source-ai-definition) requires more than downloadable weights. Classify each model by its exact release and licence; never label a whole vendor open.

## 4. Gap analysis

| Gap | Risk | Target change |
|---|---|---|
| Tokens are CSS/TS values, not neutral exchange data. | Design decisions cannot be validated or compiled consistently across web, future mobile, docs, and image tools. | DTCG 2025.10 source; Style Dictionary outputs; generated files fail CI when stale. |
| Five worlds are proved as themed pages before the picker. | High effort is spent on four concepts that will be rejected; full-stack states can still be missed. | Make five comparable **system slices**, pick, create three deeper refinements, pick, then expand one system project-wide. |
| Components have a package and fixture but no Storybook. | States, variants, accessibility, and motion are hard to review together. | One story per meaningful state; stories become shared design, documentation, and test fixtures. [Storybook treats stories as UI test cases](https://storybook.js.org/docs/writing-tests). |
| “Real data” is required, but API and UI-state contracts are not explicit artifacts. | Loading, empty, partial, long-content, permission, offline, and error states drift from backend behavior. | Use [OpenAPI](https://spec.openapis.org/oas/latest.html) or the repo's typed API schema to generate fixtures; map every endpoint state to a pattern/story/route. Test mocked contracts and real-service flows separately. |
| Current accessibility automation targets WCAG 2.1. | It misses new 2.2 success criteria and automated tools never cover every human interaction. | Target [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/), use [ARIA APG](https://www.w3.org/WAI/ARIA/apg/) patterns, keep axe, and require manual keyboard/screen-reader/reduced-motion checks on critical flows. |
| No maintained screenshot baseline; Lighthouse is documented but not executed by S10. | Visual drift and performance regressions can merge without a reproducible comparison. | Run served Storybook/app builds in CI. Store Playwright `toHaveScreenshot()` baselines in version control and run them in a pinned environment, as [Playwright recommends](https://playwright.dev/docs/test-snapshots). Run Lighthouse against the same ephemeral server. |
| Motion has numeric tokens but no state matrix. | Teams can reuse durations while still inventing inconsistent effects and reduced-motion behavior. | Add semantic motion roles, component transition tables, reduced-motion alternatives, and deterministic test behavior. |
| Image manifests reproduce generation but do not fully govern the asset lifecycle. | Licence, source, consent, accessibility, and provenance can be lost after generation or editing. | Add hashes, exact model/licence, prompt/seed/input references, reviewer, alt text, use restrictions, and C2PA where supported. |

## 5. Recommended target pipeline

This extends the existing sequence; it does not replace the picker.

1. **S0 — product contract.** Keep the real walking skeleton. Add a route inventory, OpenAPI/typed API inventory, auth/permission matrix, and required UI states: default, loading, empty, partial, error, offline/retry, long/localized content, destructive confirmation, and success.
2. **S1–S2 — identity and references.** Keep the audience, outcome, banned cues, and section-level source sheet. Add licences/usage rights for every external visual reference.
3. **S3–S4 — five system slices.** Each world must show the same comparable slice: one marketing surface, the hardest app route, phone layout, one dense state, one empty/error/loading set, one image plate/treatment, and one motion specimen including reduced motion. Lock model, seed, style, type, and motion intent for each world.
4. **Pick 1 — 5 → 3.** Put the five slices in one picker. Record the decision and reasons as data. Do not build every production route for all five.
5. **Three refinements.** Expand the selected direction into three variants of the **same system**, not three unrelated themes. Each refinement carries DTCG tokens, a small component set, representative patterns, asset manifest, and motion state table.
6. **Pick 2 — 3 → 1 and system lock.** Freeze the chosen token set, component behavior, imagery graph, motion grammar, and route/state coverage contract. Changes after this point require an explicit system-level decision.
7. **Compile.** Style Dictionary validates and builds DTCG tokens into CSS custom properties, typed TypeScript, Storybook theme data, and—when needed—Android/iOS formats. Primitive tokens feed semantic tokens; semantic tokens feed components. Generated outputs are never hand-edited.
8. **Component workbench.** Publish `@vedhith/design-kit` in Storybook. Every component owns documented variants, interaction states, error/help text, keyboard model, ARIA contract, motion transitions, and reduced-motion behavior. Add project-owned stable test helpers modeled on Cloudscape.
9. **Patterns and full-stack integration.** Compose components into named patterns such as authentication, search/results, table/filter, editor/save, billing, onboarding, and destructive confirmation. Bind stories to API-contract fixtures, then apply the chosen system to every real route. A mock pass proves state rendering; a real-service pass separately proves integration.
10. **Release gates.** Validate token schema/aliases and generated drift; run component unit/interaction/a11y tests; build Storybook; run Playwright visual comparisons; run route-level axe, reflow, 200% text, keyboard, reduced motion, and real-flow tests; verify API contracts; run Lighthouse from a temporary served build; validate asset licence/provenance/alt metadata. Snapshot updates require review, never an automatic overwrite.
11. **Version and learn.** Version the kit and tokens, publish a change log and migration note, track which projects consume which version, and feed verified project corrections back into Workflow OS.

## 6. Image-generation governance

Keep the current one-graph-per-theme rule. It is the right unit for visual consistency. Add an `ASSETS.json` entry for every accepted asset:

- source type (`generated`, `licensed`, `original`, `stock`), content hash, output dimensions, and intended placements;
- exact generator/runtime/model/version/licence, prompt, negative prompt if applicable, seed, sampler, steps, source-image hashes, and post-process graph;
- rights/consent and restricted-use notes, safety review, human approver, alt text or explicit decorative status;
- provenance/content credentials. The [current C2PA specifications index](https://spec.c2pa.org/specifications/) defines the versioned technical standards for recording origin and edits. C2PA can make provenance tamper-evident, but provenance does not by itself establish that content is true;
- reproducibility gate, perceptual/duplicate check, palette/treatment check, and “no generation during production builds.” Production consumes reviewed, versioned assets only.

Hosted Google/AWS generation may be optional adapters. The base workflow must work with ComfyUI plus a correctly licensed local model so the system is not locked to a closed service.

## 7. Consistent UI motion

Represent durations, cubic Bézier curves, and transitions as DTCG token types, then add semantic roles above the raw numbers:

| Role | Contract |
|---|---|
| `feedback.instant` | Press/toggle acknowledgement; never blocks input. |
| `state.enter` / `state.exit` | Enter is gentle; exit is shorter; focus target is stable. |
| `surface.change` | Panel, route, disclosure, and modal transitions share direction and timing rules. |
| `attention.brand` | Rare authored motion; cannot delay task completion or hide content. |
| `data.update` | Preserves object identity so values do not appear to teleport. |
| `reduced.*` | Replace travel/parallax/continuous motion with instant state, opacity, or a short non-spatial transition. |

The browser exposes the user's reduced-motion preference through [`prefers-reduced-motion`](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion). Every animated component story must show start, active, end, interrupted/reversed, and reduced states. Tests should finish or disable motion through one supported adapter; screenshot tests should use the same pinned behavior. Cross-document View Transitions can be an enhancement, but [CSS View Transitions Level 2](https://www.w3.org/TR/css-view-transitions-2/) is still a Working Draft, so core meaning and navigation cannot depend on it.

## 8. Phased adoption

1. **Make proof current.** Fix the Chromium SIGABRT environment, rerun Flintted S7/S10, and replace stale `GATES.md` evidence. Also connect `clipped200` to the S10 failure parser.
2. **Standardize decisions.** Introduce DTCG 2025.10 sources, Style Dictionary outputs, schema/alias/drift checks, WCAG 2.2 tags, route/state inventory, and the richer asset manifest.
3. **Build the workbench.** Add Storybook for the existing kit, document every component state, add stable test helpers, and turn the motion grammar into semantic/state contracts with reduced-motion stories.
4. **Reshape the picker.** Generate five comparable full-stack slices, pick three, refine those three as systems, then lock and apply one. Preserve the user-controlled 5 → 3 → 1 decision.
5. **Close CI gaps.** Add pinned Playwright baselines, served Lighthouse, API contract fixtures/provider checks, critical real-service flows, and image/provenance gates.
6. **Scale across projects.** Version the kit/tokens, publish migrations, track adoption, and use the next two Workflow OS proof projects to harden the system before reducing per-project influence.

## Decision

Adopt an **open core**: DTCG 2025.10, Style Dictionary, the existing Workflow OS kit, Storybook, Playwright, axe-core, OpenAPI, ComfyUI, and carefully licensed image models. Use Google Material and Amazon Cloudscape as public engineering benchmarks. Treat Figma, Chromatic, Rive authoring, Imagen, and Nova Canvas/managed AWS image generation as optional closed adapters—not foundations.

This gives Workflow OS the standards and operational discipline visible in Google/Amazon systems while keeping its own identity-first, imagery-first, user-picked design process.
