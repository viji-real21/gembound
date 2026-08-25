# Universal design pipeline benchmark: Google/Claude-grade, one fixed template

**Research snapshot:** 2026-08-25
**Source rule:** local evidence plus direct official docs/specs. Google/Claude benchmark claims use only their first-party sources. Neither company's internal workflow is claimed.

## Answer first

**No. The current Workflow OS pipeline does not yet reach Google/Claude visible design quality as a repeatable system.** It has useful executable gates, a real image-generation subsystem, and a validated candidate React kit. It does not have the one complete, locked template that makes every page in every project use the same components, layouts, responsive rules, motion, and states.

The replacement must be **one universal TypeScript/React site package for both new and existing projects**. A project may provide only a closed variable manifest: approved colors, optional approved fonts, content, logo, PNG/mascot/imagery, capability data, and possibly one density enum. Projects may not define components, layouts, breakpoints, motion, or state behavior.

The closest literal public Google implementation is Angular + Angular Material/CDK/Aria. It is the benchmark, not a second runtime. Google's team calls Wiz **internal** and says features are gradually open-sourced through Angular ([Angular and Wiz Are Better Together](https://blog.angular.dev/angular-and-wiz-are-better-together-91e633d8cd5a)). Workflow OS cannot claim to reproduce Wiz.

## 1. Blunt current-state verdict

| Area | Verdict | Evidence |
|---|---|---|
| Executable stage model | **Implemented** | [`design/PIPELINE.md`](/Users/vedhith/Developer/vedhith-workflow-os/design/PIPELINE.md) lines 1–39 defines parsed stages and exit-code gates. Live `design-pipeline.py doctor` resolves all **52 claims across 14 stages**. |
| Candidate component package | **Partial** | Live `npm run check` and `npm run validate` pass; validation traces **19 tokens, 7 drivers, and 47 classes** to the loose library. But [`design/kit/README.md`](/Users/vedhith/Developer/vedhith-workflow-os/design/kit/README.md) marks the kit `candidate`, and lines 107–111 say Storybook and the effects package are not built. |
| Component completeness | **Missing** | [`design/components/README.md`](/Users/vedhith/Developer/vedhith-workflow-os/design/components/README.md) lists one implemented pattern file: buttons and inputs. There is no complete navigation, dialog, menu, tabs, table, toast, date/time, upload, editor, or page-pattern inventory with all states. |
| Universal fixed template | **Missing** | `PIPELINE.md` lines 118–136 requires five worlds to differ in **layout, type, colour, motion, and subject**. Lines 287–304 let each project choose interaction behavior. That is the opposite of a single fixed template. No universal template, closed variable schema, or template-version lock exists in the design tree. |
| Page-family and route coverage | **Missing** | S7 gates themed HTML sheets, not the real application's full route graph. There is no fixed page-family manifest that maps every route to one approved layout and proves that route consumes it. |
| Mobbin research | **Partial** | [`design/DESIGN.md`](/Users/vedhith/Developer/vedhith-workflow-os/design/DESIGN.md) lines 183–245 contains a strong Mobbin-first/deep protocol. `PIPELINE.md` never names Mobbin, so the protocol is not an executable stage or gate. |
| Image generation | **Implemented foundation; integration partial** | [`design/image-pipeline/README.md`](/Users/vedhith/Developer/vedhith-workflow-os/design/image-pipeline/README.md) defines the existing ComfyUI graph at `<project>/design/image-pipeline.json`; `PIPELINE.md` S4/S4t generates and treats images. What is missing is a fixed asset-slot contract proving every image is registered and used through the universal template. |
| Consistent motion | **Partial** | [`design/lib/README.md`](/Users/vedhith/Developer/vedhith-workflow-os/design/lib/README.md) lists shared motion and 15 interactions, but projects currently select behaviors per role and the kit says effects are missing. Motion is not fixed across the fleet. |
| Accessibility and visual proof | **Failing / missing** | The fixture passes S0–S6i. Current live S7 produces readable contrast and typography failures; S8 has no screenshots, S9 has no picker, and S10 has no `GATES.md`. Quality is not demonstrated. |

