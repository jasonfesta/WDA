# Kiln / Asset and motion prompt

WDA / Jason Festa · 21 October 2026

Use the [original reference](../../references/originals/kiln.png) and [five rendered states](../../interaction/kiln.md) to prepare separate decorative assets. This is a production brief; new animation, cutouts and meshes are not included.

Rebuild bars, labels, legends and counters as HTML/SVG from real data. Keep the leaf mark as a separate decorative vector if desired. Do not extract an animated chart from the screenshot or turn data into a looping video.

Animate bars from their previous validated value to the next over 220 ms, only after successful data loading. Never animate from zero on every scroll. Tooltip fades over 80 ms. Under reduced motion, values and widths update immediately. Chart motion is programmatic, not rendered video.

Remove translation, rotation, parallax and looping animation. Selection, loading labels and focus remain visible; use an instant swap or an opacity change of at most 100 ms.

Keep the component in normal document flow. Do not hijack scrolling or drive selected values from scroll position. Pause optional decorative motion while offscreen.

Keep labels, focus rings, selection rings, counters and buttons live in the DOM. Use matched camera, light, material identity and baseline across extracted/reconstructed objects. A raster cannot supply a true 3D mesh; reconstruct and compare before delivery. Decorative layers do not capture pointer events. Preserve the same result for hover, keyboard and touch.

## References

- [Supabase — usage documentation](https://supabase.com/docs/guides/platform/manage-your-usage) — Kiln needs explicit units, denominator labels and category details. This is a structure reference, not a copied pricing model.
- [W3C — complex images and charts](https://www.w3.org/WAI/tutorials/images/complex/) — Kiln exposes a data table and values in text; hover tooltips are supplemental.
- [W3C — tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — Sol day selection, Roam plan previews and Kiln reporting periods use one active panel. Focus and selection are tracked separately.
- [W3C — modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) — Roam review and Kiln plan details need explicit close/cancel paths with trigger focus restoration.
- [React — choosing state structure](https://react.dev/learn/choosing-the-state-structure) — Derive selected counts, button labels, usage totals and visible panels from stable IDs and shared data.
