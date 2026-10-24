# Sol · Weather card — full interaction specification

24 October 2026 · Version 3.2 · 8 control groups · 20 rendered states

[Readable guide](INTERACTIONS.html) · [Visual review](README.md) · [Structured specification](interactions.json)

A compact forecast with explicit location, units, day selection and freshness.

These are detailed implementation requirements for the six static studies. All 93 planned PNG/SVG states are mapped below. Generic hover/press combinations, every data permutation and additional host-only failure branches are specified in text rather than claimed as extra rendered images. No production behavior is implemented by this document.

## Initial fixture

Lisbon; Thursday 18 June 2026; Today selected; Celsius; temperatures 28, 29, 27, 26; Sunny; sunset 20:58; updated 18:00.

## Every control

### City / location trigger

Control ID: `sol.location`

- **Semantics:** Button, expanded state, controls a labelled nonmodal search panel
- **Click / tap:** Open the location panel. A second activation closes it.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract; Escape dismisses the open panel.
- **Pending / disabled:** Enabled with cached weather and during initial loading/error; opening it does not start a geolocation request.
- **Result:** Open an empty city search; focus its input.
- **Return / dismiss:** Close/Cancel/Escape returns focus to the city trigger. Outside click closes without stealing focus from the clicked target.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

### Celsius / Fahrenheit

Control ID: `sol.units`

- **Semantics:** Radio group labelled Temperature units
- **Click / tap:** Choose the unit and recompute all visible temperatures from Celsius.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Radio contract: arrows select; Space checks.
- **Pending / disabled:** Available with unknown weather; em dashes stay em dashes. No network dependency.
- **Result:** Selected unit changes immediately; day, city, condition and sunset stay unchanged.
- **Return / dismiss:** The other unit reverses the conversion; do not convert from previously rounded Fahrenheit.
- **Announcement:** Expose Celsius/Fahrenheit as full accessible names and checked state.

### Today / Fri 19 / Sat 20 / Sun 21

Control ID: `sol.days`

- **Semantics:** Manual tabs labelled Forecast day
- **Click / tap:** Select a day; update date, temperature, condition and sunset together.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Manual-tab contract. Home/End move focus to first/last day.
- **Pending / disabled:** Keep available while refreshing cached data. During initial unknown data, selection may change the date but numeric fields stay unknown.
- **Result:** Only one day has selected fill/underline. The focused day may differ.
- **Return / dismiss:** Selecting Today returns to its forecast while preserving unit.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

### Refresh / forecast Retry

Control ID: `sol.refresh`

- **Semantics:** Button labelled Refresh forecast or Retry forecast
- **Click / tap:** Fetch the committed location again.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract.
- **Pending / disabled:** Ignore repeat activation while pending; keep the busy target focusable with aria-disabled and suppress its handler.
- **Result:** Cached data remains during refreshing; success updates data and timestamp, failure exposes one Retry.
- **Return / dismiss:** Retry repeats the same request; it never changes city, day or unit.
- **Announcement:** Announce Refreshing forecast, then Forecast updated or Couldn’t refresh.

### Search city field

Control ID: `sol.city-search`

- **Semantics:** Labelled editable combobox with result list
- **Click / tap:** Type a city; show results only for the current query.
- **Hover:** Hover only changes input border; no query starts until input changes.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Combobox contract. Native text editing is preserved; Enter chooses only the highlighted result.
- **Pending / disabled:** Editable while searching; editing invalidates prior results. During candidate forecast loading, show the pending panel until success/cancel.
- **Result:** Empty query → helper; Porto → searching/results; Portoo → no matches.
- **Return / dismiss:** Clear the text to return to the empty helper. Escape closes the panel and leaves committed weather unchanged.
- **Announcement:** Announce result count or no matches after the response, not on every keystroke.

### City result row

Control ID: `sol.city-result`

- **Semantics:** Combobox option with city and country
- **Click / tap:** Choose the explicit location ID represented by the result.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Combobox contract; Enter commits the highlighted candidate to a request.
- **Pending / disabled:** One candidate forecast request at a time. The old city remains visible while pending.
- **Result:** Start loading Porto; only success commits Porto and closes the panel.
- **Return / dismiss:** Failure stays in the panel with Retry and Cancel.
- **Announcement:** Announce Loading Porto forecast, then Porto forecast loaded or Couldn’t load Porto.

### Location Retry

Control ID: `sol.city-retry`

