# Skills Workspace Instructions

- This workspace contains **12 self-contained Google Antigravity skills** organized into **5 category folders** (`qwen/`, `typography/`, `image-gen/`, `react/`, `qa-eval/`), registered directly via [.agents/skills.json](.agents/skills.json).
- Every skill directory (`<category>/<skill_name>/`) strictly adheres to the **Google Antigravity Skill Standard**:
  ```text
  <category>/<skill_name>/
  ├── SKILL.md          # Required: Main instruction file with YAML frontmatter (name, description)
  ├── references/       # Optional: Detailed reference manuals & contracts loaded on demand
  ├── scripts/          # Optional: Executable helper scripts & validators
  ├── evals/            # Optional: $0 smoke test fixtures (smoke.json)
  ├── skill.json        # Harness input/output contract
  └── index.html        # Standalone HTML viewer (Black #000000 / Light Mode · Google Sans Flex)
  ```
- Use **progressive disclosure**: load only the specific skill (`SKILL.md`) that matches the user's current request and only the files in its local `./references/` or `./scripts/` subfolder that it links to. Do not load all 12 skills at once.
- Standalone skills catalog by folder:
  - **Qwen (`qwen/`) — Research, Design Range & Prompt Specs**
    - [competitor-benchmarking](qwen/competitor-benchmarking/SKILL.md) ([HTML](qwen/competitor-benchmarking/index.html)) — Benchmark 15–25 live category URLs + full-viewport screenshots (`research.md` & `live-reference-register.md`).
    - [design-range-spectrum](qwen/design-range-spectrum/SKILL.md) ([HTML](qwen/design-range-spectrum/index.html)) — Parameterize a category's Dynamic Design Range (`Minimal → Structured → Opinionated`), 7-chapter pacing, and section-level "Charm" specs.
    - [prompt-builder-specs](qwen/prompt-builder-specs/SKILL.md) ([HTML](qwen/prompt-builder-specs/index.html)) — Author `1× Main Agent .md` + `5–10× Concept .md` files and 10-point Nano Banana 2 (`1K`) prompts.
  - **Typography (`typography/`) — Multimodal Google Font Selection & Top-5 Ranking**
    - [google-font-selection](typography/google-font-selection/SKILL.md) ([HTML](typography/google-font-selection/index.html)) — Classify any input artifact (image, video, code, or text brief) into its Design Type, query the full Google Fonts catalog (`1,600+` families), and return the **Top 5 Ranked Google Fonts** with specimen URLs, CSS2 tags, variable axes, and 4 download methods (`recommend_google_fonts.py`).
  - **Image Gen (`image-gen/`) — Nano Banana 2 Comps, Grids & Plates**
    - [nano-banana-image-gen](image-gen/nano-banana-image-gen/SKILL.md) ([HTML](image-gen/nano-banana-image-gen/index.html)) — Lock Desktop + Mobile anchor screens, expand 4K grids or screen sets, run cleanup passes (`cleanup-brief.md`), and inpaint clean background plates (`*-clean-photo.png`).
  - **React (`react/`) — Design Handoff, Translation & Code Steering**
    - [design-package-handoff](react/design-package-handoff/SKILL.md) ([HTML](react/design-package-handoff/index.html)) — Consolidate design specs, breakpoint rules, normalized crop windows, and React state contracts into `design-package.md` & `react-handoff.md`.
    - [image-to-react-translation](react/image-to-react-translation/SKILL.md) ([HTML](react/image-to-react-translation/index.html)) — Translate comps or moodboards into semantic React + TypeScript + CSS with live DOM text/controls and isolated photo/WebGL layers.
    - [code-steering-checkpoints](react/code-steering-checkpoints/SKILL.md) ([HTML](react/code-steering-checkpoints/index.html)) — Review foundational React screens and steer worktrees via **Path A (Revert Drift)** or **Path B (Freeze & Branch)**.
  - **QA Eval (`qa-eval/`) — Comp QA, Benchmarking, Viewport QA & Packaging**
    - [grid-comp-qa](qa-eval/grid-comp-qa/SKILL.md) ([HTML](qa-eval/grid-comp-qa/index.html)) — Audit generated sheets and comps for aspect-ratio delta (`< 0.5%`), native-pixel copy legibility, and state continuity (`review-notes.md` & `visual-review.md`).
    - [cleanup-evaluation-benchmarking](qa-eval/cleanup-evaluation-benchmarking/SKILL.md) ([HTML](qa-eval/cleanup-evaluation-benchmarking/index.html)) — Run side-by-side comp benchmarking plus automated SHA-256, fixture-math, and link validation (`validation.json`).
    - [viewport-performance-qa](qa-eval/viewport-performance-qa/SKILL.md) ([HTML](qa-eval/viewport-performance-qa/index.html)) — Verify cross-viewport responsiveness (`1440px` to `320px` + `200%` zoom), `60fps` scroll/WebGL lifecycle, and browser interaction checks (`browser-checks.json`).
    - [linting-model-safe-packaging](qa-eval/linting-model-safe-packaging/SKILL.md) ([HTML](qa-eval/linting-model-safe-packaging/index.html)) — Enforce model-format linting, verify PNG dimensions and SHA-256 hashes, write `bundle.md`, and build a `.zip` package.
- After editing any skill or reference document, run `python3 scripts/harness.py build && python3 scripts/check_skills.py --sync --test-io --package` to regenerate HTML/harness files and verify YAML frontmatter, skill naming, and relative links.