An individual Workflow OS page may look polished. The pipeline itself cannot yet guarantee that result, keep it coherent across routes, or reproduce it across projects. **The system verdict is not ready.**

## 2. What “Google/Claude-grade” can defensibly mean

Google's public design architecture is not a look. Material 3 publishes separate systems for [design tokens](https://m3.material.io/foundations/design-tokens/overview), [components](https://m3.material.io/components), [interaction states](https://m3.material.io/foundations/interaction/states/overview), [motion](https://m3.material.io/styles/motion/overview/how-it-works), and [accessible design](https://m3.material.io/foundations/accessible-design/overview). Angular Aria implements keyboard behavior, ARIA attributes, focus management, and screen-reader support while leaving HTML and styling to the system author ([Angular Aria](https://angular.dev/guide/aria/overview)). Angular's component-harness guidance also separates a stable test API from private component DOM ([Angular component harnesses](https://angular.dev/guide/testing/component-harnesses-testing-environments)).

Claude's public product contract points in the same direction. Anthropic says a Claude Design system is set up once, extracts reusable components, colors, typography, and layout patterns, and then becomes the foundation for all team projects ([Claude Design setup](https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design)). Claude Design can import real components, check output against the system, correct it, and let an admin approve one standard system and lock edits ([Claude Design](https://claude.com/product/design)).

Anthropic's public MCP App guidelines provide a measurable visible-quality floor: host tokens rather than hard-coded structural colors, light and dark themes, layouts from 320px upward, 44pt touch targets, skeleton loading, smooth display transitions, keyboard use, text alternatives, and WCAG AA contrast ([Claude MCP App design guidelines](https://claude.com/docs/connectors/building/mcp-apps/design-guidelines)). Those rules apply to MCP Apps, not every Anthropic site. They are useful public evidence, not proof of Anthropic's internal pipeline.

Therefore “Google/Claude-grade” means:

- **one governed source** for tokens, components, page patterns, states, assets, and motion;
- **stable component behavior** tested through public APIs;
- **all-route proof**, including responsive, empty, loading, error, permission, and reduced-motion states;
- **central updates**, with projects unable to fork the system through local CSS;
- **visible evidence**, not a prose claim or one strong homepage.

It does **not** mean copying Material's appearance, Claude's brand skin, Wiz, or either company's private review and release tooling.

### Closed boundary: this is not a full fork

There is no public Google/Alphabet pipeline repository to fork. Google publishes Material, Angular, Angular Material/CDK/Aria, and selected practices moving from Wiz into Angular. Anthropic publishes Claude Design's import/lock behavior and scoped MCP App guidelines, but not the pipeline used to ship Claude or its sites.

Therefore the replacement is a **new Workflow OS implementation of their public architecture and standards**, not a fork and not a claim of identical tooling. Any sentence stronger than that is unsupported.

## 3. Keep / replace / reject

| Decision | Workflow OS item | Required treatment |
|---|---|---|
| **KEEP** | 5 → 3 → 1 human choice | Keep only as a picker for allowed variable manifests rendered through the exact same template and page families. |
| **KEEP — explicit user exception** | Existing ComfyUI pipeline | Integrate it. Do not replace or “propose” it. Its output must fill fixed asset roles in the universal template. |
| **KEEP — neutral plumbing only** | Parsed stages, `doctor`, exit-code gates | Reuse the runner, resolution checks, and exit-code mechanism. Do not retain the current stage content as design methodology. |
| **REPLACE** | Five worlds with different layouts and motion | Five manifests may vary only approved colors, optional approved type, copy, logo, imagery/mascot, and density. Layout and motion remain identical. |
| **REPLACE** | Identity-first / imagery-first composition | The universal page-family and component contract comes first. Identity and imagery fill its named slots; they never redesign it. |
| **REPLACE** | Per-project interaction mapping | One versioned motion/state contract is compiled into every project. |
| **REPLACE** | Hand-authored themed sheets | Real routes render fixed page families from the universal package. |
| **REPLACE** | Per-project Mobbin research that can alter layout | Mobbin informs **central template evolution**. Project work selects content and assets; it does not invent page structure. |
| **REJECT** | Per-page CSS, custom layout wrappers, one-off components or easing curves | These are build failures. |
| **REJECT** | A separate Angular system for new work and React system for old work | There is one Workflow OS template and one public contract for all projects. |
| **REJECT** | Material Web as the shared runtime | Google's repository says it is in maintenance mode and recommends Angular Material for Angular users ([Material Web](https://github.com/material-components/material-web)). |
| **REJECT** | Claims of matching Google or Anthropic internally | Wiz is internal; Anthropic has not published its internal design-to-production pipeline. |

## 4. Psychological-design and motion audit

**Yes, the current pipeline has a large psychological-design layer.** Nothing in that layer survives merely because it is already written down. [`design/CHECKLIST.md`](/Users/vedhith/Developer/vedhith-workflow-os/design/CHECKLIST.md) lines 117–139 mixes useful interaction concerns, broad memory heuristics, conversion tactics, and game-design language. The replacement keeps a rule only when it can be encoded and tested from allowed public evidence.

| Treatment | Current ideas | Replacement rule |
|---|---|---|
| **KEEP, but rewrite as testable behavior** | Grouping, clear hierarchy, readable spacing, large/near actions | Encode fixed spacing, hierarchy, responsive reflow, and target size in components. Anthropic's public MCP guidance requires consistent visual hierarchy, logical grouping, adaptive layout, and 44pt touch targets ([Claude MCP App design guidelines](https://claude.com/docs/connectors/building/mcp-apps/design-guidelines)). |
| **KEEP, but rewrite as state contracts** | Feedback, progress, error severity, reversibility | Use fixed semantic status, confirmation, loading, error, and recovery states. Do not retain “hit/boss/kill stop” or other custom game labels. |
| **KEEP, scoped** | Progressive disclosure and visible controls | Each fixed page family defines its own information depth. Claude's MCP guidance discourages deep navigation and clipped popovers in its embedded-app context; that is evidence for those surfaces, not a universal three-item navigation law. |
| **KEEP, scoped** | Motion that explains cause and relationship | Use Material's public transition categories—container transform for connected elements, shared axis for spatial relationships, fade-through for unrelated views, and fade for local enter/exit—as an architectural model ([Material motion codelab](https://developer.android.com/codelabs/material-motion-android)). |
| **REPLACE** | Fitts, Hick, Gestalt, Von Restorff, aesthetic-usability as prose | Keep only the concrete component/layout rules independently supported above. The labels are not gates and do not justify new per-project composition. |
| **REJECT** | “≤3 nav choices,” “5–9 items,” important items at both ends | These are hard-coded heuristics without allowed public support for every product. Page-family structure and usability evidence decide the fixed inventory centrally. |
| **REJECT** | Peak–end CTA, Zeigarnik pull, expensive-plan anchoring, loss-aversion upsells, reciprocity, small-yes commitment, social-proof formulas, Bushnell's law, invisible tutorials | These are product-specific persuasion tactics, not universal component-system requirements. Several can become manipulative. They do not enter the template. |
| **REJECT** | Texture on every ground, darkened edges, grain/vignette everywhere, one-accent-area formulas, two motion motifs, mandatory scroll reveal/reshape, emotion-based color meanings | These are Workflow OS style rules, not independently proven Google/Claude platform standards. The fixed template uses semantic roles and accessible contrast; project imagery fills approved slots. |

The current timing rules also do not survive. `entries/motion-language.md` defines 55/150/225/375/1000 ms tokens, while `theory/motion-and-performance.md` gives a different 120–600 ms formula and separate ranges. The replacement uses Google's public Material duration scale—short 50/100/150/200 ms, medium 250/300/350/400 ms, and long 450–1000 ms—then assigns different roles rather than one magic duration ([Material motion theming](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)). Claude's public guide requires smooth transitions but publishes no millisecond scale, so it does not justify different values.

| Motion role | Universal timing contract | Gate |
|---|---|---|
| **Input acknowledgement** | **50 ms** press/state feedback. A visible response begins in under **100 ms**; input work stays below **50 ms**. This may start a longer state change, but the click/tap cannot feel lost. | Measure event-to-paint on low-end profiles. Google's RAIL guidance supplies the response budgets ([web.dev RAIL](https://web.dev/articles/rail)). Good INP at **≤200 ms** is a separate responsiveness gate, not an animation duration ([web.dev INP](https://web.dev/articles/inp)). |
| **Small component enter / exit** | Small feedback, tooltip, chip, or local disclosure uses **100–150 ms**. Default component **enter/open is 250 ms**; default **exit/close is 200 ms**. | Test interruption, focus transfer, and visibility. Projects cannot tune these values. |
| **Modal, panel, and layout transition** | **300–400 ms**, using the fixed relationship pattern: connected container, shared axis, unrelated fade-through, or local fade. | Interaction remains available, frames stay within the RAIL production budget, and navigation focus lands correctly. |
| **Perceived page opening** | This is not one animation duration. Show shell/acknowledgement immediately and usable content as soon as ready. A large hero or deliberate brand reveal may use **450–600 ms only when centrally justified**; it cannot delay content. | Measure response, INP, and real loading separately. Show a layout-matching skeleton when data is pending. Never hide usable content behind a decorative reveal. |
| **Reduced spatial motion** | **0 ms travel**. Preserve state understanding with an instant change or the shortest non-spatial opacity token only when needed. | The reduced-motion fixture must expose the same content and focus result with no wait. |

All motion values are fixed in `motion/contract.json` after central testing. Projects cannot tune them. Every role defines interruption, focus behavior, and a reduced-motion outcome.

## 5. The one universal template

Build and version one package, for example `@vedhith/universal-site`:

```text
packages/universal-site/
  variables.schema.json       # closed allow-list; additionalProperties: false
  variables.defaults.json
  tokens/                     # reference -> semantic -> component roles
  components/                 # fixed public APIs, DOM behavior, states, harnesses
  patterns/                   # fixed task flows built only from components
  layouts/                    # fixed shell, grid, measure and responsive rules
  page-families/              # fixed route archetypes and slot order
  motion/contract.json        # fixed roles, durations, easing, interruption, reduced motion
  states/contract.json        # loading, empty, partial, error, forbidden, success
  assets/slots.schema.json    # fixed image roles, crops, alt/decorative rules
  stories/                    # every component/pattern/state/viewport
  gates/                      # route, import, token, visual, a11y, motion and asset proof

<project>/design/
  project.variables.json      # the only project design input
  image-pipeline.json         # existing ComfyUI workflow
  ASSETS.json                 # approved generated/provided outputs and metadata
  ROUTES.json                 # real route -> fixed page-family mapping
```

Every project pins the same `templateVersion`. Updating components, layouts, page structures, states, or motion happens once in `@vedhith/universal-site`, is reviewed against all page families, and then rolls out as a versioned migration.

### Closed variable manifest

| Project may set | Constraint |
|---|---|
| Semantic palette roles | Only named roles; light/dark pairs; contrast gate must pass. No raw page CSS. |
| Typography | Font family only from an approved compatibility list. Type scale, line height, measure, weights, and responsive rules stay fixed. The safest first release locks typography too. |
| Content and real data bindings | Copy, labels, records, prices, legal text, and localization. Content length fixtures still must pass. |
| Logo and icons explicitly marked as brand assets | Versioned file, dimensions, alt/decorative status, and usage role. System action icons remain fixed. |
| PNG, mascot, photography, illustration, and generated imagery | Must map to a named asset slot and `ASSETS.json` record. |
| Density | At most a fixed enum such as `comfortable` or `compact`; each mode is built and tested centrally. |
| Capabilities and routes | They decide which fixed page families exist and what data they display. They cannot change family structure. |

**Fixed and not project-configurable:** component variants and geometry, DOM/ARIA behavior, shell/navigation model, grids, page section order, breakpoints/container rules, motion timings/easings/distances, focus/hover/pressed/disabled behavior, loading/error patterns, and responsive transformations.

The schema must use `additionalProperties: false`. A project cannot “temporarily” escape through `customCss`, `layoutOverride`, arbitrary animation values, or a free-form component slot.

## 6. The picker survives, but its meaning changes

The 5 → 3 → 1 flow becomes:

1. **Five variable manifests.** Render the same fixed evidence set: landing, app home, browse/list, detail/editor, settings, system error, phone, dark/light, loading/empty/error, and reduced motion.
2. **Three refinements.** Change only allowed manifest values and assets. A diff containing component, layout, or motion code fails immediately.
3. **One selection.** Lock `project.variables.json` and its asset hashes. Applying the choice is data replacement, not a site rewrite.

This preserves Vedhith's selection method while removing the current source of drift: five worlds with different layout and interaction grammars.

## 7. Fixed page-family manifest

The universal template owns these archetypes. A project can enable only the families its product needs, but cannot rearrange them.

| Family | Fixed coverage |
|---|---|
| `public` | landing, feature, pricing, docs/help, contact/company, legal |
| `access` | sign in, sign up/invite, SSO, recovery, verify, expired link |
| `onboarding` | welcome, account/org setup, connect/import, permission, progress, complete |
| `app-home` | shell, workspace/dashboard, recents, primary action |
| `browse` | search, list/grid, filter, sort, pagination, no results |
| `object` | detail, related content, history/activity, share/export |
| `create-edit` | create, edit, validation, save, conflict, destructive confirm |
| `communication` | inbox/chat, notifications, feed, attachment/error |
| `commerce` | plans, checkout, payment result, invoice, cancel/refund |
| `account-admin` | profile, preferences, team/roles, integrations, security, billing |
| `system` | 403, 404, 500, offline, maintenance, empty tenant, degraded service |

Every applicable family includes desktop/phone, light/dark, keyboard focus, loading, empty, partial, error, forbidden, success, long text, localization, and reduced-motion fixtures.

Mobbin remains required, but at the **template-maintainer level**. For each archetype, maintainers study multiple popular shipped flows and record abstract hierarchy, task order, behavior, and states. Screenshots, brand skin, copy, logos, and copyrighted assets are not copied. A project run consumes the already-approved archetype; it does not repeat research to create a custom layout.

## 8. Integrate the existing ComfyUI pipeline

Do not add a second image generator. Keep `<project>/design/image-pipeline.json` and the existing one-graph-per-project process.

Add a fixed handoff:

1. `project.variables.json` declares needed asset roles such as `hero`, `object`, `avatar`, `thumbnail`, `mascot`, and `emptyState`.
2. The current ComfyUI graph generates candidates with the project's allowed visual variables.
3. Review writes approved files plus model/workflow version, prompt, seed, input hash, output hash, license/rights note, crop, and alt/decorative status to `ASSETS.json`.
4. Universal components accept only asset ids from that manifest and apply centrally fixed crop, aspect-ratio, loading, fallback, and responsive rules.
5. Runtime/build-time image generation is forbidden. Production consumes approved, versioned assets.

Imagery may change a project's identity. It may not change page composition, component geometry, or motion.

## 9. The gate that proves every route uses the system

`universal-site gate <project>` passes only when all checks pass:

1. **Manifest:** variables validate against the closed schema; template version and generated hashes match.
2. **Route coverage:** the framework router and `ROUTES.json` match exactly; every route maps to one fixed family.
3. **Import boundary:** routes import only universal public components, patterns, and layouts. Deep imports and legacy UI libraries fail.
4. **No escape CSS:** lint rejects raw visual values, page styles, layout overrides, and animation declarations outside generated universal outputs.
5. **Component/state coverage:** every component and page family renders default, hover, focus, pressed, disabled, loading, empty, partial, error, forbidden, and success where applicable.
6. **Motion checksum:** every transition resolves to the universal contract and has interruption plus reduced-motion behavior.
7. **Asset integrity:** every requested asset id exists in `ASSETS.json`; unregistered files, missing crops, and missing alt/decorative decisions fail.
8. **Visual matrix:** pinned screenshots cover every route/state at phone, tablet, laptop, and wide widths in light/dark and reduced motion. A reviewed contact sheet proves cross-page coherence.
9. **Accessibility:** automated checks plus keyboard/focus and screen-reader smoke tests pass. Native controls and reviewed accessible behavior are preferred, matching Angular's public accessibility guidance ([Angular accessibility](https://angular.dev/best-practices/a11y)).
10. **Real-app proof:** fixtures prove state coverage; critical flows separately run against the real service. Mock proof is never reported as service proof.

A prose `GATES.md`, a picker screenshot, or one polished route cannot satisfy this gate. The current fixture's missing S7–S10 evidence is exactly why the present verdict is **not ready**.

## 10. Exact target stack and adoption

Use one stack across the Workflow OS fleet:

- **Runtime:** TypeScript + React in one `@vedhith/universal-site` package. All new and old projects consume this package; no project owns a parallel design system.
- **Architecture benchmark:** Material 3 token/component/state/motion/accessibility layers. Angular Material/CDK/Aria are the closest literal public Google implementation and test model, not the Workflow OS runtime.
- **Tokens:** [DTCG 2025.10](https://www.designtokens.org/TR/2025.10/format/) source files compiled to CSS custom properties and typed TypeScript. Projects edit only the closed variable manifest.
- **Components:** native HTML where possible; one reviewed accessible behavior layer behind fixed React APIs; stable test harnesses for every public component.
- **Workbench and gates:** [Storybook](https://storybook.js.org/docs/writing-tests), TypeScript/Vitest, [Playwright](https://playwright.dev/docs/test-snapshots) screenshots and flows, [axe-core](https://github.com/dequelabs/axe-core), and [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci).
- **Assets:** the existing ComfyUI graph, `ASSETS.json`, immutable generated files, and fixed universal asset slots.
- **Motion:** CSS/WAAPI implementation behind one semantic contract; shared reduced-motion behavior; no project animation dependencies.

### Phased replacement

1. **Contract:** freeze the variable schema, page families, component inventory, state matrix, motion contract, and asset slots. Stop adding new per-project entries.
2. **Template:** implement `@vedhith/universal-site` from the new contract. Port no current visual choice automatically; complete its component/pattern inventory and stories.
3. **Proof:** create one complete fixture with all families, states, viewports, themes, imagery, and motion. Require S7–S10 equivalents to pass.
4. **Migration:** move one existing product to the universal package, remove its page CSS/layouts, then migrate the remaining fleet. New projects start only from this template.
5. **Evolution:** use Mobbin and first-party product evidence only to improve the universal template centrally. Version and migrate; never fork per project.

## Final decision

**KEEP:** 5 → 3 → 1 as the only surviving design method; the existing ComfyUI pipeline by explicit user exception; and the gate runner only as neutral enforcement plumbing.

**REPLACE:** the current identity/imagery-first, five-world, per-project layout and interaction methodology with one closed-manifest universal template.

**REJECT:** project-owned components, layouts, motion, states, CSS escapes, Material-skin copying, a new/old framework split, and claims of reproducing Wiz or Anthropic's internal pipeline.

Workflow OS is **partially implemented but not Google/Claude-grade today**. The target is not “five coherent systems” or “one system per project.” It is **one governed system for the whole fleet**, with project identity expressed only through approved variables and assets, and every route proven against that same system.