- **Semantics:** Button
- **Click / tap:** Retry the failed candidate forecast; retain saved Lisbon in the background.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract.
- **Pending / disabled:** Suppressed while retry is running.
- **Result:** Success commits candidate; another failure keeps the same candidate and error.
- **Return / dismiss:** Cancel returns to committed city without changing its weather.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

### Close × / Cancel

Control ID: `sol.city-dismiss`

- **Semantics:** Buttons; close icon named Close location search
- **Click / tap:** Dismiss search or candidate loading and invalidate that request.
- **Hover:** Use the neutral surface tint and stronger label contrast. Hover never commits a selection or starts a request.
- **Press / touch:** Activate once on release inside the target; dragging out cancels. Use a brief darker surface, with no scale or layout shift. Touch uses the same action without requiring hover.
- **Keyboard:** Button contract plus Escape.
- **Pending / disabled:** Available during search and forecast loading.
- **Result:** No unit, day, location or forecast change.
- **Return / dismiss:** Restore focus to the city trigger. This is not an undo of an already successful location change.
- **Announcement:** The accessible name and state expose the result; do not duplicate it with a toast.

## State transitions

### Weather card · default

`sol-v2-default` · [View state](images/sol-v2-default.png) · [Data](state-data/sol-v2-default.json)

- **Entry:** Load the committed Lisbon forecast or activate the shown day/unit.
- **Exit / return:** Change unit/day, open location search, or refresh. Selecting Today in Celsius returns to default.
- **Focus:** Keep focus on the activated unit/day control; do not move it to the temperature.
- **Data / guard:** Selected day index 0; C; temperatures [28, 29, 27, 26]; sunset 20:58.

### Today in Fahrenheit

`sol-v2-fahrenheit` · [View state](images/sol-v2-fahrenheit.png) · [Data](state-data/sol-v2-fahrenheit.json)

- **Entry:** Load the committed Lisbon forecast or activate the shown day/unit.
- **Exit / return:** Change unit/day, open location search, or refresh. Selecting Today in Celsius returns to default.
- **Focus:** Keep focus on the activated unit/day control; do not move it to the temperature.
- **Data / guard:** Selected day index 0; F; temperatures [82, 84, 81, 79]; sunset 20:58.

### Friday forecast

`sol-v2-friday` · [View state](images/sol-v2-friday.png) · [Data](state-data/sol-v2-friday.json)

- **Entry:** Load the committed Lisbon forecast or activate the shown day/unit.
- **Exit / return:** Change unit/day, open location search, or refresh. Selecting Today in Celsius returns to default.
- **Focus:** Keep focus on the activated unit/day control; do not move it to the temperature.
- **Data / guard:** Selected day index 1; C; temperatures [28, 29, 27, 26]; sunset 20:59.

### Friday in Fahrenheit

`sol-v2-friday-fahrenheit` · [View state](images/sol-v2-friday-fahrenheit.png) · [Data](state-data/sol-v2-friday-fahrenheit.json)

- **Entry:** Load the committed Lisbon forecast or activate the shown day/unit.
- **Exit / return:** Change unit/day, open location search, or refresh. Selecting Today in Celsius returns to default.
- **Focus:** Keep focus on the activated unit/day control; do not move it to the temperature.
- **Data / guard:** Selected day index 1; F; temperatures [82, 84, 81, 79]; sunset 20:59.

### Saturday forecast

`sol-v2-saturday` · [View state](images/sol-v2-saturday.png) · [Data](state-data/sol-v2-saturday.json)

- **Entry:** Load the committed Lisbon forecast or activate the shown day/unit.
- **Exit / return:** Change unit/day, open location search, or refresh. Selecting Today in Celsius returns to default.
- **Focus:** Keep focus on the activated unit/day control; do not move it to the temperature.
- **Data / guard:** Selected day index 2; C; temperatures [28, 29, 27, 26]; sunset 21:00.

### Saturday in Fahrenheit

`sol-v2-saturday-fahrenheit` · [View state](images/sol-v2-saturday-fahrenheit.png) · [Data](state-data/sol-v2-saturday-fahrenheit.json)

- **Entry:** Load the committed Lisbon forecast or activate the shown day/unit.
- **Exit / return:** Change unit/day, open location search, or refresh. Selecting Today in Celsius returns to default.
- **Focus:** Keep focus on the activated unit/day control; do not move it to the temperature.
- **Data / guard:** Selected day index 2; F; temperatures [82, 84, 81, 79]; sunset 21:00.

