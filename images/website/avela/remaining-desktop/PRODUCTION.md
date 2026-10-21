# AVELA remaining desktop pages — production contract

Jason Festa / WDA · 21 October 2026

This round is desktop image generation only. User requested native 1K quality, immediate review of finished pages, and no change to approved headers, footers or identity. Use the built-in image generator. No HTML, CSS, app code, SVG-rendered design or stock template reconstruction. User already permits proportionate assembly of generated image sections and approved artwork.

## Authoritative reference order

1. `homepage-study/images/desktop/01-avela.png`: original approved identity, warm cream, oxblood serif, silhouettes, newsletter/footer.
2. `images/website/avela/desktop/care-and-repair.png`: approved interior typography and cream header.
3. `images/website/avela/desktop/our-workshop.png`: approved editorial composition.
4. `images/website/avela/desktop/bags.png`: approved merchandise/prices.

Earlier `avela-study/specs` and `round-2` files provide research leads only. Their revised footers, extra legal links, workshop bookings and world landing page are superseded. Never copy those layouts or route plans over the approved images.

## Shared artwork and assembly

Root owns final assembly and display. Generate BODY ONLY, with no header, nav, newsletter or footer. Top and bottom end on uninterrupted pale cream with 32 logical pixels breathing room. Do not repeat AVELA branding inside the body unless a contextual product label requires it.

Root prepends `shared/header-empty-bag.png` and appends `shared/footer.png` proportionately. Header is exact approved interior-header text plus an existing blank cream strip, omitting its page-specific Care underline. Footer is the exact original desktop homepage artwork. Commerce pages with an item use a root-supplied Bag (1) header variant. Receipt resets count to 0. A newsletter is unnecessary on short transactional/legal pages; editorial pages may use the existing `../shared/home-newsletter-footer-desktop.png` instead of footer-only.

## Design constraints

- Native output width at least 1024 px. Aim for 1536 × 1024 or 1536 × 1536. Avoid tall body aspect ratios that sacrifice native width. If a page truly needs two sections, generate two with matching scale rather than making text unreadable.
- Real desktop composition at approximately 1440 logical px: generous 55–64 px gutters, readable body and labels, short lines, existing elegant serif headings, restrained small labels and quiet underlined links.
- Cream `#FBF5E6`, oxblood `#601F29`, original warm photography; open space, fine rules. No new brand palette, ornamental cards, boxed content, icons for every paragraph or stacks of generic marketing panels.
- Accurate Arc: gathered oxblood crescent, single curved strap, brass connectors, approved $420. Fold: tan angular hobo, $360. Day: olive rounded hobo, $480. No copied competitor dimensions, leather origin, performance, warranties, stock or delivery promises.
- Forms need permanent labels, real affordances and one clear next action. Sample receipts belong to a visual concept and must be marked as sample in the companion; no real personal information, order identifiers or submitted data.
- Legal pages share a compact cream reading layout. Their text is a design specimen, not finalized policy. Research real documents, then track unknown seller/controller, regions, legal basis, service providers and retention in the companion; do not invent them or copy a competitor’s terms.

## Required per page

1. Reopen one live primary companion and record exact URL, observed structure, proposed AVELA translation, section map and interaction notes in `research/<slug>.md`. Brief supporting sources are allowed when genuinely needed. Keep source paraphrases within source word limits.
2. Save the exact complete generation prompt in `prompts/<slug>.txt` before the tool call.
3. Inspect approved local image references with view_image before use. Generate with explicit input roles. Preserve native output as `sources/<slug>-body.png`.
4. Send root a message immediately when each body is ready, with absolute path, native dimensions, primary source, short content note and any issues. Do not display partial bodies, append your own header/footer, or edit another agent’s files.
5. Root assembles the finished page, checks it visually and shows it in the main chat. Git publication remains under Jason Festa only; agents must not commit or push.
