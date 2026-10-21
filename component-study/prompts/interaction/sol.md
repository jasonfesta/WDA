# Sol / Interaction implementation prompt

WDA / Jason Festa · 21 October 2026

Build the weather card using the [five-state ledger](../../interaction/sol.md), [original artwork](../../references/originals/sol.png) and exact state images linked below. Implement working DOM controls; raster text is a visual reference, not an interactive layer.

## Art direction

Ivory shell, orange satin disc, frosted lower plane, citron selected controls and charcoal type. The disc stays behind the data; labels never become part of a shader.

Inter for data and controls. Preserve the source’s generous temperature scale.

## Screens and transitions

- **01-today / Today · Celsius** — [image](../../images/states/sol/01-today.png). 28°C, Today active, Thu Jun 18 and sunset 20:58.
- **02-fahrenheit / Today · Fahrenheit** — [image](../../images/states/sol/02-fahrenheit.png). 82°F, F active; date, day and sunset unchanged.
- **03-friday / Friday forecast** — [image](../../images/states/sol/03-friday.png). 29°C; Fri Jun 19 and Fri 19 active; sunset 20:59.
- **04-options / Options open** — [image](../../images/states/sol/04-options.png). Weather options popover: Change location, Refresh forecast and Close.
- **05-retry / Stale forecast · Retry** — [image](../../images/states/sol/05-retry.png). Retain Today 28°C; Couldn’t refresh; Last updated 18:00; Retry.

- Sat 20 and Sun 21 follow the same day-selection contract as Friday; their fixture values are 27°C/81°F at 21:00 and 26°C/79°F at 21:01. In Fahrenheit, selecting Friday shows 84°F. Do not reset unit on a date change.
- Change location opens a labelled search field. Empty input shows no results; pending search exposes loading; zero results offers edit; Arrow keys select and Enter commits a result. Escape/cancel keeps Lisbon. New-location failure retains labelled old data and Retry. This supporting host search is documented rather than a sixth image.
- First-load failure has no cached forecast: show an error and Retry, never 0°. Refreshing labels the current data as updating and prevents duplicate requests. Close uses the × control, Escape or outside click.

## State ownership

WeatherCard receives location, forecastByDate, selectedDate, unit, status and onDateChange/onUnitChange/onLocationChange. Canonical temperatures stay in Celsius; formatted labels are derived. Cache is keyed by location and date, not by rendered unit.

Use [fixtures.json](../../data/fixtures.json) for deterministic study data. Replace fixtures with verified host data before production. Derive labels, counts and active treatments from one source of truth. Ignore late responses using request IDs or cancellation. Separate attempted values from confirmed values where saves can fail.

## Controls

- More options: Open or close the location/refresh popover. Options → location search or refresh; cancel preserves current location.
- Celsius: Set unit to C; derive numbers from the canonical Celsius value. 28°C for Today.
- Fahrenheit: Set unit to F using round(C × 9/5 + 32). 82°F for Today; 84°F for Fri 19.
- Today / Fri 19 / Sat 20 / Sun 21: Select a day and update date, condition, temperature and sunset together. Selected day and rendered forecast agree.
- Location search: Search and choose an explicit result; keep old forecast until the new request resolves. A new location or unchanged Lisbon on cancel.
- Retry / Refresh: Retry the forecast request with current location and unit. Success restores data; failure retains a retry action.
- Close weather options: Dismiss the popover without changing location, day or unit. Focus returns to the More button.

Title, helper copy, count, price, divider and artwork are descriptive unless the control inventory assigns an action. Decorative layers use pointer-events:none and aria-hidden. Read-only regions have no hover lift, pointer cursor or tab stop.

## Input and motion

Let text reflow at 200% zoom. Keep every control operable by touch and keyboard, with a minimum 44 × 44 CSS-pixel hit area as a WDA design target. Preserve the component’s natural aspect ratio in raster review; the implementation reflows content rather than scaling text to fit.

Use a visible 2px high-contrast focus ring with 3px offset. Never make hover the only way to discover or activate a control.

Remove translation, rotation, parallax and looping animation. Selection, loading labels and focus remain visible; use an instant swap or an opacity change of at most 100 ms.

Keep the component in normal document flow. Do not hijack scrolling or drive selected values from scroll position. Pause optional decorative motion while offscreen.

The review explorer describes behavior; it does not send requests or store user data. Production persistence belongs to the host application and must reconcile pending/error states.

On a committed day change, crossfade the condition illustration in 180 ms. A future satin sun shader may shift its highlight by at most 2% over a slow 12-second cycle while visible. It is decorative, paused offscreen, and completely static for reduced motion. No temperature count-up.

## Acceptance

- 28°C → 82°F; 29°C → 84°F.
- Exactly one day and one unit are selected.
- A stale forecast is labelled with its actual update time.

Read the ledger for the per-control rollover, press, focus, loading, cancel, retry and return behavior. Every supporting overlay has an explicit close route; every external request has pending, error and retry handling. Keep all reference pixels separate from the working UI.

## References

- [Apple — Weather guide](https://support.apple.com/guide/iphone/check-the-weather-iph1ac0b35f/ios) — Sol retains a compact four-day surface, with unit conversion and a separately opened location control.
- [W3C — tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — Sol day selection, Roam plan previews and Kiln reporting periods use one active panel. Focus and selection are tracked separately.
- [Radix — Popover build example](https://www.radix-ui.com/primitives/docs/components/popover) — Use a tested popover primitive for Gather and Sol options, retaining the existing material art and layout.
- [React — choosing state structure](https://react.dev/learn/choosing-the-state-structure) — Derive selected counts, button labels, usage totals and visible panels from stable IDs and shared data.
- [Motion — accessible animation](https://motion.dev/docs/react-accessibility) — Disable object drift, parallax and transform flourishes under reduced motion; keep selection and focus feedback.