### Sunday forecast

`sol-v2-sunday` · [View state](images/sol-v2-sunday.png) · [Data](state-data/sol-v2-sunday.json)

- **Entry:** Load the committed Lisbon forecast or activate the shown day/unit.
- **Exit / return:** Change unit/day, open location search, or refresh. Selecting Today in Celsius returns to default.
- **Focus:** Keep focus on the activated unit/day control; do not move it to the temperature.
- **Data / guard:** Selected day index 3; C; temperatures [28, 29, 27, 26]; sunset 21:01.

### Sunday in Fahrenheit

`sol-v2-sunday-fahrenheit` · [View state](images/sol-v2-sunday-fahrenheit.png) · [Data](state-data/sol-v2-sunday-fahrenheit.json)

- **Entry:** Load the committed Lisbon forecast or activate the shown day/unit.
- **Exit / return:** Change unit/day, open location search, or refresh. Selecting Today in Celsius returns to default.
- **Focus:** Keep focus on the activated unit/day control; do not move it to the temperature.
- **Data / guard:** Selected day index 3; F; temperatures [82, 84, 81, 79]; sunset 21:01.

### Refreshing cached forecast

`sol-v2-refreshing` · [View state](images/sol-v2-refreshing.png) · [Data](state-data/sol-v2-refreshing.json)

- **Entry:** Activate Refresh with a saved forecast.
- **Exit / return:** Success → committed forecast; failure → refresh-error.
- **Focus:** Keep existing focus; announce the outcome. If Retry disappears after success, focus the stable refresh control.
- **Data / guard:** Cached weather stays unchanged during refresh. Initial unknown data is rendered as em dashes.

### Refresh failed with cached data

`sol-v2-refresh-error` · [View state](images/sol-v2-refresh-error.png) · [Data](state-data/sol-v2-refresh-error.json)

- **Entry:** The refresh request fails while saved weather exists.
- **Exit / return:** Retry → refreshing; success → committed forecast.
- **Focus:** Keep existing focus; announce the outcome. If Retry disappears after success, focus the stable refresh control.
- **Data / guard:** Cached weather stays unchanged during refresh. Initial unknown data is rendered as em dashes.

### First forecast loading

`sol-v2-first-loading` · [View state](images/sol-v2-first-loading.png) · [Data](state-data/sol-v2-first-loading.json)

- **Entry:** Mount with no forecast cache.
- **Exit / return:** Success → default (or host-selected location); failure → first-error.
- **Focus:** Keep existing focus; announce the outcome. If Retry disappears after success, focus the stable refresh control.
- **Data / guard:** Cached weather stays unchanged during refresh. Initial unknown data is rendered as em dashes.

### First forecast unavailable

`sol-v2-first-error` · [View state](images/sol-v2-first-error.png) · [Data](state-data/sol-v2-first-error.json)

- **Entry:** The initial forecast request fails with no cache.
- **Exit / return:** Retry → first-loading; city selection may request another location.
- **Focus:** Keep existing focus; announce the outcome. If Retry disappears after success, focus the stable refresh control.
- **Data / guard:** Cached weather stays unchanged during refresh. Initial unknown data is rendered as em dashes.

### Location search empty

`sol-v2-location-search` · [View state](images/sol-v2-location-search.png) · [Data](state-data/sol-v2-location-search.json)

- **Entry:** Open the city trigger.
- **Exit / return:** Type → location-searching; dismiss → committed forecast.
- **Focus:** Search input.
- **Data / guard:** Lisbon remains committed until a matching candidate forecast succeeds.

### Searching locations

`sol-v2-location-searching` · [View state](images/sol-v2-location-searching.png) · [Data](state-data/sol-v2-location-searching.json)

- **Entry:** Type Porto and the query request is pending.
- **Exit / return:** Results → location-results; none → location-empty; edit → new query; dismiss → committed forecast.
- **Focus:** Search input; never focus the loading message.
- **Data / guard:** Lisbon remains committed until a matching candidate forecast succeeds.

### No locations found

`sol-v2-location-empty` · [View state](images/sol-v2-location-empty.png) · [Data](state-data/sol-v2-location-empty.json)

- **Entry:** Query Portoo resolves with no matches.
- **Exit / return:** Edit query → location-searching; clear → location-search; dismiss → committed forecast.
- **Focus:** Search input.
- **Data / guard:** Lisbon remains committed until a matching candidate forecast succeeds.

