# Motion reference library

Jason Festa / WDA · 21 October 2026

Proposed motion and interaction specification. No video, shader, extracted asset or 3D model has been produced in this round; the review remains a static screen study with an action explorer.

## Six directions

| App | Production approach | Brief |
| --- | --- | --- |
| Afterglow | Programmatic background shader | [Motion and control notes](../interaction/motion/afterglow.md) |
| Pocket Garden | Veo illustration study; layered motion fallback | [Motion and control notes](../interaction/motion/pocket-garden.md) |
| Home Note | Veo house study; precise UI transitions | [Motion and control notes](../interaction/motion/home-note.md) |
| Soul | Programmatic 3D objects; Veo motion reference | [Motion and control notes](../interaction/motion/soul.md) |
| Petal | Programmatic puzzle motion | [Motion and control notes](../interaction/motion/petal.md) |
| Daybook | Programmatic SVG daylight and timeline | [Motion and control notes](../interaction/motion/daybook.md) |

## Verified implementation sources

- [Motion · Gesture animation](https://motion.dev/docs/react-gestures) — Hover, press, focus and drag APIs support feedback on real controls. Specific timings and visual treatments in this study are WDA proposals.
- [Motion · Accessibility](https://motion.dev/docs/react-accessibility) — Reduced-motion policy can govern transforms and custom media behavior. The app must also stop its own shaders and decorative video.
- [Three.js · ShaderMaterial](https://threejs.org/docs/pages/ShaderMaterial.html) — A custom GLSL material can receive time and resolution uniforms. This supports a proposed procedural light field for Afterglow.
- [React Three Fiber · Scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) — On-demand rendering and explicit invalidation support scenes that stop when still. Reuse geometry and materials; measure the actual mobile workload.
- [Google · Video generation](https://ai.google.dev/gemini-api/docs/video) — Image-directed video is a motion-study option. Use a currently supported Veo endpoint at production time; these briefs intentionally do not pin a preview model. A generated clip is not editable 3D geometry.
- [MDN · Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) — Document visibility changes let the application suspend decorative media when the page is hidden. Resume from state rather than counting background frames.
- [W3C · Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) — Automatically moving content lasting more than five seconds alongside other content needs a way to pause, stop or hide it. This proposal uses short ambient introductions that settle.
- [W3C · Dragging movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) — Dragging needs a single-pointer alternative. Petal retains tap-select and tap-target controls as well as keyboard input.

The detailed art direction, durations, amplitudes, asset breakdowns and state responses are WDA design proposals. Veo is retained as the requested motion-study direction; choose a supported endpoint at render time. Existing approved screens and historical art references remain packaged locally; external documentation is linked and summarized, not copied in full.
