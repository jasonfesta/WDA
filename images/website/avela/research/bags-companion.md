# AVELA · The bags · reference companion
21 October 2026. Images for design review. Approved catalogue pair included in the AVELA page collection.

## Reference and prompt ledger
| Source / evidence | Observation recorded | Specific AVELA prompt decision |
|---|---|---|
| [Approved desktop](../../../../homepage-study/images/desktop/01-avela.png) and [approved mobile](../../../../homepage-study/images/mobile/01-avela.jpg), both inspected | Cream/oxblood identity, thin spaced wordmark, three distinct bags and prices; different respective footers | Preserve Arc $420, Fold $360, Day $480 and their silhouettes. Retain cream ground and respective footers; do not replicate homepage campaign bands. |
| [Polène bags](https://eng.polene-paris.com/collections/bags), official page text reopened; archived catalogue and open-filter captures visually inspected | Model shortcuts, filters and sorting lead into merchandise. Archived desktop capture has four product columns, small labels, large photographic areas. Official current filter list includes availability, material, colour and size. | Three columns suit the nine AVELA colour studies; compact control row and large consistent photographs. Offer only AVELA-supported shape, colour and price filters. Column count and cream photographic treatment are AVELA decisions. |
| [COS bags](https://www.cos.com/en-us/women/bags), Chrome visually inspected at 390×844 | Compact mobile header, horizontal category links, filter/sort row, density choices; selected two-column view has almost edge-to-edge photos and readable left-aligned name/price. Filter sheet shows sort choices, expandable attributes, reset and result action. | Mobile uses two columns, 16px outside gutters, 14px gap, distinct mobile Menu/Bag header; text remains 12–16px logical. AVELA uses exact short model names rather than truncating. Filter/sort move to sheets. Separate Add action and labelled colours. |
| [Baymard applied filters](https://baymard.com/research-articles/how-to-design-applied-filters), article read | Visible applied selections clarify what is filtering the list and allow removal. | In the proposed applied state, show removable Shape/Colour/Price chips above results; show Clear all and updated count. Default image has no active chips. |
| [Baymard mobile ecommerce](https://baymard.com/research-articles/mobile-ux-ecommerce), article reviewed | Colour variants and filter overviews need deliberate treatment on mobile. | Keep the chosen colour written beside the image, expose all three swatches, and preserve model identity. The current nine-entry grid is three models in three proposed colour studies, not nine distinct bag designs. |

## Section-by-section companion
1. **Header.** AVELA identity from approved images; desktop navigation reflows to Menu / Bag on mobile. Search in desktop mockup is a proposed optional control; it needs a real search state before implementation.
2. **Title and controls.** Quiet catalogue title; All / Arc / Fold / Day, result count, Filter and Sort. COS supports compact mobile controls; Polène supports model shortcuts. Active underlines must remain visible, not hover-only.
3. **Product grid.** Three desktop columns and two mobile columns. Left-aligned name, separate readable price/colour, selected swatch and Add action. Nine colour studies follow the desktop sequence row-major on mobile. Each model keeps its approved design price.
4. **End of results.** Showing all 9 pieces and a quiet help link. No load-more control is needed for this nine-entry concept. No marketing blocks break the grid.
5. **Footer.** Approved desktop four-group footer; approved compact mobile identity and two short link groups. No repeated newsletter band.

## Planned interaction detail
These are proposed behaviors for future implementation, not interactions proven by static images.
- Category selection changes the grid, count and selected underline; browser Back should restore the choice and scroll.
- Filters: Shape, Colour, Price; OR within a group, AND across groups. A sheet keeps draft choices until Apply. Close discards unapplied choices. Clear all resets filters.
- Sort: Featured, Price low to high, Price high to low. Do not expose Newest without launch-date data.
- Active filters remain visible with individual remove controls and Clear all. Zero results offers Clear filters and Adjust filters.
- Swatch selection changes photo and written colour together; preserve variant when opening detail.
- Add uses the visible selected variant and opens the bag drawer after confirmation. Pending/failure states must prevent duplicate additions.
- Mobile uses native vertical scrolling, explicit touch actions and visible focus. Suggested targets are at least44px; static raster mockups cannot certify interaction or accessibility.
- Bag drawer and checkout are outside this narrowed image round.

## Evidence saved
- [COS mobile grid at390px](captures/cos-mobile-grid-390.jpg)
- [COS mobile filter sheet at390px](captures/cos-mobile-filters-390.jpg)
- Prior Polène captures: [catalogue](captures/polene-catalogue.jpg), [filters](captures/polene-filters.jpg)
- Exact image generation prompts: [desktop](../prompts/bags-desktop-v2.txt), [mobile upper](../prompts/bags-mobile-upper.txt), [mobile lower](../prompts/bags-mobile-lower.txt)

## Mobile production constraint
Final raster width is exactly390px, matching approved mobile reference. Height follows content, as Jason clarified. Sections are generated as mobile layouts and assembled/resized proportionally with explicit user permission. They are not cropped from the desktop. All design creation uses built-in image generation; no website code or HTML is produced.