### Location results

`sol-v2-location-results` · [View state](images/sol-v2-location-results.png) · [Data](state-data/sol-v2-location-results.json)

- **Entry:** Current Porto query resolves with a matching result.
- **Exit / return:** Choose Porto → location-loading; edit query → location-searching; dismiss → committed forecast.
- **Focus:** Input with Porto as active descendant; pointer activation is also allowed.
- **Data / guard:** Lisbon remains committed until a matching candidate forecast succeeds.

### New location loading

`sol-v2-location-loading` · [View state](images/sol-v2-location-loading.png) · [Data](state-data/sol-v2-location-loading.json)

- **Entry:** Activate Porto result.
- **Exit / return:** Success → porto; failure → location-error; cancel → committed Lisbon.
- **Focus:** Focus Cancel when results are replaced; announce loading.
- **Data / guard:** Lisbon remains committed until a matching candidate forecast succeeds.

### New location failed

`sol-v2-location-error` · [View state](images/sol-v2-location-error.png) · [Data](state-data/sol-v2-location-error.json)

- **Entry:** Candidate Porto forecast fails.
- **Exit / return:** Retry → location-loading; Cancel/close/Escape → committed Lisbon.
- **Focus:** Keep current focus if it survives; otherwise focus Retry, without trapping the nonmodal panel.
- **Data / guard:** Lisbon remains committed until a matching candidate forecast succeeds.

### Porto forecast committed

`sol-v2-porto` · [View state](images/sol-v2-porto.png) · [Data](state-data/sol-v2-porto.json)

- **Entry:** Porto forecast request succeeds for the current candidate.
- **Exit / return:** Refresh Porto, change day/unit, or open search for another city.
- **Focus:** Restore focus to the city trigger.
- **Data / guard:** Commit 23/24/22/21°C, sunset 21:04 and updated 18:05 together.

### Day focus without selection

`sol-v2-focus` · [View state](images/sol-v2-focus.png) · [Data](state-data/sol-v2-focus.json)

- **Entry:** Move day-tab focus from Today to Friday without activation.
- **Exit / return:** Enter/Space → friday; arrow away → focus another day; Tab leaves Today selected.
- **Focus:** Keep focus on the activated unit/day control; do not move it to the temperature.
- **Data / guard:** Today remains selected; this is not Friday data.

## Read-only content

The sun, condition, sunset and updated timestamp are read-only. The card shell has no click action. Only the city, units, days and explicit refresh/retry/search controls respond.

## State model

- committedLocation: stable location ID and display name
- forecastByDay: date, canonical Celsius, condition and sunset for four days
- unit: C or F; selectedDay: one of the four date IDs
- forecastStatus: initialLoading, ready, refreshing, initialError or refreshError
- locationPanel: closed, empty, searching, results, noResults, loadingForecast or error
- query, candidateLocation, latestSearchRequestId, latestForecastRequestId, updatedAt

## Persistence

- Unit and selected day survive popover dismissal and refresh. Keep unit when committing another city; preserve the date if available, otherwise select Today.
- Only a successful forecast replaces committed location, forecast and updatedAt together. Closing location search discards query/candidate, never committed weather.
- The host may persist unit and last successful location. Query, focus, pending requests and error messages are session state.

Stable IDs, not visible labels, identify people, materials, cities, plans and routes. Async callbacks carry a request/version ID and cannot apply after cancellation, replacement or unmount. Server acknowledgements govern persistence and purchases. The per-state JSON fixtures are example inputs, not a backend schema.

## Async and edge cases

- Debounce nonempty city queries by 250 ms; trim whitespace and do not send empty queries. Ignore results for older queries. A query-service failure keeps the input editable and shows a textual retry message; this branch is specified but has no separate PNG.
- Cancel or close invalidates the candidate request. Late responses must not switch the city. Refresh requests are deduplicated per committed location.
- A failed refresh retains all cached values and the real last-update time. First-load failure shows em dashes; it must not imply 0°C or a successful timestamp.

## Keyboard, pointer and feedback contracts

### Buttons

Use a semantic button. Enter or Space activates once; suppress duplicate pending actions. Focus is visible immediately. Keep a pending focused control in the tab order with aria-disabled when disabling it would lose focus; the handler must also prevent activation.

### Manual tabs

