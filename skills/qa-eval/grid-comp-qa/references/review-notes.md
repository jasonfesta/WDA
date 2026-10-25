# Nano Banana 2 Cleanup

22 requests submitted (21 first-pass requests plus one authorized Spriglet retry); all 21 sheets returned. The failed first Spriglet attempt is retained in the local request history.

All 21 returned sheet overviews were visually inspected. Four targeted native-pixel crops from the first pass were inspected to check visible text, puzzle and artifact failures. This is a sampled review, not a claim that every glyph or pixel was verified.

Three significant ratio failures: Avela 7.52%, Virel 39.99%, Usage 35.54%. Spriglet differs by 0.7363%; the remaining 17 differ by less than 0.4% in overall canvas ratio. This does not prove every internal object or section is unchanged.

Native outputs are preserved unaltered. The source library is unchanged. These are review outputs with known copy, state and geometry issues.

| Sheet | Native output | Ratio change | Review |
|---|---|---|---|
| websites/avela | 5504 × 3072 | 7.5175% | Needs correction: sheet ratio changed by 7.52%; product title became “Aoda / Arc,” and multiple labels/prices are garbled. Not approved as final. |
| websites/stillhaven | 5312 × 3200 | 0.3838% | Five full pages and overall proportions retained within 0.39%, but headings, supporting copy and testimonials contain malformed text. Not approved for final copy. |
| websites/oriel | 5312 × 3200 | 0.3838% | Five complete pages retained within 0.39% of source ratio. Several project labels and section headings are still wrong or garbled; requested name corrections were not reliably applied. |
| websites/sundrop | 5332 × 3200 | 0.0087% | Overall ratio retained, but pack descriptions, pricing text and several headings are visibly corrupted. Packaging/count/price accuracy is not approved. |
| websites/serein | 5312 × 3200 | 0.3838% | Brand imagery and five-page structure largely retained. Product details, labels and supporting copy remain malformed; canonical product volume/price consistency is not verified. |
| websites/vellune | 5312 × 3200 | 0.3838% | Five pages retained with near-matching ratio. Product measurements, shopping-bag amounts and smaller text still conflict or are malformed. Not final copy. |
| websites/terreno | 5332 × 3200 | 0.0087% | Overall geometry retained. Multiple brand/body labels are misspelled and the cart thumbnail still differs from the woven product. Context corrections incomplete. |
| websites/mellore | 5312 × 3200 | 0.3838% | Overall geometry retained within 0.39%. Several product labels, captions and supporting lines remain malformed; requested care-copy correction not reliably applied. |
| websites/virel | 4096 × 4096 | 39.9902% | Geometry failure: FAL returned a square sheet instead of the supplied 5:3 sheet. Page proportions changed substantially; copy and product consistency also remain incorrect. Unaltered raw result retained for review. |
| mobile/kindrednote | 4544 × 3748 | 0.0053% | Ten equal screens retained. Morgan still changes from adult to child; onboarding step 3 is mislabeled, and schedule times/copy changed incorrectly. Not state-accurate. |
| mobile/emberrest | 4544 × 3748 | 0.0053% | Ten screens retained. Onboarding step 2 is mislabeled; the Tonight breathing duration conflicts with the 15-minute total; audio progress remains short of the requested 25%. Tab icons also vary. |
| mobile/spriglet | 4544 × 3776 | 0.7363% | Authorized retry returned ten screens at 4544 × 3776; overall ratio differs by 0.7363%. The botanical aesthetic and main screen structure remain. Onboarding labels, several supporting lines, the 18 Jun note date (now 12 Jun), and navigation icons are still inaccurate. Not approved for final copy or state accuracy. |
| mobile/florivo | 4544 × 3748 | 0.0053% | Ten screens retained, but the completed puzzle still has only four physical strips while saying “5 of 5 placed.” Tab icons and collection labels remain inconsistent. |
| mobile/dayglint | 4544 × 3748 | 0.0053% | Ten screens retained. Onboarding step 2 is labeled 3/4; sunset values disagree, and the hourly screen adds inconsistent duplicate metric rows. Not state-accurate. |
| mobile/evenfall | 4544 × 3748 | 0.0053% | Ten screens retained. Daylight times/duration and the walking interval became contradictory; onboarding progress and place labels remain inaccurate. |
| components/weather | 9280 × 1856 | 0.0244% | Five cards retain the overall proportions. Weekendly has visibly smeared brand/date lettering and partial temperature occlusion. Several artwork details changed beyond a cleanup. |
| components/people | 8192 × 2048 | 0.0000% | Five contexts and displayed selection totals are preserved. Tablemate's inactive selection controls became faint/missing; Storycircle's trigger still depicts three avatars for two selected readers. |
| components/palette | 3456 × 4936 | 0.0232% | Five trays retain their natural proportions. Reviewed names, five spheres per tray, selected rings and shuffle labels are consistent. This is one of the cleanest results. |
| components/membership | 7104 × 2368 | 0.0244% | Five plan cards, selected plans, prices and CTA names are readable. AtelierPass changed from a cream surface to strong orange; palette intent was restored but this is a visible change from the supplied input. |
| components/usage | 8256 × 2048 | 35.5354% | Geometry failure: overall ratio changed from about 6.25:1 to 4.03:1. New percentage labels were added, units and some counts changed incorrectly, and several labels are corrupted. |
| components/dock | 3648 × 4692 | 0.0365% | Five docks retain their natural proportions. Reviewed four destinations per dock, correct order, unique brands and single active destination. This is one of the cleanest results. |

## Billing

The original 21-request estimate was $3.36. The one authorized retry adds up to $0.16, for a maximum estimated $3.52 across 22 requests. Actual billing is unavailable: the billing-events API returned HTTP 403 for this key. The failed request may be billable; no retry has been assumed free.

## Provenance

All public outputs are exact copies of the downloaded FAL PNG files. Each sheet includes its exact submitted input, cleanup prompt, relative-path metadata, and SHA-256 checksums. Maintained by Jason Festa.
