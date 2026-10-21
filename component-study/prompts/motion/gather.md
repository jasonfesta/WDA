# Gather / Asset and motion prompt

WDA / Jason Festa · 21 October 2026

Use the [original reference](../../references/originals/gather.png) and [five rendered states](../../interaction/gather.md) to prepare separate decorative assets. This is a production brief; new animation, cutouts and meshes are not included.

Prepare four separate material spheres: rose ceramic, amber glass, moss stone and burgundy ribbed wood. Reuse the identical sphere for a person in the row and trigger. Export transparent assets with matched camera, light and baseline. No portrait replacements or names baked into pixels.

Open with a 140 ms opacity change and a 4px vertical offset. Checkmarks settle in 100 ms; avatars move only when the selected set changes. Do not continuously spin or float people. Preserve list height while an error appears beneath the footer.

Remove translation, rotation, parallax and looping animation. Selection, loading labels and focus remain visible; use an instant swap or an opacity change of at most 100 ms.

Keep the component in normal document flow. Do not hijack scrolling or drive selected values from scroll position. Pause optional decorative motion while offscreen.

Keep labels, focus rings, selection rings, counters and buttons live in the DOM. Use matched camera, light, material identity and baseline across extracted/reconstructed objects. A raster cannot supply a true 3D mesh; reconstruct and compare before delivery. Decorative layers do not capture pointer events. Preserve the same result for hover, keyboard and touch.

## References

- [W3C — checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) — Gather uses one native checkbox per person, with count and avatar summary derived from selected IDs.
- [W3C — disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) — Gather opens by activation, not hover; its trigger communicates open or closed.
- [Radix — Popover build example](https://www.radix-ui.com/primitives/docs/components/popover) — Use a tested popover primitive for Gather and Sol options, retaining the existing material art and layout.
- [React — choosing state structure](https://react.dev/learn/choosing-the-state-structure) — Derive selected counts, button labels, usage totals and visible panels from stable IDs and shared data.
- [Motion — accessible animation](https://motion.dev/docs/react-accessibility) — Disable object drift, parallax and transform flourishes under reduced motion; keep selection and focus feedback.
