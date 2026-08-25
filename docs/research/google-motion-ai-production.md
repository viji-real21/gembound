# Google motion and AI-media production evidence

**Conclusion:** Google publishes tools, not its Gemini pipeline. Use generated media and live UI motion.

## Published evidence

| Status | Finding |
|---|---|
| **Verified** | Gemini uses directional gradients, endpoints, and ripple/pulse activity for voice, thinking, and discovery. Google credits designers and **Buck**. The cited article publishes no implementation source code and makes no AI-only production claim ([Google Design](https://design.google/library/gemini-ai-visual-design)). |
| **Verified** | Material publishes container transform, shared axis, fade-through, and fade. W3C [View Transitions](https://www.w3.org/TR/css-view-transitions-1/) animate DOM-state changes; neither proves Gemini's implementation. |
| **Verified Google production example** | For I/O 2026, Google captured puppetry/simple 3D first, generated controlled style frames, used a custom AI Studio consistency tool, merged base animation with AI output, then composited and time-remapped shots. Google explicitly describes preserving human intent ([Google](https://blog.google/innovation-and-ai/technology/ai/io-2026-google-ai/)). |
| **Published Google authoring tool** | Google Web Designer builds responsive HTML/CSS animation with scene or per-layer keyframes, tweening and easing; its video documents also have frame/audio timelines. It is useful public prior art for ads, not evidence that the Gemini site uses it ([Google Web Designer](https://support.google.com/webdesigner/answer/6400003)). |
| **Published customer stack** | [Flow](https://blog.google/innovation-and-ai/products/google-flow-veo-ai-filmmaking-tool/) combines Gemini, Imagen, Veo, camera controls, SceneBuilder, and assets. [Veo](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/generate-videos-from-first-and-last-frames) accepts references. Apache-2.0 [Creative Studio](https://github.com/GoogleCloudPlatform/gcc-creative-studio) adds brand guides/critique but is unsupported reference code. |
| **Unknown** | Exact Gemini website-opening toolchain and complete marketing repository. |

## Commercial reality check

| First-party example | AI-only audit |
|---|---|
| **Google I/O opening** | Imagen -> Gemini prompt rewrite -> Veo -> crew review/camera revisions. Google says 80% of keynote videos used AI **in some way**, not AI-only ([Google](https://blog.google/innovation-and-ai/products/generative-ai-io-keynote-2025/)). |
| **Coca-Cola 2024 Holidays** | Later called “entirely GenAI-created,” but its launch credits three production houses and human artistry. Generated picture is not human-free direction, sound, edit, or approval ([2024](https://www.coca-colacompany.com/media-center/groundbreaking-digital-experience-and-films-fuse-holiday-heritage-with-cutting-edge-tech), [2025](https://www.coca-colacompany.com/media-center/coca-cola-refreshes-givers-of-the-season-embraces-ai-powered-storytelling-in-global-holiday-campaign.html)). |
| **Toys“R”Us Sora brand film** | The brand calls it created with Sora, but also credits production partner Native Foreign. Its page does not document edit, sound, compositing, or approval, so end-to-end AI-only is **unknown** ([Toys“R”Us](https://www.toysrus.com/pages/studios)). |

## Voice and Workflow OS lane

- **Voice:** ElevenLabs says output generated during an active paid subscription may be used commercially and indefinitely if the customer owns the needed input/voice rights; Beta Services are excluded from commercial and production use ([publishing terms](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform), [Beta addendum](https://elevenlabs.io/bsa)). Select and pin a non-Beta production model at implementation time. Open alternatives: MIT [Chatterbox](https://github.com/resemble-ai/chatterbox) or Apache-2.0 [Kokoro](https://github.com/hexgrad/kokoro). Log consent.
- **UI morph:** live DOM + View Transitions/CSS/WAAPI/SVG using theme tokens. Never bake functional UI into video. Support reduced motion and interruption.
- **Proposed footage/sound:** add a locked ComfyUI video graph, with Wan only after hardware/license/quality testing and optional Veo behind the same contract. Require shot manifests, human approval, timeline composite, captions, posters, encodes, provenance, and one canonical `MEDIA.json` ([contract](/Users/vedhith/Developer/sandbox/docs/research/media-pipeline-evidence.md:64)).

## Source lineage and scope

| Layer | Truth |
|---|---|
| **Current** | Mostly locally written: runner/gates, five-world sequence, psychological rules, picker implementation, wrappers and proof tools. It calls or ports upstream tools/methods; the universal template is missing ([audit](/Users/vedhith/Developer/sandbox/docs/research/design-pipeline-benchmark.md:20)). |
| **Retained current** | Parsed gate plumbing; ComfyUI graph format/orchestration; local picker implementation. The wide-to-narrow 5 -> 3 -> 1 method came from a sourced design video, while constraining it to manifests is the Workflow OS change. |
| **Proposed upstream code** | Wrap Apache-2.0 [Cloudscape React](https://github.com/cloudscape-design/components); retain GPL-3.0 [ComfyUI](https://github.com/Comfy-Org/ComfyUI) orchestration. Neither is currently the universal runtime. |
| **Proposed standards/guidance** | DTCG tokens, Fiori floorplans, Material motion, W3C View Transitions/WCAG. These would be adopted rules, not forked company pipelines ([mapping](/Users/vedhith/Developer/sandbox/docs/research/design-pipeline-benchmark.md:86)). |
| **Workflow OS-created target glue** | Closed-manifest compiler, vendor wrappers/mapping, route/data adapters, gates, Mobbin governance and canonical `MEDIA.json`. **Proposed**, not implemented/upstream ([template](/Users/vedhith/Developer/sandbox/docs/research/design-pipeline-benchmark.md:162)). |
| **Scope** | Do not change core Workflow OS. Add only the design pipeline's device/media-production instructions and gates. |

### Current design pipeline: exact ownership audit

| Current layer | What is upstream | What Workflow OS made | Decision |
|---|---|---|---|
| **S0-S10 runner** | Playwright, Chromium, axe-core, Lighthouse | Parsed stages, `doctor`, file/exit gates, screenshot critic and project application loop | Keep only as neutral enforcement plumbing. |
| **Identity, references, five worlds** | Mobbin/product observations and several video-derived methods | Identity-first and imagery-first sequence; per-project worlds that alter layout, type, color and motion | Replace with the universal template. Mobbin may inform central revisions only. |
| **5 -> 3 -> 1 picker** | Wide-to-narrow method from the sourced ChaseAI design video | Picker implementation and the new manifest-only restriction | Keep; it selects allowed manifests/assets only. |
| **Tokens, components and motion** | Utopia/WCAG/APCA formulas; measured Outcrowd/Super Productivity behavior; React runtime | CSS/React kit, interaction vocabulary, motion tokens and wrappers | Not an official-company fork. Replace design decisions with DTCG + Cloudscape + Material/Fiori contracts. |
| **Image/media** | FLUX.1-schnell, mflux, ComfyUI; Hermes-derived Flux graph shape and called cloud runner | Project wrapper, plate runner, treatment, not-black check and current per-project graph policy | Called/derived, not a fork. Keep the engines; compile locked graphs from the universal manifest. Add video/voice/composite delivery. |
| **Mascot** | Rive/Duolingo method only | SVG generator, rig and runtime written from scratch | Optional asset lane; not part of the universal component base. |
| **Rendered proof** | Browser/WCAG/testing tools | Scale recovery, substrate contrast, sameness detector and route gates | Keep useful neutral gates; validate them against the new upstream runtime. |

The current pipeline is therefore **mostly a locally implemented synthesis, not a fork**. The target can make its design rules upstream-derived and locally governed, but the selector implementation, closed-manifest compiler, vendor wrappers, route/data adapters, media ledger and governance remain unavoidable Workflow OS integration code because no company publishes that complete cross-company pipeline.

## One device/media-production contract

```text
brief + brand manifest
  -> storyboard + approved shot list
  -> real universal-site UI scenes (View Transitions/CSS/WAAPI/SVG)
  -> generated image/video plates (locked ComfyUI graph)
  -> consented voice + sound
  -> deterministic timeline, composite and time-remap
  -> captions, posters, encodes, provenance and playback tests
```

This contract **would reproduce** the observed Naive production shape: prompt [00:05], animated team/windows [00:09–00:20], then integrations [00:26–00:34] ([source video](https://www.youtube.com/watch?v=qYzbzuBmqDo), [evidence/inference split](/Users/vedhith/.claude/jobs/frames/qyzbzu-bmqdo/summary.md)). The same semantic palette, type, radii, component geometry and motion roles **would feed** both the live site and the ad timeline; only the output renderer would change.

## What this changes for us
Use standards for live morphing; use AI for media assets.
Add voice, shot, sound, composite, and delivery contracts to the device pipeline.
Never claim Google-internal or AI-only production without per-asset evidence.
