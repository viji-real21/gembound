# Major-company media pipeline evidence

**Research snapshot:** 2026-08-25
**Source rule:** first-party company documentation, company-owned source repositories, official project repositories, and standards only.

## Answer first

**No first-party source reviewed says Google, AWS/Amazon, Microsoft, Adobe, IBM, Anthropic, or another audited design-system company uses ComfyUI inside its own production design pipeline.** Google, AWS, Microsoft, and NVIDIA publish ComfyUI nodes, samples, or deployment code. That proves ecosystem support—not internal use.

**No audited company publishes a complete internal image/video research-to-site pipeline as a truthful fork.** The closest public artifacts are generation studios, API workflows, infrastructure samples, models, and nodes. They do not publish the whole company process for art direction, rights review, human approval, derivatives, accessibility, delivery, and product adoption.

For Workflow OS: **keep ComfyUI as the media orchestrator; extend it with a governed video graph; keep code/UI motion separate; and gate embedded video as a production asset.** Do not claim that this matches a company's private pipeline.

## 1. ComfyUI use: internal use versus integration

“Official repository” and “used internally” are different claims. An integration can be real while the company's private creative workflow remains unknown.

| Company | First-party ComfyUI evidence | What it proves | What it does **not** prove |
|---|---|---|---|
| **Google** | Google Cloud publishes preview [GenMedia custom nodes](https://github.com/GoogleCloudPlatform/comfyui-google-genmedia-custom-nodes) for Gemini image, Imagen, Veo, Lyria, and related Vertex AI services, plus a [GKE ComfyUI reference implementation](https://github.com/GoogleCloudPlatform/accelerated-platforms). The node repository explicitly says it is **not an officially supported Google product**. | Google Cloud engineers provide customer-facing integration/reference code. | That Google, Alphabet, Material, or a Google product-design team uses ComfyUI internally. |
| **AWS/Amazon** | AWS publishes an MIT-0 [ComfyUI-on-EKS sample](https://github.com/aws-samples/comfyui-on-eks), an [AWS Architecture Blog deployment](https://aws.amazon.com/blogs/architecture/deploy-stable-diffusion-comfyui-on-aws-elastically-and-efficiently/), and a [SageMaker processing-jobs workflow](https://aws.amazon.com/blogs/machine-learning/running-comfyui-workflows-on-amazon-sagemaker-ai-processing-jobs/). | AWS supports customers running reproducible ComfyUI graphs at scale on AWS infrastructure. | That Amazon's own brand, retail, product, or Cloudscape teams use ComfyUI. |
| **Microsoft** | Microsoft's [Azure-Samples ComfyUI demo](https://github.com/Azure-Samples/comfyui-on-azure) provisions an H100 VM and demonstrates text-to-image and text-to-video models in ComfyUI. | Azure can host ComfyUI and Microsoft provides deployment guidance. | That Microsoft's design or marketing production pipeline uses it. |
| **Adobe** | No Adobe-owned ComfyUI node, deployment, or internal-use statement was found in the first-party sources reviewed. Adobe instead publishes [Firefly Services](https://developer.adobe.com/firefly-services/docs/guides/) APIs. | Adobe exposes its own managed creative services. | Absence of a public statement cannot prove Adobe employees never use ComfyUI. |
| **IBM** | No IBM-owned ComfyUI integration or internal-use statement was found. IBM's published watsonx.ai model list includes text models and Granite Vision for multimodal understanding, while its public API overview lists text/chat, extraction, embeddings, reranking, and forecasting rather than a first-party media generator ([watsonx models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models.html?context=wx), [API overview](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api.html?context=wx)). | No IBM media-generation or ComfyUI claim is supported by the reviewed catalog. | That IBM has no private experiments or third-party integrations. |
| **Anthropic** | No Anthropic ComfyUI integration or internal-use statement was found. Anthropic says Claude does not generate photos or illustrations like image-generation tools; it can create HTML/SVG visuals and analyze uploaded images ([Claude image capability](https://support.claude.com/en/articles/9002504-can-claude-produce-images)). Anthropic also says Claude does not produce photorealistic image or video output ([child-safety guidance](https://support.claude.com/en/articles/15591275-child-safety-guidance-for-developers)). | Claude is not a first-party raster image/video generator to copy into this pipeline. | That Anthropic has disclosed its internal brand-asset tools—it has not. |
| **NVIDIA** | NVIDIA publishes experimental Apache-2.0 [ComfyUI video-preparation nodes](https://github.com/NVIDIA/comfy_nv_video_prep) for crop, masks, segmentation, keyframes, compositing, and Wan/LTX handoff. Comfy-Org also publishes [NVIDIA NIM nodes](https://github.com/Comfy-Org/NIMnodes). | A major platform company invests in public ComfyUI interoperability and reusable video-prep tooling. | That NVIDIA's internal creative organization standardizes on ComfyUI. |
| **Other audited systems** | No first-party internal-use statement was found for Shopify, Salesforce, GitHub, Atlassian, SAP, or Red Hat in the official design-system/media sources reviewed. | There is no defensible public evidence for the claim. | Non-disclosure is not evidence of non-use. |

The safe wording is: **“Workflow OS uses ComfyUI, an open orchestration engine with public integrations from major cloud/model vendors.”** Do not say “the same pipeline Google/Amazon uses.”

## 2. What the companies actually publish

| Company/project | Public image/video offering or open stack | Open versus closed |
|---|---|---|
| **Google** | Vertex AI exposes [Gemini/Imagen image generation and editing](https://cloud.google.com/vertex-ai/generative-ai/docs/image/overview) and [Veo video generation](https://cloud.google.com/vertex-ai/generative-ai/docs/video/generate-videos). Google Cloud's Apache-2.0 [Creative Studio](https://github.com/GoogleCloudPlatform/gcc-creative-studio) combines Imagen, Veo, Gemini prompt rewriting/critique, brand-guide input, frontend/backend/infra, and CI. | Imagen/Veo are managed closed models. Creative Studio is forkable reference code, but its README twice says it is not an officially supported Google product. The ComfyUI nodes call Vertex APIs; they do not open the models. |
| **AWS/Amazon** | Amazon Bedrock exposes proprietary [Nova Canvas image and Nova Reel video](https://docs.aws.amazon.com/nova/latest/userguide/what-is-nova.html). AWS also publishes forkable ComfyUI deployment code for EKS and SageMaker. | Nova models are closed managed services; the deployment/reference code is open. AWS's Canvas service card explicitly calls the model proprietary ([Nova Canvas service card](https://docs.aws.amazon.com/ai/responsible-ai/nova-canvas/overview.html)). |
| **Microsoft** | Microsoft Foundry exposes GPT Image through its [image-generation tool](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/image-generation) and Sora through a [video-generation API](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/video-generation). Azure-Samples publishes the ComfyUI VM demo. | GPT Image and Sora are managed OpenAI models; the Azure deployment sample is reference code, not Microsoft's creative pipeline. |
| **Adobe** | [Firefly Services](https://developer.adobe.com/firefly-services/docs/guides/) includes image generation/editing, Generate Video, Photoshop/Lightroom APIs, and a Creative Production API for batch execution, progress, and per-asset results. | Managed proprietary services; Adobe publishes API/SDK interfaces, not Firefly model weights or Adobe's internal production process. |
| **IBM** | The reviewed watsonx.ai public catalog did not expose a first-party raster image/video generator. Granite Vision is an understanding model, not evidence of image synthesis. | No first-party forkable IBM media-generation stack identified. |
| **Anthropic** | Claude can generate code-backed HTML/SVG diagrams and interactive visuals, not photorealistic images/video ([Anthropic help](https://support.claude.com/en/articles/9002504-can-claude-produce-images)). | No Anthropic image/video generation model or asset pipeline is published. |
| **Comfy-Org** | [ComfyUI](https://github.com/Comfy-Org/ComfyUI) is a GPL-3.0 node-graph engine/API for images, video, 3D, and audio. It runs open models locally and can call closed models through API nodes. | The orchestrator is open. Each model, node, and service retains its own license/terms. A workflow graph does not make a closed model open. |
| **Alibaba Wan** | [Wan2.2](https://github.com/Wan-Video/Wan2.2) publishes Apache-2.0 inference code/model releases for text-to-video, image-to-video, text+image-to-video, speech-to-video, and character animation. Its official repository records native ComfyUI integration; the 5B TI2V path supports 720p/24 fps and documents a 24 GB GPU requirement. | This is the strongest open video-generation candidate found, but it is a model/runtime—not asset governance, review, encoding, accessibility, or site delivery. Local feasibility on Workflow OS hardware remains unproven. |

## 3. Is any complete pipeline truthfully forkable?

**No—not at the scope Workflow OS needs.** The public pieces stop at different boundaries:

- **ComfyUI** is a forkable orchestration engine and workflow format, not a company's art-direction and release system.
- **Google Cloud Creative Studio** is the closest forkable, production-shaped studio: it has image/video generation, brand-guide input, a critic, gallery, frontend/backend, infrastructure, and CI. Its own README calls it a reference implementation and disclaims official product support. It does not establish Google's internal pipeline or provide Workflow OS's route-slot, approval, rights, caption, derivative, performance, and embed gates.
- **AWS ComfyUI samples** are forkable deployment infrastructure. They show model storage, scaling, API execution, and output storage—not Amazon's creative governance.
- **Microsoft's sample** is a VM/demo recipe. **NVIDIA's nodes** cover video preparation. **Wan2.2** covers generation. None is the whole asset-to-product lifecycle.
- **Adobe Firefly Services** comes closest to a managed production API, including batch workflows, but the service and models are not forkable.

Therefore Workflow OS should compose public standards and code, then own the missing governance. It must not label the result a Google, Amazon, Microsoft, Adobe, or Anthropic fork.

## 4. Workflow OS verdict

The current [`design/image-pipeline/README.md`](/Users/vedhith/Developer/vedhith-workflow-os/design/image-pipeline/README.md) already defines a per-project ComfyUI API-format graph, a measured local FLUX still-image lane, cloud routing, fixed prompt/seed behavior, and a not-black gate. It also says generated stills are only half the work and that authored motion assets are still owed. No equivalent governed video graph, media manifest, derivative/transcode contract, or embedded-video gate is defined there.

| Layer | Verdict | Required change |
|---|---|---|
| **Still-image orchestration** | **KEEP FORMAT; REPLACE AUTHORING** | Keep ComfyUI API graphs, but make `<project>/design/image-pipeline.json` a compiled artifact from one locked universal graph and a validated project media manifest. Projects may not hand-edit model, nodes, sampler, scheduler, steps, or post-processing. |
| **Still-image governance** | **EXTEND** | Add one canonical media manifest, provider/model/node licenses, input/output hashes, reviewer decision, rights note, provenance status, crops/renditions, and the universal template slot consuming the asset. |
| **Generated video assets** | **MISSING — ADD** | Compile optional `<project>/design/video-pipeline.json` from a pinned universal ComfyUI video graph. Start with a Wan2.2 native workflow only after a real hardware/license/quality test; allow managed Veo, Nova Reel, Firefly, or Sora adapters only behind the same manifest. Do not add another orchestrator. |
| **Code/UI motion** | **KEEP SEPARATE** | Buttons, panels, route transitions, focus, loading, and reduced-motion behavior stay deterministic CSS/WAAPI/SVG/Lottie governed by the universal motion contract. Never render functional UI state transitions into a video. |
| **Embedded video** | **ADD A DELIVERY GATE** | Treat video as a reviewed asset with poster, encodes, dimensions, load policy, captions/transcript where needed, controls, and reduced-motion fallback. A generated MP4 is not production-ready by itself. |

### Canonical media contract

Keep ComfyUI's graph contract, but move editable graph structure into the universal package:

```text
<project>/design/
  media.variables.json         # the only project media input
  image-pipeline.json          # generated ComfyUI still graph; never hand-edited
  video-pipeline.json          # optional generated ComfyUI video graph
  MEDIA.json                   # canonical approved asset ledger

@vedhith/universal-site/media/
  media.variables.schema.json  # closed input allow-list
  image.graph.json             # locked canonical still graph
  video.wan22.graph.json       # locked canonical video graph
  compile.ts                   # manifest + graph version -> generated project graphs
  slots.schema.json            # fixed hero, object, thumbnail, mascot, demo-video roles
  embed-contract.ts            # fixed poster, controls, captions and loading behavior
```

The compiler is deterministic: the same `templateVersion`, `mediaPipelineVersion`, manifest, and referenced input hashes must produce the same generated graph hashes. Allowed project inputs are asset role, subject/copy, approved reference asset ids, approved visual-style enum, aspect/slot, and an optional locked seed. Model choice, node topology, sampler, scheduler, steps, safety/provenance checks, post-processing, and delivery behavior remain centrally fixed.

This means Flintted and every other project run the **same pipeline**. Changing design, capability, content, data-adapter, and media manifests produces another app build or brand variant—not a new pipeline.

Each `MEDIA.json` record must include: asset id and slot; image/video type; source or provider; model and version; workflow hash; node/plugin versions and licenses; prompt reference and seed where available; source/output hashes; generation date; human reviewer and decision; rights/privacy note; safety/provenance result; master file; derived sizes/encodes; poster; captions/transcript; alt/decorative decision; reduced-motion fallback; and every route that consumes it.

Preserve provider provenance rather than stripping it. Google says Imagen/Veo use SynthID by default ([Google Cloud](https://cloud.google.com/blog/products/ai-machine-learning/announcing-veo-3-imagen-4-and-lyria-2-on-vertex-ai)); Amazon Nova Canvas adds an invisible watermark and C2PA Content Credentials ([AWS service card](https://docs.aws.amazon.com/ai/responsible-ai/nova-canvas/overview.html)); Adobe automatically attaches Content Credentials to fully Firefly-generated assets ([Adobe](https://helpx.adobe.com/firefly/web/get-started/learn-the-basics/content-credentials-overview.html)). Workflow OS still records its own ledger because provider marks differ and can be removed during processing.

### Required media gates

1. **Graph lock:** the graph, model, nodes, parameters, and runner versions match approved hashes. Unreviewed custom nodes fail.
2. **License and rights:** every model, node, input, reference, voice, music track, and output has an allowed-use record. API access is not a license conclusion.
3. **Human review:** reject malformed content, identity drift, unsafe material, misleading demonstrations, bad loops, flashing, and brand inconsistency.
4. **Slot integrity:** every generated output maps to a fixed universal-template slot; unused files and route-local hard-coded media fail.
5. **Derivatives:** generate the fixed image crops or video encodes, poster, dimensions, duration, and file-size budget from one approved master.
6. **Accessibility:** prerecorded video with meaningful audio has captions under WCAG 2.2 SC 1.2.2 ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html)); moving content that starts automatically and runs over five seconds has pause/stop/hide behavior under SC 2.2.2 ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)). Reduced-motion mode substitutes the approved poster or a non-moving equivalent.
7. **Performance:** below-the-fold video defers network work and uses a poster; Google's web.dev documents preload/lazy-load patterns for video ([lazy-loading video](https://web.dev/articles/lazy-loading-video)). The gate measures page weight and load behavior on the real route.
8. **Production proof:** screenshots prove posters/fallbacks; playback tests prove controls/captions; real-route tests prove network, MIME/range behavior, and failure fallback. A successful ComfyUI render proves only generation.

## Final decision

**KEEP:** existing ComfyUI image orchestration, because it is open, graph-based, API-addressable, and now supported by multiple public vendor integrations.

**ADD:** a pinned ComfyUI video graph plus `MEDIA.json`, with Wan2.2 as the first open candidate to test and managed provider nodes as optional fallbacks.

**SEPARATE:** generated video assets from code/UI motion. The former is media; the latter is interaction behavior and must stay live, interruptible, accessible, and fixed across the universal template.

**GATE:** every embedded video for provenance, rights, human approval, derivatives, captions/controls, reduced motion, performance, and real-route playback.

**REJECT:** “Google/Amazon uses ComfyUI internally,” “vendor nodes equal an internal pipeline,” “a generated file is production-ready,” or “the public reference studio is the company's private workflow.” None is supported by the reviewed first-party evidence.
