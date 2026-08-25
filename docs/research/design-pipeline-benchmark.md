# Universal design pipeline benchmark: major-company evidence, one fixed template

**Research snapshot:** 2026-08-25
**Source rule:** local evidence plus direct official company docs, source repositories, licenses, and standards specifications. No company's internal workflow is claimed from its public design-system site.

## Answer first

**No. The current Workflow OS pipeline does not yet reach major-company visible design quality as a repeatable system.** It has useful executable gates, a real image-generation subsystem, and a validated candidate React kit. It does not have the one complete, locked template that makes every page in every project use the same components, layouts, responsive rules, motion, and states.

**No audited major company publishes its complete internal research-to-release pipeline.** Public design-system sites and component repositories expose valuable layers, but none exposes the entire research intake, design source, product-specific libraries, approval/governance, implementation, CI, release, and adoption process as one reproducible fork. Google is not an exception: Material and Angular are public; Wiz and Google's complete product pipeline are not.

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

## 3. Major-company public-system audit

This matrix records what first-party sources actually expose. It does **not** upgrade a documentation site into a complete pipeline.

**Legend:** **T** tokens/style · **C** components · **M** motion · **F** navigation, floorplans, dense-app patterns · **W** content guidance · **A** accessibility · **Q** testing · **G** governance/release. `✓` means a substantial public layer; `◐` means partial guidance, code, or platform-bound access; `—` means no substantial public layer found. A checkmark never means the company's internal delivery process is open.

