# Design & React Engineering Skills

```text
GOOGLE ANTIGRAVITY STANDARD SKILL LAYOUT · HARNESS + HTML VIEWERS
─────────────────────────────────────────────────────────────────
discovery   .agents/skills.json -> ["qwen", "typography", "image-gen", "react", "qa-eval"]
structure   <category>/<skill_name>/{SKILL.md, references/, scripts/, evals/, skill.json, index.html}
html index  index.html + <category>/<skill_name>/index.html (Black #000000 / Light Mode · Google Sans Flex)
validation  python3 scripts/check_skills.py --sync --test-io --package
```

Collection of **12 self-contained, Google Antigravity-verified skills** organized across **5 category folders** (`qwen/`, `typography/`, `image-gen/`, `react/`, `qa-eval/`). Every skill strictly follows the official Google Antigravity skill directory standard—packaging its own `SKILL.md`, local `references/` and/or `scripts/`, harness contract (`skill.json` + `evals/smoke.json`), and standalone **Google Sans Flex** HTML viewer (`index.html`) inside a single portable folder.

```text
skills/
├── .agents/
│   └── skills.json                            Google Antigravity skill discovery manifest
├── AGENTS.md                                  Workspace rules & progressive disclosure guide
├── README.md                                  Skills catalog, directory tree & harness CLI
├── index.html                                 Master HTML catalog (Dark #000000 / Light Mode)
├── harness.json                               Master harness registry for all 12 skills
├── qwen/                                      Research, Design Range & Prompt Specs
│   ├── competitor-benchmarking/               {SKILL.md, references/, evals/, skill.json, index.html}
│   ├── design-range-spectrum/                 {SKILL.md, references/, evals/, skill.json, index.html}
│   └── prompt-builder-specs/                  {SKILL.md, references/, evals/, skill.json, index.html}
├── typography/                                Multimodal Google Font Selection & Top-5 Ranking
│   └── google-font-selection/                 {SKILL.md, references/, scripts/, evals/, skill.json, index.html}
├── image-gen/                                 Nano Banana 2 Comps, Grids & Clean Plates
│   └── nano-banana-image-gen/                 {SKILL.md, references/, evals/, skill.json, index.html}
├── react/                                     Design Handoff, Translation & Code Steering
│   ├── design-package-handoff/                {SKILL.md, references/, evals/, skill.json, index.html}
│   ├── image-to-react-translation/            {SKILL.md, references/, evals/, skill.json, index.html}
│   └── code-steering-checkpoints/             {SKILL.md, references/, evals/, skill.json, index.html}
├── qa-eval/                                   Comp QA, Benchmarking, Viewport QA & Packaging
│   ├── grid-comp-qa/                          {SKILL.md, references/, evals/, skill.json, index.html}
│   ├── cleanup-evaluation-benchmarking/       {SKILL.md, references/, evals/, skill.json, index.html}
│   ├── viewport-performance-qa/               {SKILL.md, references/, evals/, skill.json, index.html}
│   └── linting-model-safe-packaging/          {SKILL.md, scripts/, evals/, skill.json, index.html}
└── scripts/
    ├── harness.py                             Harness CLI (build, list, prompt, verify, test-all)
    └── check_skills.py                        Validates frontmatter, HTML/MD links, $0 I/O & .zip
```

## Standalone skills catalog

Open the master HTML catalog at [index.html](index.html) or open any individual skill's HTML page, `SKILL.md`, or local `references/` / `scripts/` below:

