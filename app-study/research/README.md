# App study — research package

Jason Festa / WDA · 21 October 2026

The six original screens establish art direction. Saved WDA research establishes the product categories and earlier flow thinking. Current official product pages and interaction guidance inform the proposed behaviors. No competitor screen is claimed to be a verified live native flow. Mobbin flow search was unavailable because the connected service requires a paid plan; no results from that search are used.

## Saved research

- [Mobile research](archive/mobile-research-2026-10-20.md)
- [Earlier state matrix](archive/mobile-state-plan-2026-10-20.md)
- [Expanded research](archive/expanded-flow-research-2026-10-20.md)

## Current source findings

### Headspace · Sleep

[Primary source](https://www.headspace.com/content/categories/sleep). Checked 21 October 2026.

Sleepcasts, music, soundscapes and wind-down content support separate ritual and audio destinations. The specific routine, timer and navigation below are WDA proposals.

### Planta

[Primary source](https://getplanta.com/). Checked 21 October 2026.

Plant care, plant collections and journals inform a plant-centered structure. The painterly presentation remains Pocket Garden’s original direction.

### Planta · Getting started

[Primary source](https://getplanta.com/discover/getstartedwithplanta). Checked 21 October 2026.

Adding plants to sites, completing or postponing tasks, and keeping plant notes inform setup → garden → care → observation.

### Planta · Custom care

[Primary source](https://getplanta.com/discover/iam/custom/care). Checked 21 October 2026.

Custom tasks can have descriptions and recurrence. Pocket Garden uses an observation before recording care; it does not assume every reminder requires watering.

### Cozi · Feature overview

[Primary source](https://www.cozi.com/feature-overview/). Checked 21 October 2026.

Shared calendars, reminders and lists support a household agenda. Home Note’s invitation, acknowledgement and handover details are proposed here, not copied native flows.

### Apple · Check the weather

[Primary source](https://support.apple.com/guide/iphone/check-the-weather-iph1ac0b35f/ios). Checked 21 October 2026.

Current conditions and forecast detail support a summary-to-detail hierarchy. Soul’s city, preferences and daylight routes are WDA design decisions.

### I Love Hue · Official product page

[Primary source](https://zutgames.com/i-love-hue.php). Checked 21 October 2026.

Calm visual arrangement informs the play loop. Horizontal botanical strips, snapping rules and tap alternatives are Petal-specific proposals.

### Structured

[Primary source](https://structured.app/). Checked 21 October 2026.

A visual timeline and calendar integration inform Daybook’s planning structure. Its daylight landscape and saved places remain original to this study.

### Structured · Create and edit tasks

[Primary source](https://help.structured.app/en/articles/338050). Checked 21 October 2026.

Task creation, date/time/duration editing and saving back into the timeline support an explicit editor. Daybook additionally preserves drafts and derives the duration from start/end.

### Apple · Onboarding

[Primary source](https://developer.apple.com/design/human-interface-guidelines/onboarding). Checked 21 October 2026.

Reference retained from the research plan. Full article could not be read through the text fetch, so no specific behavior is attributed to it. The proposed short setup sequences are WDA decisions.

### W3C · Validating input

[Primary source](https://www.w3.org/WAI/tutorials/forms/validation/). Checked 21 October 2026.

Label required fields and expose accessible validation feedback. Validate on the server as well as the client. Failed saves should keep the user’s draft.

### W3C · Modal dialog pattern

[Primary source](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Checked 21 October 2026.

Modal focus stays inside the dialog; Escape closes it. Restore useful focus on return. Dirty drafts require an explicit discard choice.

### W3C · Dragging movements

[Primary source](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html). Checked 21 October 2026.

Provide a single-pointer alternative to dragging. Petal uses tap a strip, then its target, with keyboard support in addition.

### W3C · Tabs pattern

[Primary source](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/). Checked 21 October 2026.

In-page tabs need matching panels and keyboard behavior. The study’s bottom destinations are route navigation: implement links with aria-current, rather than applying tab semantics to unrelated pages.

### MDN · Reduced motion

[Primary source](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion). Checked 21 October 2026.

Respect the system’s request to reduce nonessential movement. Motion is never the only signal that an action succeeded.

### MDN · Notification permission

[Primary source](https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission_static). Checked 21 October 2026.

Permission can be granted, denied or undecided. Keep reminder state separate from requested permission and retain a usable path after refusal.

## Application to this study

- [Afterglow flow and control ledger](../interaction/afterglow.md)
- [Pocket Garden flow and control ledger](../interaction/pocket-garden.md)
- [Home Note flow and control ledger](../interaction/home-note.md)
- [Soul flow and control ledger](../interaction/soul.md)
- [Petal flow and control ledger](../interaction/petal.md)
- [Daybook flow and control ledger](../interaction/daybook.md)

All detailed app routes, copy, fixtures and motion timings are proposed WDA decisions. Alternative routes are documented for comparison; they are not additional exported screens.
