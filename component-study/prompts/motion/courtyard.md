# Courtyard / Asset and motion prompt

WDA / Jason Festa · 21 October 2026

Use the [original reference](../../references/originals/courtyard.png) and [five rendered states](../../interaction/courtyard.md) to prepare separate decorative assets. This is a production brief; new animation, cutouts and meshes are not included.

Prepare five independent transparent material spheres plus a common shadow. Name files by stable material ID. Keep shape, camera, size and light fixed across every set. Do not extract labels or selected rings into the assets: those are DOM/CSS layers.

Only the hovered material lifts 2px; on selection the ring crossfades in 120 ms. Shuffle crossfades the set over 180 ms with no mixing of old labels and new artwork. There is no ambient rotation. Under reduced motion, update the entire set immediately.

Remove translation, rotation, parallax and looping animation. Selection, loading labels and focus remain visible; use an instant swap or an opacity change of at most 100 ms.

Keep the component in normal document flow. Do not hijack scrolling or drive selected values from scroll position. Pause optional decorative motion while offscreen.

Keep labels, focus rings, selection rings, counters and buttons live in the DOM. Use matched camera, light, material identity and baseline across extracted/reconstructed objects. A raster cannot supply a true 3D mesh; reconstruct and compare before delivery. Decorative layers do not capture pointer events. Preserve the same result for hover, keyboard and touch.

## References

- [W3C — radio group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) — Courtyard keeps exactly one active material, with a visible ring and its text name.
- [Radix — Toggle Group build example](https://www.radix-ui.com/primitives/docs/components/toggle-group) — A useful implementation reference for compact controls. Courtyard still uses radio semantics because it requires a choice.
- [React — choosing state structure](https://react.dev/learn/choosing-the-state-structure) — Derive selected counts, button labels, usage totals and visible panels from stable IDs and shared data.
- [Motion — accessible animation](https://motion.dev/docs/react-accessibility) — Disable object drift, parallax and transform flourishes under reduced motion; keep selection and focus feedback.
