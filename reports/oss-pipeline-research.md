# OSS design-pipeline template: confirmed picks

**Verdict:** keep the current shape, but name each layer precisely. There is no single replacement tool: the strongest OSS stack is a standard format plus focused tools.

| Area | Pick | Why this is the best fit | Do not pick instead |
|---|---|---|---|
| **Contracts** | **DTCG 2025.10** for design tokens; **JSON Schema 2020-12** for the template's project-input manifest; **Style Dictionary** to build tokens; **Copier** to distribute/update the template | DTCG is the current cross-tool token exchange specification (Candidate Recommendation, not yet a W3C Standard). Style Dictionary is forward-compatible with it and exports tokens to platforms. JSON Schema is the mature validation spec. Copier accepts template answers, supports Git-tagged template updates, and attempts to retain each generated project's own evolution. | **Backstage Templates**: capable, but its documented model assumes a running/deployed Backstage app plus source-control integration. That is a developer portal, not the lean reusable-repo mechanism. Cookiecutter can scaffold/replay but Copier has the stronger update model. |
| **Orchestration** | **Taskfile** as the canonical, OSS command interface | It is cross-platform, versioned YAML, validates against an official JSON Schema, can include/run reusable remote Taskfiles, and has source/generate fingerprinting. This makes it the best fit for separate projects that each supply different commands/paths. | **Nx/Turborepo** solve monorepo task graphs/caching, so they are the wrong default for independent repos. **Dagger** is the stronger choice only when container-identical environments are a requirement; it requires a container runtime. **GitHub Actions** is the CI host adapter, not the OSS canonical orchestrator. |
| **Quality** | **Playwright + axe-core + Lighthouse CI** | Playwright provides browser interaction and native screenshot comparison; its official accessibility guidance uses `@axe-core/playwright`. Lighthouse is OSS and explicitly supports CI regression prevention for performance, accessibility, SEO, and best practices. | **BackstopJS** is redundant because Playwright already owns screenshot baselines. Storybook is a component review surface, not the end-to-end quality gate. |
| **Variants** | **Storybook Controls/Globals + DTCG token themes** | Controls edit component args live without modifying components. Globals are specifically global render inputs, re-render decorators, and Storybook's own docs demonstrate a theme toolbar. Tokens remain the source of theme values; Storybook is the selection/review UI. | No better OSS replacement for this role. Alternative component workbenches reduce weight, but do not improve the contract or the workflow fit. |

## Important distinction

- **DTCG and JSON Schema are specifications**, not competing products: DTCG describes token data; JSON Schema validates the template's project-specific inputs.
- **Style Dictionary and Copier are tools**: one compiles tokens, the other turns the reusable repository plus answers into a project and can update that template layer later.
- **Project custom code remains project-owned.** Copier's tracked answers/template-update model is specifically the best available match for a universal template repo whose consumers still evolve independently; conflicts must still be reviewed.

## Primary sources

- [DTCG Design Tokens Format 2025.10](https://www.designtokens.org/TR/2025.10/format/)
- [JSON Schema 2020-12 specification](https://json-schema.org/specification)
- [Style Dictionary: DTCG compatibility and exports](https://styledictionary.com/)
- [Copier overview](https://copier.readthedocs.io/en/stable/) and [update behavior](https://copier.readthedocs.io/en/stable/updating/)
- [Backstage Software Templates prerequisites](https://backstage.io/docs/features/software-templates/) and [configuration](https://backstage.io/docs/features/software-templates/configuration/)
- [Taskfile guide](https://taskfile.dev/docs/guide) and [Taskfile schema](https://taskfile.dev/docs/reference/schema)
- [Dagger requirements](https://docs.dagger.io/getting-started/installation/) and [CI model](https://docs.dagger.io/)
- [GitHub Actions workflows](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows)
- [Playwright visual comparisons](https://playwright.dev/docs/test-snapshots) and [accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [Lighthouse overview](https://developer.chrome.com/docs/lighthouse/overview)
- [Storybook Controls](https://storybook.js.org/docs/essentials/controls) and [Globals](https://storybook.js.org/docs/essentials/toolbars-and-globals)

## What this changes for us

Use **Copier** as the reusable-repo delivery/update mechanism, not Backstage.
Make **Taskfile** the common command contract; use GitHub Actions only to run it in CI.
Keep **DTCG + Style Dictionary**, **Playwright + axe + Lighthouse**, and **Storybook Globals + token themes** exactly as the standards stack.