| Major-company system | Official use and code/license | T | C | M | F | W | A | Q | G | Public boundary and decision |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **Google Material 3 + Angular Material/CDK/Aria** | Google publishes [Material's system layers](https://m3.material.io/) and the [Angular components repository](https://github.com/angular/components) under MIT. | ✓ | ✓ | ✓ | ◐ | ◐ | ✓ | ✓ | ✓ | Angular says Wiz is **internal** and only selected features are gradually open-sourced through Angular ([Angular + Wiz](https://blog.angular.dev/angular-and-wiz-are-better-together-91e633d8cd5a)). Material Web is in maintenance mode ([status](https://github.com/material-components/material-web/discussions/5642)). **Benchmark, not a complete fork.** |
| **AWS Cloudscape** | Its Apache-2.0 [React repository](https://github.com/cloudscape-design/components) says Cloudscape was built for and is used by AWS products and services; the public organization also ships [test utilities and related packages](https://github.com/cloudscape-design). | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Strongest open React base for a dense universal shell. AWS's product-specific research, approvals, and release pipeline remain unpublished. **Primary runtime source.** |
| **IBM Carbon + Carbon for IBM Products** | Carbon is IBM's Apache-2.0 [open-source design system](https://github.com/carbon-design-system/carbon). The public [IBM Products library](https://github.com/carbon-design-system/ibm-products) explicitly calls itself an open implementation of IBM Software's **closed-source** PAL. | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Broad, credible reference; its own README proves the internal/public boundary. **Fallback/reference.** |
| **Microsoft Fluent 2** | Microsoft's MIT [Fluent UI repository](https://github.com/microsoft/fluentui) says React v9 is used in Microsoft 365, v8 in Office, and Web Components in Edge. Public Fluent 2 covers [tokens](https://fluent2.microsoft.design/design-tokens), [motion](https://fluent2.microsoft.design/motion), [content](https://fluent2.microsoft.design/content-design), and [accessibility](https://fluent2.microsoft.design/accessibility). | ✓ | ✓ | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | Strong motion/content fallback; no public complete Microsoft app floorplan or internal delivery pipeline. **Fallback/reference.** |
| **Adobe Spectrum 2 + React Aria** | Adobe says its Apache-2.0 [React Spectrum](https://github.com/adobe/react-spectrum) implements Spectrum across Adobe applications; [Spectrum Design Data](https://github.com/adobe/spectrum-design-data) publishes tokens and component schemas. | ✓ | ✓ | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | Best fallback for accessible custom behavior. Product-specific Adobe composition, source libraries, and approvals are not a public fork. **Behavior fallback.** |
| **Shopify Polaris** | Shopify's current [Polaris web components](https://shopify.dev/docs/api/polaris/using-polaris-web-components) are accessible, responsive, hosted primitives for Shopify surfaces. The former React library is [deprecated and archived](https://github.com/Shopify/polaris-react-archive) under a [custom interoperability license](https://github.com/Shopify/polaris-react-archive/blob/main/LICENSE.md), not a general-purpose OSS grant. | ◐ | ◐ | — | ✓ | ✓ | ✓ | ◐ | ◐ | Useful commerce research only. **Reject as a fork/runtime source.** |
| **Salesforce Lightning Design System** | The [SLDS repository](https://github.com/salesforce-ux/design-system) publishes CSS, tokens, blueprints, Storybook, and tests under BSD-3-Clause, with icons/images under CC BY-ND; Salesforce's [base-component docs](https://developer.salesforce.com/docs/platform/lightning-component-reference/guide/get-started.html) show the platform runtime. | ✓ | ◐ | ◐ | ✓ | ✓ | ✓ | ✓ | ◐ | The public repo is archived and the full runtime is Salesforce-controlled. **Research only; reject as a new base.** |
| **GitHub Primer** | GitHub's [Primer organization](https://github.com/primer) publishes React, CSS, and primitives under MIT; Primer foundations are used across [GitHub interfaces](https://primer.style/product/getting-started/foundations/). | ✓ | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | ◐ | Public contributor docs refer to a private Primer repository and staff-only roadmap ([contributing](https://github.com/primer/react/blob/main/contributor-docs/CONTRIBUTING.md)). **Strong fallback, not GitHub's whole pipeline.** |
| **Atlassian Design System** | Atlassian says ADS powers Atlassian app UIs and publishes React/TypeScript guidance ([developer start](https://atlassian.design/get-started/develop/atlassians)). | ✓ | ✓ | ◐ | ✓ | ✓ | ✓ | ◐ | ✓ | Its [license](https://atlassian.design/license) is limited to software that interoperates with Atlassian, forbids modification/derivatives of ADS, and says only identified pieces may have separate OSS rights. **Research only; reject as a fork source.** |
| **SAP Fiori + OpenUI5** | SAP publishes role-based Fiori guidance and the Apache-2.0 [OpenUI5 runtime](https://github.com/UI5/openui5). Its public design guidance includes [floorplans](https://experience.sap.com/fiori-design-web/floorplan-overview/), [flexible column layout](https://experience.sap.com/fiori-design-web/flexible-column-layout-web-component/), [variant management](https://experience.sap.com/fiori-design-web/variant-management/), and application-wide [cozy/compact density](https://experience.sap.com/fiori-design-web/cozy-compact/). | ✓ | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | Best public source for enterprise page-family rules and saved views; SAP's internal product process is not open. **Primary floorplan reference, not a second runtime.** |
| **Red Hat PatternFly** | Red Hat says its MIT-licensed system is used extensively across Red Hat and supports complex enterprise products ([about](https://www.patternfly.org/get-started/about-patternfly/)); its [React repository](https://github.com/patternfly/patternfly-react) is public. | ✓ | ✓ | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | Product-specific additions live outside the core system. **Cloudscape fallback only.** |

### Direct answers

- **Does any audited company publish its complete internal pipeline? No.** Repositories expose implementation and sometimes public release mechanics. They do not expose the whole company workflow as a reproducible research-to-release system. Carbon's public IBM Products library names a closed internal PAL; Primer names private governance; Google names Wiz internal. These are direct counterexamples to “the design system docs are the pipeline.”
- **Is Google fully published or forkable? No.** Angular Material/CDK/Aria is a real MIT implementation and the closest literal public Google stack. Material publishes architecture and guidance. Neither provides Wiz, Google's complete internal templates, product-specific component layers, research operation, approvals, or production release machinery. “Google-grade” can mean using the same **public architecture and standards**; it cannot mean cloning Google internally.
- **Which systems are unsafe as fork sources?** Atlassian is purpose-restricted; Shopify's React library is deprecated/archived with a custom license; Salesforce's public design-system repository is archived and its base runtime is platform-controlled. Use their public guidance only where licensing permits; do not build the universal package on them.

## 4. Smallest defensible composite

Use **one installed visual runtime**, not a collage. Cloudscape components are wrapped behind the fixed `@vedhith/universal-site` API. Material and Fiori supply central rules; they are not installed as competing UI kits. Fallbacks are research/implementation references invoked only when the primary source has a real gap.

| Layer | One primary owner | One fallback | Workflow OS contract |
|---|---|---|---|
| Token file format | [DTCG 2025.10](https://www.designtokens.org/TR/2025.10/format/) | Material 3 token taxonomy | One source compiles to typed TS and CSS; projects edit only allowed semantic aliases. Google and Amazon representatives participate in the public [DTCG community group](https://github.com/design-tokens/community-group), but that does **not** prove either company's internal adoption. |
| React components and states | [AWS Cloudscape components](https://github.com/cloudscape-design/components) | Adobe [React Aria](https://react-spectrum.adobe.com/react-aria/) for a missing accessible behavior | Wrap, do not expose vendor APIs to routes. Native HTML first; every public component has fixed DOM/ARIA, states, and test handles. |
| Shell, navigation, contextual panels, disclosure, onboarding, density | [Cloudscape AppLayout and patterns](https://cloudscape.design/components/app-layout/?tabId=usage) | Red Hat PatternFly | One stable shell and one behavior for each panel role; comfortable default with one app-wide compact option. |
| Page families, multi-column transformation, saved views | [SAP Fiori floorplans](https://experience.sap.com/fiori-design-web/floorplan-overview/) | Cloudscape patterns | Encode the selected rules once in universal React page families. Do not add UI5 as a second component runtime. |
| Motion | [Material motion](https://m3.material.io/styles/motion/overview/how-it-works) | [Fluent 2 motion](https://fluent2.microsoft.design/motion) | Keep the fixed timing contract in section 7; no project overrides. |
| Content | [Cloudscape content guidance](https://cloudscape.design/foundation/) | [Fluent 2 content](https://fluent2.microsoft.design/content-design) | Fixed labels, error anatomy, action order, truncation, and empty/loading language patterns; projects supply factual copy only. |
| Accessibility | Cloudscape's implemented components plus [accessibility principles](https://cloudscape.design/foundation/core-principles/accessibility/) | React Aria | WCAG gates plus keyboard, focus, screen-reader, zoom/reflow, target-size, and reduced-motion fixtures. |
| Component testing | [Cloudscape test utilities](https://cloudscape.design/components/app-layout/?tabId=testing) | [Angular component harness model](https://angular.dev/guide/testing/component-harnesses-testing-environments) | Tests call stable public helpers, never private DOM. Add Storybook, Playwright visual/flow checks, axe, and route coverage in CI. |
| Governance and release | Universal-site maintainers using Cloudscape-style public package/version discipline | Primer's public [contribution and release practice](https://github.com/primer/react/blob/main/contributor-docs/CONTRIBUTING.md) | One owner approves system changes; changesets, migration notes, full-family evidence, and a template-version release are mandatory. |
| Generated imagery | Existing Workflow OS **ComfyUI** graph | Approved manually supplied asset | Existing pipeline stays. Only registered, reviewed outputs may fill fixed asset slots. |
| Identity selection | Existing **5 → 3 → 1** | None | The only surviving Workflow OS design method; it selects variable manifests/assets, never layout, components, motion, or states. |

This is the smallest composite that covers the missing layers without importing multiple visual grammars: **Cloudscape is the React implementation; Fiori contributes only fixed dense-app/page-family rules; Material contributes only the fixed motion/state architecture; DTCG is the interchange format.** Everything else is a fallback or research-only.

## 5. Fixed rules that keep a feature-dense app simple

These are template rules, not project options:

1. **Stable shell.** Render exactly one universal app shell with fixed global navigation, content, help/tools, drawers, and split-panel regions. Cloudscape says to use one AppLayout consistently, and defines collapsible navigation, tools, drawers, and split-panel responsibilities ([AppLayout](https://cloudscape.design/components/app-layout/?tabId=usage), [layout](https://cloudscape.design/foundation/visual-foundation/layout/)).
2. **Progressive disclosure.** Keep the primary path visible; reveal advanced or conditional fields only after a controlling choice, and preserve their values intentionally. Cloudscape's selection pattern uses progressive disclosure so users focus on the immediate task ([selection](https://cloudscape.design/patterns/general/selection/)).
3. **Contextual tools and panels.** Help panel = explanatory guidance; drawer = supplementary task/content; split panel = details for a selected resource. Use the fixed responsive collapse behavior instead of inventing page-specific sidebars ([Cloudscape secondary panels](https://cloudscape.design/patterns/general/secondary-panels/)).
4. **Staged onboarding.** Show only what supports the user's current task. Prefer contextual, user-triggered help and keep a path back to it; do not force tours on every visit ([Cloudscape onboarding](https://cloudscape.design/patterns/general/onboarding/)).
5. **Role and capability visibility.** Capability data may hide inaccessible routes and actions, but it cannot create a different shell or component grammar. Every permitted task maps to a fixed page family; direct URLs still enforce authorization. Fiori's public guidance defines a role-based launchpad, a persistent shell bar, and modular floorplans ([SAP Fiori app-design basics](https://experience.sap.com/fiori-design-web/best-practices-for-designing-sap-fiori-apps/)).
6. **Search and command access.** Global search stays in the stable shell; local search/filter stays inside browse families. A command palette may speed access to the same actions, but cannot be their only path. Primer distinguishes global jump/search from local filtering, warns that invisible shortcuts need signals, and documents a dialog-based command-palette form ([Primer search](https://primer.style/product/scenario-patterns/search/), [keybinding hint](https://www.primer.style/product/components/keybinding-hint/)).
7. **Saved views.** Save only named filter/sort/column/density state. Never save arbitrary layout markup. SAP's variant management makes selection, creation, update, save-as, rename, and management explicit states ([variant management](https://experience.sap.com/fiori-design-web/variant-management/)).
8. **Responsive transformation.** Do not shrink a desktop canvas. Fixed breakpoints collapse multi-column views into simpler views without losing the task, matching Primer's rule that responsive pages retain functionality and split columns into multiple views ([Primer layout](https://primer.style/product/getting-started/foundations/layout/)).
9. **Density modes.** Comfortable is the default. Compact is an app-wide user choice for data-intensive work, never a per-page tweak; readability/target-size exceptions remain fixed. Cloudscape documents both modes and requires consistency across the application ([content density](https://cloudscape.design/foundation/visual-foundation/content-density/)).

Mobbin may supply evidence from popular shipped products for **central** changes to these families. It cannot authorize a project-specific shell, page composition, interaction, or copied brand asset.

## 6. Keep / replace / reject

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

## 7. Psychological-design and motion audit

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

## 8. The one universal template

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
  adapters/                   # fixed auth, capability, data, action and error contracts
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

## 9. The picker survives, but its meaning changes

The 5 → 3 → 1 flow becomes:

1. **Five variable manifests.** Render the same fixed evidence set: landing, app home, browse/list, detail/editor, settings, system error, phone, dark/light, loading/empty/error, and reduced motion.
2. **Three refinements.** Change only allowed manifest values and assets. A diff containing component, layout, or motion code fails immediately.
3. **One selection.** Lock `project.variables.json` and its asset hashes. Applying the choice is data replacement, not a site rewrite.

This preserves Vedhith's selection method while removing the current source of drift: five worlds with different layout and interaction grammars.

## 10. Fixed page-family manifest

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

## 11. Integrate the existing ComfyUI pipeline

Do not add a second image generator. Keep `<project>/design/image-pipeline.json` and the existing one-graph-per-project process.

Add a fixed handoff:

1. `project.variables.json` declares needed asset roles such as `hero`, `object`, `avatar`, `thumbnail`, `mascot`, and `emptyState`.
2. The current ComfyUI graph generates candidates with the project's allowed visual variables.
3. Review writes approved files plus model/workflow version, prompt, seed, input hash, output hash, license/rights note, crop, and alt/decorative status to `ASSETS.json`.
4. Universal components accept only asset ids from that manifest and apply centrally fixed crop, aspect-ratio, loading, fallback, and responsive rules.
5. Runtime/build-time image generation is forbidden. Production consumes approved, versioned assets.

Imagery may change a project's identity. It may not change page composition, component geometry, or motion.

## 12. The gate that proves every route uses the system

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
10. **Full-stack contract:** each page family proves its fixed auth, capability, data, mutation, optimistic/pending, success, validation, conflict, permission, rate-limit, offline, and server-error adapter states. UI code cannot reach a service outside those adapters.
11. **Real-app proof:** fixtures prove state coverage; critical flows separately run against the real service. Mock proof is never reported as service proof.

A prose `GATES.md`, a picker screenshot, or one polished route cannot satisfy this gate. The current fixture's missing S7–S10 evidence is exactly why the present verdict is **not ready**.

## 13. Exact target stack and adoption

Use one stack across the Workflow OS fleet:

- **Runtime:** TypeScript + React in one `@vedhith/universal-site` package, wrapping the Apache-2.0 Cloudscape implementation behind Workflow OS APIs. All new and old projects consume it; no project owns a parallel design system or imports Cloudscape directly.
- **Architecture benchmark:** Material 3 token/state/motion/accessibility layers. Angular Material/CDK/Aria remain the closest literal public Google implementation and test model, not the Workflow OS runtime and not evidence that Wiz is forkable.
- **Tokens:** [DTCG 2025.10](https://www.designtokens.org/TR/2025.10/format/) source files compiled to CSS custom properties and typed TypeScript. Projects edit only the closed variable manifest.
- **Components:** Cloudscape where it covers the fixed inventory; native HTML where simpler; React Aria only for a missing accessible behavior. Every route sees only fixed universal React APIs and stable test helpers.
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
