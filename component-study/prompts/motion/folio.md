# Folio / Asset and motion prompt

WDA / Jason Festa · 21 October 2026

Use the [original reference](../../references/originals/folio.png) and [five rendered states](../../interaction/folio.md) to prepare separate decorative assets. This is a production brief; new animation, cutouts and meshes are not included.

Prepare a separate coral house asset with transparent background and one consistent line-icon set for compass, bookmark and profile. Rebuild pill, dot, labels and divider in CSS/SVG. A 3D house should use a stable camera and a lightweight mesh only if interactive tilt is approved.

Move the active capsule between equal-width destination slots over 180 ms after a route commit. The coral house may settle by 2px once on Studio entry; other line icons do not morph into invented objects. Under reduced motion, swap the active treatment instantly.

Remove translation, rotation, parallax and looping animation. Selection, loading labels and focus remain visible; use an instant swap or an opacity change of at most 100 ms.

Keep the component in normal document flow. Do not hijack scrolling or drive selected values from scroll position. Pause optional decorative motion while offscreen.

Keep labels, focus rings, selection rings, counters and buttons live in the DOM. Use matched camera, light, material identity and baseline across extracted/reconstructed objects. A raster cannot supply a true 3D mesh; reconstruct and compare before delivery. Decorative layers do not capture pointer events. Preserve the same result for hover, keyboard and touch.

## References

- [MDN — aria-current](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current) — Folio uses navigation links and aria-current="page" for routes. Use tabs only if switching local panels.
- [W3C — tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — Sol day selection, Roam plan previews and Kiln reporting periods use one active panel. Focus and selection are tracked separately.
- [React — choosing state structure](https://react.dev/learn/choosing-the-state-structure) — Derive selected counts, button labels, usage totals and visible panels from stable IDs and shared data.
- [Motion — accessible animation](https://motion.dev/docs/react-accessibility) — Disable object drift, parallax and transform flourishes under reduced motion; keep selection and focus feedback.
