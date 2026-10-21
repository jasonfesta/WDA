# Roam / Asset and motion prompt

WDA / Jason Festa · 21 October 2026

Use the [original reference](../../references/originals/roam.png) and [five rendered states](../../interaction/roam.md) to prepare separate decorative assets. This is a production brief; new animation, cutouts and meshes are not included.

Extract/recreate the coral ribbon, amber arc, moss sphere, citron fold and rose discs as separate transparent assets. Use the same lighting and camera as the reference. Preserve cream cells as CSS backgrounds. A 3D version requires mesh reconstruction, with a static image fallback; do not pretend a flattened screenshot contains reusable geometry.

Crossfade plan copy and artwork in 180 ms after activation; reserve the maximum content height to prevent jumps. The hero ribbon may have a single subtle 3° turn on entry, never continuous movement near price text. Feature objects remain still until a detail interaction.

Remove translation, rotation, parallax and looping animation. Selection, loading labels and focus remain visible; use an instant swap or an opacity change of at most 100 ms.

Keep the component in normal document flow. Do not hijack scrolling or drive selected values from scroll position. Pause optional decorative motion while offscreen.

Keep labels, focus rings, selection rings, counters and buttons live in the DOM. Use matched camera, light, material identity and baseline across extracted/reconstructed objects. A raster cannot supply a true 3D mesh; reconstruct and compare before delivery. Decorative layers do not capture pointer events. Preserve the same result for hover, keyboard and touch.

## References

- [W3C — tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — Sol day selection, Roam plan previews and Kiln reporting periods use one active panel. Focus and selection are tracked separately.
- [Stripe — subscription pricing table](https://docs.stripe.com/payments/checkout/pricing-table) — Roam previews and compares plans, then explicitly reviews the chosen price. Selection alone does not subscribe.
- [W3C — modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) — Roam review and Kiln plan details need explicit close/cancel paths with trigger focus restoration.
- [React — choosing state structure](https://react.dev/learn/choosing-the-state-structure) — Derive selected counts, button labels, usage totals and visible panels from stable IDs and shared data.
- [Motion — accessible animation](https://motion.dev/docs/react-accessibility) — Disable object drift, parallax and transform flourishes under reduced motion; keep selection and focus feedback.
