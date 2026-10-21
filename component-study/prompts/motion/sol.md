# Sol / Asset and motion prompt

WDA / Jason Festa · 21 October 2026

Use the [original reference](../../references/originals/sol.png) and [five rendered states](../../interaction/sol.md) to prepare separate decorative assets. This is a production brief; new animation, cutouts and meshes are not included.

Extract or recreate the orange sun disc, a separate frosted plane and a static fallback. Deliver transparent artwork without any text, tabs, icon labels or shadows that cross the component edge. Keep one stable camera and lighting direction. A bitmap cannot yield a true 3D mesh; reconstruct if a 3D material is required.

On a committed day change, crossfade the condition illustration in 180 ms. A future satin sun shader may shift its highlight by at most 2% over a slow 12-second cycle while visible. It is decorative, paused offscreen, and completely static for reduced motion. No temperature count-up.

Remove translation, rotation, parallax and looping animation. Selection, loading labels and focus remain visible; use an instant swap or an opacity change of at most 100 ms.

Keep the component in normal document flow. Do not hijack scrolling or drive selected values from scroll position. Pause optional decorative motion while offscreen.

Keep labels, focus rings, selection rings, counters and buttons live in the DOM. Use matched camera, light, material identity and baseline across extracted/reconstructed objects. A raster cannot supply a true 3D mesh; reconstruct and compare before delivery. Decorative layers do not capture pointer events. Preserve the same result for hover, keyboard and touch.

## References

- [Apple — Weather guide](https://support.apple.com/guide/iphone/check-the-weather-iph1ac0b35f/ios) — Sol retains a compact four-day surface, with unit conversion and a separately opened location control.
- [W3C — tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — Sol day selection, Roam plan previews and Kiln reporting periods use one active panel. Focus and selection are tracked separately.
- [Radix — Popover build example](https://www.radix-ui.com/primitives/docs/components/popover) — Use a tested popover primitive for Gather and Sol options, retaining the existing material art and layout.
- [React — choosing state structure](https://react.dev/learn/choosing-the-state-structure) — Derive selected counts, button labels, usage totals and visible panels from stable IDs and shared data.
- [Motion — accessible animation](https://motion.dev/docs/react-accessibility) — Disable object drift, parallax and transform flourishes under reduced motion; keep selection and focus feedback.
