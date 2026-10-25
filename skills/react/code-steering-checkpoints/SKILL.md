---
name: code-steering-checkpoints
description: >-
  Steer code on foundational React screens before scaling across a multi-page
  application by classifying divergence from design comps and executing either
  Path A (Revert Drift to restore strict comp fidelity) or Path B (Freeze & Branch
  git worktree to capture, analyze, and promote emergent high-craft behavior).
  Use this skill when the user wants to review core template screens, strip
  unrequested UI chrome ("slop"), or freeze and promote a high-craft code
  interaction across the codebase.
---

# Code Steering & Worktree Control

```text
skill / code-steering-checkpoints
────────────────────────────────────────────────────────────────────
mode      standalone code steering & git worktree control
input     foundational React screens (first 3–5 pages) + source comps
output    steered worktree (Path A Revert Drift OR Path B Freeze & Branch)
```

Review the first **3–5 foundational React screens** alongside their source comps before multiplying patterns across a larger 30–42+ screen application—executing targeted designer code steering (~3 steering moments) through **Path A (Revert Drift)** or **Path B (Freeze & Branch)**.

## Inputs

- Running foundational React screen(s) (`1440px` desktop and `390px` mobile previews) alongside the source design comps.
- Reference build brief showing superseding direction notes: [warm-moodboard-build-brief.md](./references/warm-moodboard-build-brief.md).

## Work

1. **Review the Shareable Checkpoint Artifact on the first 3–5 core screens.**
   - Never multiply an unverified layout or component shell across 35+ screens blindly.
   - Inspect the running foundational screens at desktop (`1440px`) and mobile (`390px`) side-by-side with the source comps, `validation.json`, and `browser-checks.json`.

2. **Classify every code-level divergence (~3 Designer Steering Moments).**
   Evaluate each difference between the static comp and the live React build into one of two categories:

   | Divergence Type | Characteristic Signals | Required Steering Path |
   | :--- | :--- | :--- |
   | **Negative Drift ("Slop")** | Model invented unrequested dashboard chrome (enclosing pill/card around floating controls, decorative dials, scale sliders, download/export buttons, brief modals, extra footers), boxed cards where silhouettes should float on cream, reference ID captions (`REF-001`) under board items, or compressed chapter spacing | **Path A — Revert Drift** |
   | **Emergent High-Craft Behavior ("Happy Accident / Charm")** | Model produced a code-native interaction or material detail that elevates the static comp—such as an unboxed floating tonal bar, a live warm-to-near-white gradient headline with descender-safe padding, pixel-sampled 16-swatch artwork/photo banks, or tactile Three.js procedural/bump-mapped finishes (`Original`, `Stone`, `Glaze`, `Linen`) | **Path B — Freeze & Branch** |

3. **Execute Path A — Revert Drift (Restore Strict Comp Fidelity).**
   - **Isolate and revert**: Restore the drifting component, layout container, or stylesheet to the last clean state (`git checkout -- <path>` or targeted DOM removal).
   - **Codify explicit negative constraints**: Add an explicit exclusion rule to the build brief so subagents never re-introduce the drift—for example:
     - *"Compact controls float directly above the workspace without an enclosing panel, border, or rounded container."*
     - *"Remove decorative dials, scale controls, downloads, exports, the brief modal, and the page footer."*
     - *"The board contains the actual objects without reference IDs, small category/title captions, or arrows underneath."*
   - **Re-verify**: Re-run `npm run build`, `validation.json`, and `browser-checks.json` to confirm strict visual and behavioral agreement with the comp.

4. **Execute Path B — Freeze & Branch (Capture, Analyze, & Promote Emergent Craft).**
   - **Step 1 — Freeze worktree**: Immediately commit or branch/tag the working worktree (`git checkout -b steering/<feature-slug>` or `git commit`) so the emergent high-craft implementation cannot be overwritten by parallel agents.
   - **Step 2 — Analyze & extract**: Inspect the exact CSS rules, token math, React state hook, or Three.js shader/material setup that produced the emergent quality, and encapsulate it into the shared contract (`src/theme.ts`, `AreaProps`, or shared CSS variables).
   - **Step 3 — Promote forward in the canonical build brief**: Prepend a dated **Current direction** superseding header at the top of the build brief (preserving the original prompt wording as history, as in [warm-moodboard-build-brief.md](./references/warm-moodboard-build-brief.md)).
   - **Step 4 — Scale across remaining screens**: Propagate the frozen, documented pattern across all remaining routes, tabs, or component states so downstream validators test against the newly promoted contract.

## Input → Output Example

**Sample Input**:
```text
"On the Warm Moodboard shell:
1. The model wrapped the top controls in a bordered pill container and added REF-001 captions under every card.
2. The model also built a live Three.js material area with selectable Stone/Glaze/Linen finishes and 16-color pixel-sampled artwork/photo banks. Steer both."
```

**Expected Output (Steering Execution & Build Brief Update)**:
```markdown
1. **Path A (Revert Drift)**: Stripped the enclosing `.header-pill-panel` border/container and removed `.tile-caption` reference IDs/arrows in `src/Header.tsx` and `src/App.tsx`. Added negative constraint: *"Compact controls float directly above the workspace without an enclosing panel... The board contains the actual objects without reference IDs, small category/title captions, or arrows underneath."*
2. **Path B (Freeze & Branch)**: Frozen in git commit and promoted to the top of `warm-moodboard-build-brief.md`:
   `**Current direction, October 15, 2026:** Build authorized. The user instructed us to proceed with the selected imagery, split React areas among subagents, and include a real, heavily textured WebGL area. This supersedes the earlier collection gate.`
```

## Result

Deliver the human-steered worktree and updated build brief (with any **Path A** negative constraints and **Path B** superseding direction notes).

### Verification

- [ ] Foundational screens (first 3–5 pages/components) have been reviewed via shareable checkpoint artifacts before full-scale multiplication.
- [ ] All negative drift ("slop") has been stripped under **Path A** and locked out via explicit negative constraints in the build brief.
- [ ] All approved emergent craft under **Path B** is committed in the git worktree and documented in the dated **Current direction** block of the build brief.