Tab enters at the selected tab. Left/Right and Home/End move focus without activation; Enter/Space commits. Arrow navigation wraps. The active tab and associated panel are labelled together; focus and selection are separate.

### Radios

Tab enters at the checked radio. Arrow keys move and select; Space checks the focused item. Only one option is checked. Use native radios where possible. Unit and material controls use this pattern; plan/day/period controls use manual tabs.

### Combobox

Keep text-editing focus in the input; Up/Down changes the active suggestion and Enter chooses it. Expose expanded state, controlled list and active option. Typed arbitrary text never becomes a committed city. Escape closes the location panel.

### Modal dialogs

Give the modal a heading and accessible name. On entry focus that heading when context needs reading; keep Tab/Shift+Tab inside. Background is inert. Escape, close or explicit Back dismisses and restores the recorded trigger. Backdrop clicks do not dismiss in this study.

### Nonmodal panels

Sol search and Gather picker do not trap focus. Escape and explicit dismissal return to the trigger. Pointer outside closes and allows the clicked target to receive focus. Keyboard focus leaving the panel closes it after the move, without redirecting focus.

### Links

Use real hrefs. Enter follows; modifier clicks and browser history retain native behavior. Do not make navigation links into radio controls. Use aria-current only for the committed route.

### Hover

120 ms background/colour transition. Use neutral tint for unselected items; selected fill stays distinct. Do not reveal essential information only on hover.

### Press

Apply immediate darker surface while held; return within 90 ms on release. No scale, bounce or layout displacement. Pointer cancellation does not activate.

### Focus

2 px burgundy outline with 2 px offset, not a duplicate selected fill. Never remove focus styles. Keep logical DOM order; no positive tabindex.

### Loading

Show progress immediately and preserve known data. A spinner may rotate at a steady 800 ms cycle; it is decorative and not the only loading indicator. No minimum artificial wait or fabricated progress percentage.

### Overlays

Open with a 120 ms opacity transition; close in 90 ms. Focus behavior runs immediately, independent of animation completion. No spring or perspective transforms.

### Reduced motion

Disable decorative rotation and overlay/colour interpolation; show the final state immediately. Text status and visible focus remain.

### Errors and announcements

Use one polite live region for async status. Keep an actionable error until retry, dismissal or a successful superseding action. Do not move focus merely to announce it. A disappearing focused recovery control returns to its stable trigger.

### Touch and targets

Target at least 44 × 44 CSS px where space permits, even when the icon is smaller; keep target areas from overlapping. Tap duplicates pointer activation, never hover. Keep browser zoom and text selection enabled.

## Responsive layout

- Native study: 440 × 344. On narrow screens use full available width, retain four equal day targets and place location search within viewport padding.
- Keep four-day labels together. Truncate a long city name visually with its full accessible name; do not truncate the condition or error action.
- The sun is decorative. Its size and position do not change on hover, unit conversion or refresh.

These are implementation requirements; additional responsive component exports are not included.

## Acceptance checks for future implementation

- Switch to Friday, then Fahrenheit: Friday remains current; main value is 84°, four-day values are 82/84/81/79.
- Start Porto, then cancel before response: Lisbon remains committed even if Porto resolves later.
- Fail refresh with cache: weather stays visible and Retry is the only recovery action in the footer.
- Tab to Friday while Today is selected: focus is visible, Today remains selected until activation.

## Primary references

Checked 24 October 2026. Timings and product behavior are study-specific decisions.

- [WAI-ARIA APG: Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [WAI-ARIA APG: Radio group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [WAI-ARIA APG: Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [WAI-ARIA APG: Modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

## Final audit clarifications

These rules clarify exceptional transitions without adding rendered image states. They take precedence where the earlier general rule needs a narrower condition.

- Query-service failure is separate from a failed candidate forecast. Keep the query editable; show “Couldn’t search locations” and Retry in the existing search panel. Retry repeats the current trimmed query; editing clears the error and starts the normal 250 ms debounce. Close, Cancel, Escape and outside dismissal retain the committed location. Keep input focus; announce the error once. This exceptional branch has no separate PNG.

- A malformed forecast (missing dates, non-finite temperatures or unusable location ID) follows the existing initial-error, refresh-error or location-error contract according to its request context. Commit no partial location/forecast data. A response arriving after dismissal, changed query or unmount has no visible effect.

[Rebuild reference](../REBUILD.md) · [Coverage and audit](../AUDIT.md)
