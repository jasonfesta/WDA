# Shared AVELA artwork

The header and footer are assembled from approved AVELA raster artwork, rather than generated independently on each page.

- `header-empty-bag.png`, 1080 × 90: the approved interior header from `../../desktop/care-and-repair.png`, retaining rows 0–48 and appending its existing cream rows 54–94. This removes the Care page's active underline while preserving the approved wordmark, navigation and Bag (0) label.
- `footer.png`, 725 × 170: original homepage crop y=2000–2170 from `../../../../../homepage-study/images/desktop/01-avela.png`.
- Editorial pages use `../../shared/home-newsletter-footer-desktop.png`, the original homepage newsletter plus footer crop, 725 × 290.
- `header-one-item.png`, 1080 × 90: same empty-bag header with only the numeral region at x=1024–1034, y=27–47 replaced by an image-generated numeral 1. This is used on Shopping bag and Checkout. The exact edit prompt is `../prompts/header-one-item.txt`; native generation is `../sources/header-one-item-generated.png`. The generated strip was cropped from y=272–451 and scaled proportionately to the header before the numeral crop was assembled. All pixels outside the numeral rectangle remain the approved header.

For each desktop export, the body retains its native width. Shared header and footer are resized proportionately to that width and concatenated without drawing or retyping design content. The original footer's supplied raster resolution limits its available detail. Full-resolution page files and native body files are both preserved.
