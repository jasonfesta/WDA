# Our workshop — reference companion, revision 2

Reviewed 21 October 2026. Deliverable: image-generated desktop and mobile page concepts. Motion, video and 3D controls are depicted states, not implemented features.

## Primary live companion

[HEREU Craftsmanship](https://hereustudio.com/pages/craftmanship) is the one-to-one editorial companion. The live page was inspected in Chrome at desktop and mobile sizes. Its sequence introduces making, expands into material and signature details, and connects those stories to products. AVELA adopts the move from a making overview into close inspection and onward discovery. It does not adopt HEREU’s origin, workshop history or sourcing claims. Earlier screenshots are retained in [the research captures](captures/).

The user’s new sequence takes precedence over the earlier layout: a large film, a large interactive bag, two alternating image/text touts, community imagery, newsletter and footer. The interactive and community sections are AVELA additions, not features attributed to HEREU.

## Section-by-section mapping

| AVELA section | Reference and observed evidence | Translation into the image prompt |
|---|---|---|
| Header | Approved original AVELA homepage | Same tracked wordmark, three links and Bag (0); white over the workshop film, Menu and Bag on mobile. |
| Shaped by hand | HEREU’s opening craft imagery; AVELA homepage’s workshop photograph | A large cinematic film poster of hands shaping the Arc, short overlaid introduction and visible play control. The requested video treatment is AVELA’s adaptation. |
| Find Your Form | User’s explicit direction; supporting [live model-viewer annotation examples](https://modelviewer.dev/examples/annotations/) | An oversized Arc on open cream, three small detail dots, one readable selected detail, and a grip beneath the bag. The technical reference demonstrates hotspots anchored to a rotating object; it is not a retail-page styling reference. |
| Softness, given shape | HEREU’s material chapter; AVELA’s existing leather photography | Image left, narrow text right. A close view of the gathered leather explains the Arc’s form. |
| A closer kind of care | HEREU’s signature-detail chapter | Text left, image right. Brass connector and strap details continue the same object story. On mobile both touts become image then text. |
| Out in the world | Approved homepage’s Carried through the day section | Three generated lifestyle scenes with Arc, Fold and Day. These are editorial concepts, not actual influencer endorsements or customer testimonials. Real creator credits and permissions are content requirements if replaced with community submissions. |
| Newsletter and footer | Approved original AVELA homepage, device-specific artwork | Reuse the blue newsletter band and oxblood footer by image assembly, preserving wording and link groups. |

## Intended interactions for a later build

- Film: user-initiated playback, pause, captions and transcript; a still poster remains available with reduced motion or failed media. No audio autoplay.
- Form selector: Arc, Fold and Day update the product, selected label and relevant detail points together. Default is Arc. Loading and failure retain a useful still image.
- 3D product: dragging the bag or grip rotates horizontally. The grip has a label and keyboard left/right controls; a reset-view action restores the initial angle. Touch rotation does not trap vertical page scrolling. No automatic endless spin.
- Hotspots: labelled controls for gathered edge, connector and curved base. Click/tap/focus opens one detail at a time; Escape or an explicit close dismisses it. Hidden rear-facing points are not clickable. On mobile the detail text sits beneath the model rather than covering the bag.
- Supporting technical evidence: the live model-viewer annotation examples document surface-relative hotspots, visibility changes and camera-target interactions. AVELA’s specific grip, accessible controls and appearance are design proposals.
- Editorial links lead to the appropriate product or care guide. Community images open individual stories with authentic attribution when real content is supplied.
- Newsletter preserves the existing email input and Join the atelier action; submission, validation, consent and service-confirmed success need specification before implementation.

## Visual constraints encoded in prompts

Open cream, oxblood serif headings, existing AVELA bag silhouettes and warm photographic light. No boxed content, fake reviews, invented maker biographies, unsupported material claims or extra navigation. Desktop alternates image/text orientation; mobile uses one real 390-pixel logical column with readable text and touch-sized controls. Footer and newsletter come from the original homepage, not from Bags or a competitor.

## Generation record

Built-in image generation only. Prompt files are in [../prompts](../prompts/). Source sections are joined by image assembly; no HTML or website code is produced. The original homepage footer/newsletter are reused raster artwork, so their available detail remains limited to the supplied source resolution. Delivered file dimensions are recorded in [the delivery manifest](../manifest.json).