| Folder | Skill | HTML Viewer (`#000` / Light) | Markdown (`SKILL.md`) | Local Subfolder (`./references/` or `./scripts/`) | Harness Contract | Cost Tier |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `qwen/` | **Competitor Benchmarking** | [index.html](qwen/competitor-benchmarking/index.html) | [SKILL.md](qwen/competitor-benchmarking/SKILL.md) | [references/](qwen/competitor-benchmarking/references/visual-review.md) | [skill.json](qwen/competitor-benchmarking/skill.json) | `browser` |
| `qwen/` | **Design Range Spectrum** | [index.html](qwen/design-range-spectrum/index.html) | [SKILL.md](qwen/design-range-spectrum/SKILL.md) | [references/](qwen/design-range-spectrum/references/react-interaction-contract.md) | [skill.json](qwen/design-range-spectrum/skill.json) | `free` |
| `qwen/` | **Prompt Builder Specs** | [index.html](qwen/prompt-builder-specs/index.html) | [SKILL.md](qwen/prompt-builder-specs/SKILL.md) | [references/](qwen/prompt-builder-specs/references/prompt-builder.md) | [skill.json](qwen/prompt-builder-specs/skill.json) | `free` |
| `typography/` | **Google Font Selection** | [index.html](typography/google-font-selection/index.html) | [SKILL.md](typography/google-font-selection/SKILL.md) | [scripts/](typography/google-font-selection/scripts/recommend_google_fonts.py) · [references/](typography/google-font-selection/references/google-fonts-taxonomy.md) | [skill.json](typography/google-font-selection/skill.json) | `free` |
| `image-gen/` | **Nano Banana Image Gen** | [index.html](image-gen/nano-banana-image-gen/index.html) | [SKILL.md](image-gen/nano-banana-image-gen/SKILL.md) | [references/](image-gen/nano-banana-image-gen/references/cleanup-brief.md) | [skill.json](image-gen/nano-banana-image-gen/skill.json) | `paid_api` |
| `react/` | **Design Package Handoff** | [index.html](react/design-package-handoff/index.html) | [SKILL.md](react/design-package-handoff/SKILL.md) | [references/](react/design-package-handoff/references/react-handoff.md) | [skill.json](react/design-package-handoff/skill.json) | `free` |
| `react/` | **Image-to-React Translation** | [index.html](react/image-to-react-translation/index.html) | [SKILL.md](react/image-to-react-translation/SKILL.md) | [references/](react/image-to-react-translation/references/BUILD-PROMPT.md) | [skill.json](react/image-to-react-translation/skill.json) | `free` |
| `react/` | **Code Steering Checkpoints** | [index.html](react/code-steering-checkpoints/index.html) | [SKILL.md](react/code-steering-checkpoints/SKILL.md) | [references/](react/code-steering-checkpoints/references/warm-moodboard-build-brief.md) | [skill.json](react/code-steering-checkpoints/skill.json) | `free` |
| `qa-eval/` | **Grid & Comp QA** | [index.html](qa-eval/grid-comp-qa/index.html) | [SKILL.md](qa-eval/grid-comp-qa/SKILL.md) | [references/](qa-eval/grid-comp-qa/references/review-notes.md) | [skill.json](qa-eval/grid-comp-qa/skill.json) | `free` |
| `qa-eval/` | **Cleanup & Eval Benchmarking** | [index.html](qa-eval/cleanup-evaluation-benchmarking/index.html) | [SKILL.md](qa-eval/cleanup-evaluation-benchmarking/SKILL.md) | [references/](qa-eval/cleanup-evaluation-benchmarking/references/verification.md) | [skill.json](qa-eval/cleanup-evaluation-benchmarking/skill.json) | `free` |
| `qa-eval/` | **Viewport & Performance QA** | [index.html](qa-eval/viewport-performance-qa/index.html) | [SKILL.md](qa-eval/viewport-performance-qa/SKILL.md) | [references/](qa-eval/viewport-performance-qa/references/browser-checks.json) | [skill.json](qa-eval/viewport-performance-qa/skill.json) | `browser` |
| `qa-eval/` | **Linting & Model-Safe Packaging** | [index.html](qa-eval/linting-model-safe-packaging/index.html) | [SKILL.md](qa-eval/linting-model-safe-packaging/SKILL.md) | [scripts/](qa-eval/linting-model-safe-packaging/scripts/package_component_study.py) | [skill.json](qa-eval/linting-model-safe-packaging/skill.json) | `free` |

## Harness CLI & Zero-Cost (`$0`) Verification

```sh
# 1. Build all skill.json contracts, smoke fixtures, and standalone HTML pages
python3 scripts/harness.py build

# 2. List all 12 skills with folder, cost_tier, and paths
python3 scripts/harness.py list

# 3. Run the Google Font recommender on any artifact (image, video, code, or text brief)
python3 typography/google-font-selection/scripts/recommend_google_fonts.py \
  --artifact "Hero campaign image and product brief for Avela leather goods" \
  --format markdown

# 4. Verify all 12 skills against their skill.json output contracts ($0 cost)
python3 scripts/harness.py test-all

# 5. Run the 4-layer $0 verification suite + HTML/Markdown link checker + .zip packager
python3 scripts/check_skills.py --sync --test-io --package
```
