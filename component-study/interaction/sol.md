# Sol / Interaction ledger

WDA / Jason Festa · 21 October 2026

[Visual review](../reviews/sol.html) · [React prompt](../prompts/interaction/sol.md) · [Motion prompt](../prompts/motion/sol.md)

Five rendered states of the same component. Review order is an index; the action paths below define the actual transitions. Supporting loading, data and host-route branches are specified after the images.


<a id="01-today"></a>
## 01-today / Today · Celsius

![Sol: Today · Celsius](../images/states/sol/01-today.png)

[Exact image prompt](../prompts/states/sol/01-today.md) · [Attached visual reference](../references/originals/sol.png)

- **Entry:** Initial successful forecast for Lisbon.
- **Visible:** 28°C, Today active, Thu Jun 18 and sunset 20:58.
- **Exit / return:** Change unit, select a day or open More.

- **Use Fahrenheit** → [02-fahrenheit](#02-fahrenheit). Client-side conversion.
- **Friday forecast** → [03-friday](#03-friday). Update all date-specific fields.
- **Open options** → [04-options](#04-options). Focus the first action.

<a id="02-fahrenheit"></a>
## 02-fahrenheit / Today · Fahrenheit

![Sol: Today · Fahrenheit](../images/states/sol/02-fahrenheit.png)

[Exact image prompt](../prompts/states/sol/02-fahrenheit.md) · [Attached visual reference](../images/states/sol/01-today.png)

- **Entry:** Activate F from Today.
- **Visible:** 82°F, F active; date, day and sunset unchanged.
- **Exit / return:** C returns to 28°C with no request.

- **Use Celsius** → [01-today](#01-today). No network request.

<a id="03-friday"></a>
## 03-friday / Friday forecast

![Sol: Friday forecast](../images/states/sol/03-friday.png)

[Exact image prompt](../prompts/states/sol/03-friday.md) · [Attached visual reference](../images/states/sol/01-today.png)

- **Entry:** Activate Fri 19 from the Celsius baseline.
- **Visible:** 29°C; Fri Jun 19 and Fri 19 active; sunset 20:59.
- **Exit / return:** Today restores its date, temperature and sunset.

- **Return to Today** → [01-today](#01-today). Restore Today data.

<a id="04-options"></a>
## 04-options / Options open

![Sol: Options open](../images/states/sol/04-options.png)

[Exact image prompt](../prompts/states/sol/04-options.md) · [Attached visual reference](../images/states/sol/01-today.png)

- **Entry:** Activate the three-dot More button.
- **Visible:** Weather options popover: Change location, Refresh forecast and Close.
- **Exit / return:** Close/Escape restores focus; Refresh either succeeds or enters the retry state.

- **Close options** → [01-today](#01-today). Return focus to More.
- **Refresh fails** → [05-retry](#05-retry). Simulated failure with cached data.

<a id="05-retry"></a>
## 05-retry / Stale forecast · Retry

![Sol: Stale forecast · Retry](../images/states/sol/05-retry.png)

[Exact image prompt](../prompts/states/sol/05-retry.md) · [Attached visual reference](../images/states/sol/01-today.png)

- **Entry:** Refresh fails with a cached forecast.
- **Visible:** Retain Today 28°C; Couldn’t refresh; Last updated 18:00; Retry.
- **Exit / return:** Retry success restores Today; repeated failure keeps a usable retry action.

- **Retry succeeds** → [01-today](#01-today). Replace cache only after success.
- **Retry fails** → [05-retry](#05-retry). Keep timestamp and error.

## Every control

### sol-more / More options

Scope: original · 1 element instances

- **Activation:** Open or close the location/refresh popover.
- **Rollover:** Lighten the circular hit area; do not animate the sun.
- **Touch / press:** Use the same action on tap; no hover prerequisite. Press feedback lasts 90 ms and never delays the state update.
- **Keyboard / focus:** Enter/Space opens; Escape closes and returns focus.
- **Result / return:** Options → location search or refresh; cancel preserves current location.

Related images: [04-options](#04-options).

### sol-unit-c / Celsius

Scope: original · 1 element instances

- **Activation:** Set unit to C; derive numbers from the canonical Celsius value.
- **Rollover:** Tint the unit capsule; active C stays selected until activation.
- **Touch / press:** Use the same action on tap; no hover prerequisite. Press feedback lasts 90 ms and never delays the state update.
- **Keyboard / focus:** Radio-group arrows or Space; selection has an accessible label.
- **Result / return:** 28°C for Today.

Related images: [01-today](#01-today).

### sol-unit-f / Fahrenheit

Scope: original · 1 element instances

- **Activation:** Set unit to F using round(C × 9/5 + 32).
- **Rollover:** Tint the unit capsule without previewing false values.
- **Touch / press:** Use the same action on tap; no hover prerequisite. Press feedback lasts 90 ms and never delays the state update.
- **Keyboard / focus:** Radio-group arrows or Space.
- **Result / return:** 82°F for Today; 84°F for Fri 19.

Related images: [02-fahrenheit](#02-fahrenheit).

### sol-days / Today / Fri 19 / Sat 20 / Sun 21

Scope: original · 4 element instances

- **Activation:** Select a day and update date, condition, temperature and sunset together.
- **Rollover:** Subtle citron hover; selected fill remains distinct.
- **Touch / press:** Use the same action on tap; no hover prerequisite. Press feedback lasts 90 ms and never delays the state update.
- **Keyboard / focus:** Tab into active tab; arrows move focus, Enter/Space selects.
- **Result / return:** Selected day and rendered forecast agree.

Related images: [01-today](#01-today), [03-friday](#03-friday).

### sol-location / Location search

Scope: proposed supporting control · 1 element instances

- **Activation:** Search and choose an explicit result; keep old forecast until the new request resolves.
- **Rollover:** Highlight results; do not request geolocation on hover.
- **Touch / press:** Use the same action on tap; no hover prerequisite. Press feedback lasts 90 ms and never delays the state update.
- **Keyboard / focus:** Label the field; arrows browse results; Escape cancels.
- **Result / return:** A new location or unchanged Lisbon on cancel.

Related images: [04-options](#04-options).

### sol-retry / Retry / Refresh

Scope: proposed supporting control · 1 element instances

- **Activation:** Retry the forecast request with current location and unit.
- **Rollover:** Raise contrast; suppress duplicate activation while pending.
- **Touch / press:** Use the same action on tap; no hover prerequisite. Press feedback lasts 90 ms and never delays the state update.
- **Keyboard / focus:** Enter/Space; announce loading and final status politely.
- **Result / return:** Success restores data; failure retains a retry action.

Related images: [04-options](#04-options), [05-retry](#05-retry).

### sol-close / Close weather options

Scope: state control · 1 element instances

- **Activation:** Dismiss the popover without changing location, day or unit.
- **Rollover:** Increase contrast without committing a value. Use the same visible affordance for keyboard focus.
- **Touch / press:** Tap performs the same action. Show brief press feedback; prevent duplicate in-flight actions.
- **Keyboard / focus:** Enter/Space activates. Escape dismisses an open overlay and restores focus to its trigger.
- **Result / return:** Focus returns to the More button.

Related images: [01-today](#01-today), [04-options](#04-options).

## Descriptive regions

Title, helper copy, count, price, divider and artwork are descriptive unless the control inventory assigns an action. Decorative layers use pointer-events:none and aria-hidden. Read-only regions have no hover lift, pointer cursor or tab stop.

## Supporting branches and all return paths

- Sat 20 and Sun 21 follow the same day-selection contract as Friday; their fixture values are 27°C/81°F at 21:00 and 26°C/79°F at 21:01. In Fahrenheit, selecting Friday shows 84°F. Do not reset unit on a date change.
- Change location opens a labelled search field. Empty input shows no results; pending search exposes loading; zero results offers edit; Arrow keys select and Enter commits a result. Escape/cancel keeps Lisbon. New-location failure retains labelled old data and Retry. This supporting host search is documented rather than a sixth image.
- First-load failure has no cached forecast: show an error and Retry, never 0°. Refreshing labels the current data as updating and prevents duplicate requests. Close uses the × control, Escape or outside click.

## Rollover, motion and extraction

On a committed day change, crossfade the condition illustration in 180 ms. A future satin sun shader may shift its highlight by at most 2% over a slow 12-second cycle while visible. It is decorative, paused offscreen, and completely static for reduced motion. No temperature count-up.

Extract or recreate the orange sun disc, a separate frosted plane and a static fallback. Deliver transparent artwork without any text, tabs, icon labels or shadows that cross the component edge. Keep one stable camera and lighting direction. A bitmap cannot yield a true 3D mesh; reconstruct if a 3D material is required.

## Scroll, touch and accessibility

Let text reflow at 200% zoom. Keep every control operable by touch and keyboard, with a minimum 44 × 44 CSS-pixel hit area as a WDA design target. Preserve the component’s natural aspect ratio in raster review; the implementation reflows content rather than scaling text to fit.

Use a visible 2px high-contrast focus ring with 3px offset. Never make hover the only way to discover or activate a control.

Remove translation, rotation, parallax and looping animation. Selection, loading labels and focus remain visible; use an instant swap or an opacity change of at most 100 ms.

Keep the component in normal document flow. Do not hijack scrolling or drive selected values from scroll position. Pause optional decorative motion while offscreen.

The review explorer describes behavior; it does not send requests or store user data. Production persistence belongs to the host application and must reconcile pending/error states.

## React translation

WeatherCard receives location, forecastByDate, selectedDate, unit, status and onDateChange/onUnitChange/onLocationChange. Canonical temperatures stay in Celsius; formatted labels are derived. Cache is keyed by location and date, not by rendered unit.

- 28°C → 82°F; 29°C → 84°F.
- Exactly one day and one unit are selected.
- A stale forecast is labelled with its actual update time.

## Alternative layout

Compact horizontal forecast: move the sun to a narrow leading area, keep four dates visible and preserve all unit/location controls. This is a layout proposal, not an additional exported screen.

## Build references

- [Apple — Weather guide](https://support.apple.com/guide/iphone/check-the-weather-iph1ac0b35f/ios) — Sol retains a compact four-day surface, with unit conversion and a separately opened location control.
- [W3C — tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — Sol day selection, Roam plan previews and Kiln reporting periods use one active panel. Focus and selection are tracked separately.
- [Radix — Popover build example](https://www.radix-ui.com/primitives/docs/components/popover) — Use a tested popover primitive for Gather and Sol options, retaining the existing material art and layout.
- [React — choosing state structure](https://react.dev/learn/choosing-the-state-structure) — Derive selected counts, button labels, usage totals and visible panels from stable IDs and shared data.
- [Motion — accessible animation](https://motion.dev/docs/react-accessibility) — Disable object drift, parallax and transform flourishes under reduced motion; keep selection and focus feedback.
