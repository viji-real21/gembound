# Public design-pipeline audit

## Answer

**No: the present pipeline is not 4,221 lines, and a public version cannot have zero custom code.** The reproducible count is **5,136 executable runner lines**; adding the stop hook and audit workflow is **5,563**, and the two direct test files add **852** (total **6,415**). `4,221` does not match any complete executable subset below.

## Actual executable inventory

| Responsibility | Files (lines) | Status / alternative |
|---|---:|---|
| Stages/artifacts/source checks | `design-pipeline.py` (1,310) | Generic shell; S0–S10/paths custom. Copier/Task do not model the graph. |
| Rendered design proof | `design-prove.py` (530), `design-measure.mjs` (224) | Generic idea; rubric/thresholds are custom. Playwright automates, but does not provide this scoring. |
| Accessibility/reflow | `design-gates.mjs` (201) | **Replace mostly** with `@axe-core/playwright` + Playwright projects. [a11y](https://playwright.dev/docs/accessibility-testing) |
| Screenshot + AI critic | `design-shot-critic.py` (330), `design-fullshot.mjs` (48) | Playwright replaces capture; independent-model rubric remains custom. [snapshots](https://playwright.dev/docs/test-snapshots) |
| AI-look policy | `design-sameness.py` (413) | Custom; no established OSS standard. |
| Image render/palette/treatment/crop | `design-plates.py` (165), `palette` (185), `treat` (178), `tightcrop` (108) | Engines exist; manifest/rules/policy custom. |
| Audio contract/render/ledger | `design-audio.py` (623) | Engines exist; contract/vocabulary are custom. |
| Parametric mascot | `design-character.py` (676) | Custom generator; no like-for-like OSS CLI. |
| Host adapters | `hooks/design-gate.py` (274), `workflows/design-audit.js` (153), `pipeline-error.py` (145) | Make optional; paths/agent host are not portable. |
| Tests | `test_design_pipeline.py` (575), `test_design_audio.py` (277) | Tests, not runtime; retain with retained behavior. |

**Excluded:** docs/templates/fixtures/fonts/assets; UI runtime `design/lib/` (1,684) and `design/kit/` (1,838, 848 generated). Not runners, but not zero-code.

## Best public-tool foundation

- **Contracts:** DTCG tokens + Style Dictionary. DTCG is a Community Group report, not a W3C Standard—pin a published release. [DTCG](https://www.designtokens.org/TR/2025.10/format/), [Style Dictionary](https://styledictionary.com/)
- **Template:** Copier supports questions and updates. [Copier](https://copier.readthedocs.io/en/stable/)
- **Commands/CI:** Task + GitHub Actions. [Task](https://taskfile.dev/docs/guide), [Actions](https://docs.github.com/en/actions/get-started/understand-github-actions)
- **Quality/variants:** Playwright + axe-core + Lighthouse CI; DTCG themes canonical, Storybook Controls/Globals optional review UI. [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci), [Storybook](https://storybook.js.org/docs/essentials/toolbars-and-globals)

## Conclusion

A public repo can be **mostly configuration plus upstream tools**, but cannot preserve its graph, generators, rendered proof, and AI-look decisions with **zero** custom code. Split portable contracts/templates from optional labeled checks.

what this changes for us
Use **Copier + DTCG/Style Dictionary + Task + Playwright/axe/Lighthouse**, not a claimed zero-code pipeline.
Publish retained checks as versioned package; label policy, not universal.
Keep host hooks, agents, paths, fixtures, fonts, and project UI as optional layers.
