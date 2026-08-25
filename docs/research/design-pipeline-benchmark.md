# Replacement design-system pipeline: the closest defensible public Google-grade architecture

**Research snapshot:** 2026-08-25

## Decision first

Replace the current Workflow OS design methodology. **Keep only Vedhith's 5 → 3 → 1 selection method.** The replacement is one reusable master site system that produces five complete identity candidates, refines three, locks one, and makes every route in that project consume the chosen tokens, components, layouts, imagery, motion, and state contracts.

For a **new TypeScript web project**, the closest literal public Google implementation is:

- **Angular 22**, created with strict typing and standalone components; use Signals, route-level SSR/SSG where it improves first load, and Angular's supported APIs. Angular 22 is the active public major in the [official release schedule](https://angular.dev/reference/releases); `ng new` defaults to standalone and strict modes and offers SSR in the [official CLI](https://angular.dev/cli/new).
- **Angular Material 3 + Angular CDK + Angular Aria.** Material supplies supported, styled components; CDK supplies behavior and test primitives; Angular Aria supplies headless, accessible directives when a project identity needs custom styling. Angular states that Aria handles keyboard behavior, ARIA, focus, and screen readers while the product supplies HTML and CSS ([Angular Aria](https://angular.dev/guide/aria/overview)).
- **DTCG 2025.10 tokens + Style Dictionary.** DTCG is the neutral source; project-defined [Style Dictionary formats](https://styledictionary.com/reference/hooks/formats/) emit CSS custom properties, TypeScript data, Angular Material theme inputs, Storybook data, and future native outputs. [DTCG 2025.10](https://www.designtokens.org/TR/2025.10/format/) is stable but is a Community Group report, not a W3C Recommendation. Both Google and Amazon are represented in the [official DTCG group](https://github.com/design-tokens/community-group); that does not prove either uses the format internally.
- **[Storybook](https://storybook.js.org/docs/writing-tests) + Vitest/Angular TestBed + Angular CDK component harnesses + [Playwright](https://playwright.dev/docs/test-snapshots) + [axe-core](https://github.com/dequelabs/axe-core) + Lighthouse CI.** CDK harnesses give tests a supported API rather than private DOM selectors ([Angular harness guidance](https://angular.dev/guide/testing/component-harnesses-testing-environments)); Lighthouse CI can assert regressions on every change ([official repository](https://github.com/GoogleChrome/lighthouse-ci)).
- **[OpenAPI](https://spec.openapis.org/oas/latest.html)-backed state fixtures**, a versioned image/asset manifest, ComfyUI plus a specifically licensed model as the open image lane, and optional Imagen as a closed adapter.

For an **existing TypeScript/React project**, do not rewrite the application into Angular. Keep its supported React version and use the same framework-neutral tokens, manifests, page families, asset pipeline, Storybook, and gates. Use [React Aria](https://github.com/adobe/react-spectrum) or another reviewed accessible behavior layer behind the master component API. Angular + Angular Material remains the closest literal public Google implementation; React is the lower-risk adapter for existing React products.

This is **not Wiz** and must never be described as Google's exact internal pipeline.

## 1. The Google public/internal boundary

Google's own Angular team says Wiz is an **internal** framework used by Search, Photos, and Payments. Its public article describes Wiz as SSR-first with fine-grained code loading and event replay, and says useful ideas are being moved gradually into open Angular through public RFCs ([Angular and Wiz Are Better Together](https://blog.angular.dev/angular-and-wiz-are-better-together-91e633d8cd5a)). That makes Angular the defensible public route to Google-grade architecture. It does not make an Angular app identical to Wiz.

[Material 3](https://m3.material.io/) is the public design architecture: [tokens](https://m3.material.io/foundations/design-tokens/overview), [components](https://m3.material.io/components), [states](https://m3.material.io/foundations/interaction/states/overview), [motion](https://m3.material.io/styles/motion/overview/how-it-works), and [accessible design](https://m3.material.io/foundations/accessible-design/overview). The goal here is to adopt that **system shape**, not Google's visual skin.

The web component story has a hard boundary:

- [`@material/web`](https://github.com/material-components/material-web) is open source but in maintenance mode. Its team says engineers were reassigned to internal Wiz and no new features are planned ([maintenance announcement](https://github.com/material-components/material-web/discussions/5642)); its current README points Angular users to Angular Material. **Do not choose Material Web for new work.**
- Angular Material is the active open Google component implementation for Angular. Its M3 theming API supports color, typography, and density and warns that component DOM/classes are private; customizations must use supported theming APIs ([Angular Material theming](https://v18.material.angular.dev/guide/theming)).
- Angular 22 also makes Angular Aria stable for custom-branded accessible components; its roadmap explicitly positions Aria for custom style, CDK for behavior primitives, and Material for ready-made styled controls ([Angular roadmap](https://angular.dev/roadmap)).

Therefore, “same as Google” can honestly mean **the same public architecture class and standards**. It cannot mean Google's private authoring, review, monorepo, Wiz runtime, or release pipeline.

## 2. Keep / replace / reject

Current evidence comes from the Workflow OS source of truth, not from Flintted: [`design/PIPELINE.md`](/Users/vedhith/Developer/vedhith-workflow-os/design/PIPELINE.md) lines 1–39 define parsed stages, lines 377–396 define the picker, and lines 398–417 describe project-wide apply/gates. The candidate kit still names loose CSS as its source and Storybook as unbuilt in [`design/kit/README.md`](/Users/vedhith/Developer/vedhith-workflow-os/design/kit/README.md) lines 12–58 and 107–111. This evidence supports replacement, not preservation.

| Decision | Current Workflow OS feature | Replacement |
|---|---|---|
| **KEEP** | The human chooses 5 → 3 → 1. | Preserve this exact decision path. Each option must be a comparable system slice, not a recolored page. |
| **REPLACE** | `PIPELINE.md` S0–S10 as the design methodology. | The master-system pipeline in §4. It starts from route/page-family and product-state contracts, then produces one locked system consumed by all routes. |
| **REPLACE** | CSS and React constants as the design source. | DTCG primitive → semantic → component tokens; generated platform outputs are never hand-edited. |
| **REPLACE** | Hand-authored themed HTML pages. | Master layouts, components, patterns, route manifests, and Storybook states rendered in the actual app framework. |
| **REPLACE** | A section reference sheet chosen ad hoc. | A required Mobbin evidence matrix for every page archetype, plus direct first-party product inspection where available. |
| **REPLACE** | Image plates as a separate pre-page phase. | A shared asset subsystem inside every candidate: image role tokens, generation graph, provenance, crops, alt/decorative status, responsive variants, and page-family usage. |
| **REPLACE** | Duration/easing numbers without full state contracts. | Semantic motion roles tied to component and layout state machines, including reduced-motion behavior. |
| **REPLACE** | A fresh-model screenshot opinion as the main visual gate. | Human review of the full page-family matrix plus deterministic Storybook/Playwright visual baselines. A critic may advise; it does not replace evidence. |
| **REJECT** | Material Web as a new runtime. | It is in maintenance mode. Use Angular Material/Aria/CDK for new Angular work. |
| **REJECT** | Copying Google's Material appearance. | Copy the architecture and discipline. Each project chooses its own identity through the picker. |
| **REJECT** | Claiming to reproduce Wiz or Google's internal design pipeline. | State the closed boundary every time. |
| **REJECT** | Per-page CSS, one-off components, one-off animation curves, or unregistered images. | The route fails the system-consumption gate. |
| **REJECT** | Building five near-production sites before selection. | Build five equal system slices, then three broader refinements, then one complete site system. |

## 3. The reusable master site template

The master template is framework-neutral at its contract boundary and has Angular and React adapters:

```text
design-system/
  system.lock.json                 # chosen system id, version, hashes
  tokens/
    reference.tokens.json          # raw color, type, space, shape, duration
    semantic.tokens.json           # surface, text, action, feedback, motion roles
    component.tokens.json          # component-specific aliases only
  components/                      # public UI API + harness for every component
  patterns/                        # search, auth, forms, tables, editor, checkout...
  layouts/                         # public, auth, app, detail, editor, settings, error
  motion/motion-contract.json      # transition/state/reduced-motion table
  assets/ASSETS.json               # every image, icon, animation, font and licence
  stories/                         # every component/pattern/state/viewport
site/
  PAGE_FAMILY.yaml                 # every route and required evidence/state
  mobbin-evidence.md               # abstract flow/hierarchy/behavior observations
  api/openapi.yaml                 # or an equivalent typed API contract
  generated/                       # token/client outputs; never hand-edited
```

One project locks exactly one `system.lock.json`. Different projects may lock different identities. Within one project, **every page uses the same token graph, component package, layout rules, asset treatment, motion vocabulary, and state semantics**.

The system layers follow the public Material pattern:

1. **Reference tokens** hold raw values.
2. **Semantic tokens** name purpose: `surface.canvas`, `text.primary`, `action.primary`, `space.section`, `motion.enter.emphasized`.
3. **Component tokens** alias semantic roles; they do not introduce unrelated raw values.
4. **Components** own behavior, accessibility, states, and test harnesses.
5. **Patterns** combine components into task flows.
6. **Layouts/page families** combine patterns into routes.

This lets five projects look different without letting five pages in one project drift apart.

## 4. Replacement pipeline

1. **Product and route contract.** Enumerate real routes, API operations, auth/role rules, content types, localization, and required states before visual work.
2. **Page-family manifest.** Map every route to one archetype in §6. Unknown routes fail. Conditional families are explicitly `not-applicable` with a reason.
3. **Mobbin research.** For every applicable archetype, a human reviews at least three popular shipped product flows in the same product class and records only flow, hierarchy, behavior, and state lessons.
4. **Five system slices.** Each candidate renders the exact same evidence slice: public landing, primary app workspace, one dense/list route, one detail/editor route, auth/onboarding, phone layout, loading/empty/error/permission states, image treatment, and motion/reduced-motion specimen.
5. **Pick 5 → 3.** Record the choice and reasons. No rejected candidate becomes production code.
6. **Three refinements.** Each refinement must include full DTCG tokens, the core component/pattern inventory, master layouts, motion contract, asset graph, and representative route matrix.
7. **Pick 3 → 1.** Write `system.lock.json`. Its token, component, layout, asset, and motion hashes become the only approved project system.
8. **Compile and package.** Generate platform outputs and the framework component package. Angular Material customization uses its supported theming API; never private selectors. Custom identity controls use Angular Aria/CDK or the React adapter.
9. **Apply by family.** Build every route through a declared master layout and registered patterns. API-contract fixtures generate loading, empty, partial, error, forbidden, success, and long/localized content states.
10. **Prove system consumption.** Run §7 against every route and state. A route cannot pass because another page looks correct.
11. **Release and version.** Version tokens/components/patterns/system lock together. Changes require a system-level changelog and refreshed baselines, never a local page patch.

## 5. Mobbin is required evidence, with a strict use boundary

Mobbin's official site exposes shipped screens, UI elements, flows, video, and interactive prototypes across web and mobile products ([Mobbin](https://mobbin.com/)). Use that evidence to avoid inventing weak flows.

For each page archetype, `mobbin-evidence.md` must contain:

| Field | Required value |
|---|---|
| Archetype | The exact `PAGE_FAMILY.yaml` id. |
| References | At least three popular, shipped products relevant to this product class. |
| Evidence | Product, platform, flow name/URL, capture date, and reviewer. |
| Borrow | Abstract flow order, information hierarchy, interaction behavior, and states. |
| Do not borrow | Brand color/type, exact copy, logos, illustrations, photos, icons, or distinctive arrangement taken as a whole. |
| Decision | Adopt, combine, or reject, with the reason. |

This must be a licensed, human-led research step. Mobbin's [Terms](https://mobbin.com/terms) say its materials may contain third-party copyright/trademarks, restrict copying and derivative works, and restrict using automated/AI tools on its content without permission. Therefore:

- do not scrape Mobbin;
- do not commit its screenshots or exports;
- do not feed its screens to image/UI generators or agents unless the account and written permission allow it;
- give the implementation agent the abstract evidence notes, not protected assets.

Mobbin informs **what the page must do and how users move through it**. The selected design system controls how it looks.

## 6. Full page-family manifest

Every route maps to one family. “Conditional” means required when the product has that capability.

| Family id | Required archetypes and states | Applicability |
|---|---|---|
| `public` | landing/home, product/feature, pricing/plans, company/contact, docs/help, legal | Landing and legal for external sites; internal-only tools may record `not-applicable`. Others conditional. |
| `access` | sign in, sign up/invite, SSO, recovery, verification, expired/invalid link | Required for authenticated products. |
| `onboarding` | welcome, account/org setup, import/connect, permission request, progress, completion | Required when setup exceeds sign-in. |
| `app-home` | app shell, dashboard/workspace, recents, primary action | Required for app products. |
| `browse` | search, list/grid, filters, sort, pagination/infinite load, no results | Required when users find collections. |
| `object` | detail/overview, related content, history/activity, share/export | Required for domain objects. |
| `create-edit` | create, edit, autosave/manual save, validation, conflict, destructive confirm | Required when users mutate data. |
| `communication` | inbox/chat, notifications, activity feed, read/unread, attachment/error | Conditional. |
| `commerce` | plan selection, checkout, payment result, invoices, cancellation/refund | Conditional. |
| `account-admin` | profile, preferences, team/members, roles, integrations, API/security, billing | Profile always for accounts; remainder conditional. |
| `system` | 403, 404, 500, offline, maintenance, empty tenant, degraded/partial service | Always required. |

Each route entry declares `path`, `family`, `layout`, `allowedPatterns`, `apiOperations`, `roles`, `states`, `mobbinEvidence`, `assets`, and `systemId`. Route variants such as phone/desktop and reduced motion are test dimensions, not separate systems.

## 7. The gate that proves every page uses one system

`design-system gate <project>` passes only when all checks pass:

1. **Route coverage:** framework adapter enumerates all routes; each exists once in `PAGE_FAMILY.yaml`, and the manifest has no dead route.
2. **Lock identity:** the app root exposes the exact `systemId@version` from `system.lock.json`; every route retains it after navigation and hydration.
3. **Token integrity:** DTCG validates, aliases resolve, generated files match source hashes, and lint rejects raw visual constants outside approved token/asset files.
4. **Import boundary:** pages import only public master components/patterns/layouts. Deep imports, private Angular Material selectors, per-page theme bundles, and legacy design libraries fail.
5. **Component provenance:** every design-system component exposes an id/version and a CDK-style harness. Tests use harness APIs rather than private DOM structure.
6. **Layout compliance:** each route renders its declared master layout and only allowed patterns. Header, navigation, content measure, grid, and responsive behavior derive from the selected system.
7. **State completeness:** contract fixtures render required default/loading/empty/partial/error/forbidden/success states. Critical flows also pass against a real service; mock proof and service proof are reported separately.
8. **Asset integrity:** every loaded image/font/icon/animation exists in `ASSETS.json`, matches its hash/licence/role, has responsive crops, and has alt text or explicit decorative status.
9. **Motion integrity:** transitions use semantic motion tokens; every animated component has enter, exit, interruption, and reduced-motion behavior. Angular's current [`animate.enter` / `animate.leave`](https://angular.dev/guide/animations) APIs apply shared CSS motion classes.
10. **Visual family matrix:** Playwright captures every route/state at phone, tablet, laptop, and wide desktop in a pinned environment. Baselines live in version control and updates require review ([Playwright screenshot guidance](https://playwright.dev/docs/test-snapshots)). A human reviews the contact sheet for visible cross-page coherence.
11. **Accessibility:** Storybook and routes run axe; critical flows pass keyboard and screen-reader review; target [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) and documented [ARIA APG](https://www.w3.org/WAI/ARIA/apg/) behavior.
12. **Performance:** served production builds run Lighthouse CI and route budgets. Public pages use Angular SSR/SSG where justified by the [official hybrid-rendering model](https://angular.dev/guide/ssr).

The gate reports artifacts and exit codes. A prose `GATES.md`, an agent claim, or one passing homepage cannot make the project green.

## 8. Shared imagery and motion

### Image system

Images are part of the locked system, not page decoration. `ASSETS.json` records source type, content hash, exact model/version/licence, prompt/seed/input hashes, post-process graph, reviewer, rights/consent, alt/decorative status, responsive crops, intended page-family roles, and C2PA credentials where available. The [current C2PA specifications](https://spec.c2pa.org/specifications/) provide the provenance standard; provenance records origin/edits but does not prove truth.

Use [ComfyUI](https://github.com/comfyanonymous/ComfyUI) plus a specifically licensed model as the open, reproducible adapter. Optional [Google Imagen](https://deepmind.google/models/imagen/) is closed and may be used only behind the same manifest contract. Production builds consume approved versioned assets; they never generate images at build or request time.

All pages share image role tokens (`hero`, `object`, `avatar`, `thumbnail`, `empty-state`, `background`), crop rules, palette/treatment, and density budgets. A project may choose a different identity; pages within it may not choose different image languages.

### Motion system

Store duration, easing, spring/transition, distance, and opacity values as DTCG tokens, then expose semantic roles such as `feedback.instant`, `state.enter`, `state.exit`, `surface.change`, `data.update`, and `brand.emphasis`. Components own state-transition tables; layouts own navigation/continuity rules.

Every role defines a reduced-motion substitute using [`prefers-reduced-motion`](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion). Continuous/parallax motion becomes static; spatial travel becomes instant state or a short opacity transition; content is never hidden until animation runs. Screenshot and component tests disable or finish motion through one supported adapter, never scattered CSS overrides.

## 9. Open and closed choices

| Choice | Classification | Decision |
|---|---|---|
| Angular 22, Angular Material/CDK/Aria | Open source, Google-led | **Adopt for new TypeScript web projects.** Closest literal public Google implementation. |
| DTCG + Style Dictionary | Open standard/community report + Apache-2.0 compiler | **Adopt.** Framework-neutral system source and compiler. |
| Storybook, Playwright, axe-core, Lighthouse CI | Open source | **Adopt.** State workbench and CI proof. |
| React + React Aria | Open source | **Adopt as the existing-React adapter.** Do not rewrite working products solely for framework similarity. |
| Amazon Cloudscape | Apache-2.0 React system | **Reference only.** Its [stable test utilities](https://cloudscape.design/get-started/testing/introduction/) reinforce the same harness principle; it is not the target visual/runtime stack. |
| Material Web | Open source, maintenance mode | **Reject for new runtime use.** |
| Wiz / Google internal pipeline | Closed/internal | **Unavailable. Reject imitation claims.** Borrow only features that Google actually releases in Angular. |
| Mobbin | Closed research service | **Required human evidence input, never a system dependency or asset source.** |
| Figma, Chromatic, Rive editor | Closed or partly open hosted tooling | **Optional adapters.** The core pipeline must work without them. |
| Imagen | Closed model/service | **Optional image adapter.** Open image lane remains available. |

## Final recommendation

Build the replacement as a **framework-neutral master system with an Angular 22 reference implementation**. Use Angular Material where its supported components fit, Angular Aria/CDK where a custom identity needs headless accessible behavior, and DTCG tokens to make the identity portable. Keep React in existing React repositories through the same contracts.

Preserve only 5 → 3 → 1 from Workflow OS. Require Mobbin evidence for every applicable page archetype. Lock one system per project. Make route coverage, system identity, token/component/layout usage, imagery, motion, states, accessibility, visual regression, and performance executable gates.

That is the closest defensible public Google-grade pipeline. Anything stronger would be an unverifiable claim about closed Alphabet tooling.
