# Sol / Stale forecast · Retry — image prompt

WDA / Jason Festa · 21 October 2026

[Output image](../../../images/states/sol/05-retry.png) · [Attached reference](../../../images/states/sol/01-today.png) · [Interaction ledger](../../../interaction/sol.md)

One reference image was attached, in the order shown above. The first state uses the original artwork; later states use the locked first-state render.

## Exact generation prompt

```text
Use case: ui-mockup / precise component state edit.
Input image 1 is the locked baseline SOL component: the art-direction and edit reference. Produce ONE finished raster image showing ONLY this SAME component in the specified state. This is a real UI state study, not a different brand or stylistic variation.

Geometry: One square weather card. Target square canvas; the outer card nearly touches all four image boundaries, with only a tiny natural shadow allowance.
Keep original materials, warm palette, icon identities, type hierarchy and layout. Flat front-on screen-space view, naturally proportioned objects and typography, crisp readable labels. The component's own rounded shapes remain; no phone, browser or OS chrome. Outside the component only flat matching off-white in tiny corner/shadow allowance; no added presentation frame, title, state number, caption, collage or broad white margin. All popup bounds must fit. State labels in this prompt are metadata, not headings to add to the artwork.

Required state: Stale forecast · Retry.
Preserve baseline Lisbon 28°C Today selected as cached data. Add a compact in-card cream alert above the day tabs, using exact text Couldn’t refresh; Last updated 18:00; and a burgundy outlined Retry button. Keep the selected unit and all four day tabs visible; slightly increase card height if needed, never overlap the temperature or card controls. Do not show a zero temperature or fake success.

Verify active indicators, counts, exact copy, data arithmetic and visible controls before returning. No unrelated brand, extra tabs, copied competitor logo or watermark. Preserve every unaffected detail from the reference. Deliver one image, not a sheet.

```
