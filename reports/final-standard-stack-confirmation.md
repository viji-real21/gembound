# Public design-quality template: final standards check

## Decision

Use a **thin Copier template** that composes upstream tools. This is the strongest defensible open-source stack for a web project; there is no single universal "Google/Apple design pipeline" package to install.

| Concern | Pick | Confirmed capability |
|---|---|---|
| Distribution/update | **Copier** | Generates from local/Git templates, records answers, and supports update checks/updates. [Copier: generation](https://copier.readthedocs.io/en/stable/generating/), [updates](https://copier.readthedocs.io/en/stable/updating/) |
| Command composition | **Task** | `includes` composes Taskfiles; remote Taskfiles may be Git-ref/checksum pinned. Pin releases/checksums—never execute an unpinned remote `main`. [Task: remote Taskfiles](https://taskfile.dev/docs/remote-taskfiles) |
| Token contract + themes | **DTCG format + Style Dictionary** | DTCG is the vendor-neutral exchange format; Style Dictionary has first-class DTCG support. Pin the supported format/version: DTCG 2025.10 is a Candidate Recommendation, not a W3C standard, and Style Dictionary says full 2025.10 support is still in progress. [DTCG 2025.10](https://www.designtokens.org/TR/2025.10/format/), [Style Dictionary DTCG support](https://www.styledictionary.org/info/dtcg/) |
| Web quality gate | **Playwright + `@axe-core/playwright` + Lighthouse CI** | Playwright runs Chromium, Firefox and WebKit projects and has built-in screenshot comparison. Its official accessibility guide uses axe. Lighthouse CI has configurable `error` assertions that exit non-zero, including per-URL matrices. [Browsers](https://playwright.dev/docs/browsers), [visual comparisons](https://playwright.dev/docs/test-snapshots), [accessibility](https://playwright.dev/docs/accessibility-testing), [LHCI assertions](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md) |
| Native Apple quality gate | **XCTest/XCUIAutomation, optional** | Use only for an iOS/macOS app; it is Apple UI automation, not an extra test for a web site running on a Mac/server. [Apple XCUIAutomation](https://developer.apple.com/documentation/XCUIAutomation) |

## Explicit exclusions

- **No custom runner, stage graph, artifacts, source/inspiration logs, or video rewatching.** Task and CI invoke upstream commands; project tests remain the project’s responsibility.
- **No Storybook requirement.** DTCG token/theme files are the shared variant contract. Storybook remains optional for component teams.
- **No claim of automatic taste approval.** Axe only finds automatically detectable issues; Playwright explicitly recommends manual assessment too.

## Accuracy boundary: “zero personal code”

- **True:** a consumer can have zero *personal pipeline implementation code*—no Python/TypeScript runner, custom gates, or project-specific workflow logic—by applying the template defaults.
- **Not true:** zero files or zero configuration universally. The template necessarily contains declarative Task/CI/tool config and generic test definitions. A repo that differs from the default needs data such as its existing preview command/base URL or extra routes. That is configuration, not bespoke pipeline code.
- **Gates remain real:** Playwright/axe/LHCI return failure; Task/CI must call their single required check target. AI cannot be guaranteed to run it manually, but required CI exposes a skipped tool.

## What this changes for us

Use Copier + pinned Task includes to distribute the integration, not a custom pipeline program.
Use DTCG/Style Dictionary for tokens/themes and Playwright + axe + LHCI for web gates.
Promise zero personal pipeline code, never zero universal configuration or zero template files.
