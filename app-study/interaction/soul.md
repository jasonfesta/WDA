# Soul — flow and interaction review

Jason Festa / WDA · 21 October 2026

Five visual states, with additional routes specified below. These are proposed product behaviors for later implementation; the review images are not functional app screens.

## Direction

Use the requested name Soul for the existing Sol weather concept. Manual city search works without location permission. All three core tabs receive their own image.

Existing Sol weather art direction, new displayed name SOUL: soft clear sky-blue field, tactile orange sun and cream clouds, very large burgundy temperature numerals, airy cream forecast panel, restrained coral line and citron daylight row. Precise legible sans typography. Preserve blue sky rather than turning the whole app beige.

Type: Manrope, DM Sans. Palette: #9ACCDD, #FFF8EC, #F47837, #651B23.

## Reference chain

Original art direction: [saved screen](../references/originals/sol.png). [Original prompt](../prompts/sol.txt). Historical research: [mobile research](../research/archive/mobile-research-2026-10-20.md), [state plan](../research/archive/mobile-state-plan-2026-10-20.md), [expanded flow research](../research/archive/expanded-flow-research-2026-10-20.md).

Current product and interaction references were checked on 21 October 2026. Product documentation establishes features, not a hands-on audit of each native screen.

- [Apple · Check the weather](https://support.apple.com/guide/iphone/check-the-weather-iph1ac0b35f/ios) — Current conditions and forecast detail support a summary-to-detail hierarchy. Soul’s city, preferences and daylight routes are WDA design decisions.
- [Apple · Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding) — Reference retained from the research plan. Full article could not be read through the text fetch, so no specific behavior is attributed to it. The proposed short setup sequences are WDA decisions.
- [W3C · Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) — In-page tabs need matching panels and keyboard behavior. The study’s bottom destinations are route navigation: implement links with aria-current, rather than applying tab semantics to unrelated pages.
- [W3C · Validating input](https://www.w3.org/WAI/tutorials/forms/validation/) — Label required fields and expose accessible validation feedback. Validate on the server as well as the client. Failed saves should keep the user’s draft.

## Action flow

01 Find the light in your day → 02 Weather, your way → 03 Bright until dusk → 04 Places you keep an eye on → 05 Make the forecast yours

The sequence shows representative states, not five mandatory steps on every visit. Returning users land on the last valid main destination; completed onboarding is skipped. Tab routes remain available independently of this reading order.

| Destination | Route | Return rule |
| --- | --- | --- |
| Today | `03-today` | Preserve its scroll, selection and draft; active destination does not reload. |
| Places | `04-places` | Preserve its scroll, selection and draft; active destination does not reload. |
| Settings | `05-settings` | Preserve its scroll, selection and draft; active destination does not reload. |

## Fixed review data

Lisbon: 28°, feels like 29°. Hourly 14:00–19:00: 28°, 29°, 28°, 27°, 25°, 24°. Wind 12 km/h; humidity 48%. One saved city, Lisbon. Porto and Faro are suggestions, with illustrative weather values. Units °C / km/h / 24-hour. Reminders off; reduced motion on in the Settings review state.

- Six hourly values match six timestamps and chart direction.
- Porto/Faro are suggestions until Add; saving one yields two saved cities.
- Permission denied retains manual Lisbon and keeps reminders off.
- Unit changes reformat all values from canonical data, including feels-like and wind.

## 01 · Find the light in your day

Entry: First launch. Selected destination: none; setup or full-screen editor.

[Screen image](../images/mobile/soul/01-place.png) · [Exact prompt](../prompts/screens/soul/01-place.txt)

Pictured state: Brand SOUL, soft sky blue filling canvas and a tactile orange sun/cloud vignette. Title "Find the light in your day". Body "Weather and daylight, in one calm view." Search field label "Choose a city", value "Lisbon". Selected result "Lisbon, Portugal" with check. Primary "Use Lisbon". Secondary "Use my location". Marker "1 / 2". No bottom tabs. Porto and Faro appear as unselected alternatives.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `soul.01.01` · Choose a city | Type/search then select | Debounced search with loading/no results/error; keyboard result list, explicit selection. Route: `self`. | Accessible combobox/listbox, clear action, arrow navigation, Enter select, Escape close. Distinguish query from selected record ID. |
| `soul.01.02` · Lisbon / Porto / Faro result | Tap/click or Enter | Set draft city ID and label; do not rely on typed name alone. Route: `self`. | Listbox option with aria-selected; selecting updates the draft record ID and visible label. |
| `soul.01.03` · Use Lisbon | Tap/click or form Enter | Save selected city draft and continue; no location permission required. Route: `02-preferences`. | Validate, focus first invalid field, preserve draft; disable duplicate submission while pending. Success commits once; failure offers Retry. |
| `soul.01.04` · Use my location | Tap/click; Enter or Space | Ask only on tap; denied/timeout returns to city search with explanation. Route: `aux:location-permission`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 02 · Weather, your way

Entry: Use Lisbon. Selected destination: none; setup or full-screen editor.

[Screen image](../images/mobile/soul/02-preferences.png) · [Exact prompt](../prompts/screens/soul/02-preferences.txt)

Pictured state: SOUL; Back arrow; "2 / 2". Sky blue upper field, cream content. Title "Weather, your way". Small "Lisbon, Portugal". Units segmented choice "°C" selected / "°F". Wind choice "km/h" selected / "mph". Time choice "24-hour" selected / "12-hour". Reminder switch "Golden-hour reminder" OFF. Helper "Optional. You can change this later." Primary "See my forecast". No tabs.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `soul.02.01` · Back | Tap/click; Enter or Space | Keep city and preference drafts. Route: `01-place`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `soul.02.02` · Temperature unit | Tap option; arrow keys | Choose °C or °F; store unit separately from raw weather data. Route: `self`. | Native radio group with one selection and a visible legend; selected and focus states are distinct. |
| `soul.02.03` · Wind unit | Tap option; arrow keys | Choose km/h or mph; persist on completion. Route: `self`. | Native radio group with one selection and a visible legend; selected and focus states are distinct. |
| `soul.02.04` · Time format | Tap option; arrow keys | Choose 24-hour or 12-hour; update previews consistently. Route: `self`. | Native radio group with one selection and a visible legend; selected and focus states are distinct. |
| `soul.02.05` · Golden-hour reminder | Tap or Space | Optional, explicit permission; denial leaves off. Route: `aux:notification-permission`. | Native checkbox styled as switch; label and checked state agree. Permission-dependent value stays off until granted. |
| `soul.02.06` · See my forecast | Tap/click or form Enter | Finish setup; fetch forecast with loading state and a retry path. Route: `03-today`. | Validate, focus first invalid field, preserve draft; disable duplicate submission while pending. Success commits once; failure offers Retry. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 03 · Bright until dusk

Entry: See my forecast / Today tab. Selected destination: Today.

[Screen image](../images/mobile/soul/03-today.png) · [Exact prompt](../prompts/screens/soul/03-today.txt)

Pictured state: Match original Sol home strongly, branded SOUL. Blue sky upper half: "Lisbon" dropdown, plus icon. Huge "28°", "Bright until dusk", "Feels like 29°", tactile orange sun and cream cloud. Cream forecast section "The next six hours" with six aligned values/time pairs 28°14:00,29°15:00,28°16:00,27°17:00,25°18:00,24°19:00; coral trend line follows those values. "Wind 12 km/h" and "Humidity 48%". Citron row "Best light · 18:30–20:00". Bottom Today / Places / Settings; ONLY Today active.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `soul.03.01` · Lisbon city selector | Tap/click; Enter or Space | Open saved cities; retain current forecast until new city resolves. Route: `04-places`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `soul.03.02` · Add city plus | Tap/click; Enter or Space | Search then Add creates saved city once and selects it. Route: `aux:city-search`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `soul.03.03` · Hourly point / chart | Tap point; keyboard move | Tap or keyboard select an hour; show exact value and precipitation; no hover-only information. Route: `aux:hour-detail`. | Each data point has an accessible label; text table duplicates data. Pointer hover may preview but does not hide essential information. |
| `soul.03.04` · Wind / Humidity | Tap/click; Enter or Space | Open labeled metric details and source timestamp. Route: `aux:weather-detail`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `soul.03.05` · Best light row | Tap/click; Enter | Show sunrise/sunset and saved reminder control; no permission request on entry. Route: `aux:daylight-detail`. | Route link; announce destination heading after navigation and restore scroll on Back. |
| `soul.03.nav.1` · Today | Tap/click or Enter | Open Today; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `03-today`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `soul.03.nav.2` · Places | Tap/click or Enter | Open Places; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `04-places`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `soul.03.nav.3` · Settings | Tap/click or Enter | Open Settings; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-settings`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 04 · Places you keep an eye on

Entry: Places tab / city selector. Selected destination: Places.

[Screen image](../images/mobile/soul/04-places.png) · [Exact prompt](../prompts/screens/soul/04-places.txt)

Pictured state: SOUL, sky-blue header, heading "Places you keep an eye on". "1 saved place". Large cream row with small orange sun "Lisbon" / "28° · Sunny" and check indicating current city. Search field "Add another city". Below clear label "Suggestions" and rows "Porto, Portugal +" and "Faro, Portugal +". Do not show suggestions as saved places. Bottom Today / Places / Settings; ONLY Places active. Lisbon has an explicit More menu. Suggestions show illustrative 28° Sunny values; these are fixture values, not live forecasts.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `soul.04.01` · Lisbon saved row | Tap/click; Enter or Space | Select saved city and restore Today; cache remains visible while refreshing. Route: `03-today`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `soul.04.02` · Saved-city management | More button; optional swipe | Accessible More action allows reorder/remove; do not rely only on swipe. Route: `aux:manage-city`. | Explicit menu button with expanded state and keyboard navigation. Swipe reveals equivalent actions; it never performs deletion immediately. |
| `soul.04.03` · Add another city | Type/search then select | Search and explicitly add; duplicate selection does not duplicate saved cities. Route: `aux:city-search`. | Accessible combobox/listbox, clear action, arrow navigation, Enter select, Escape close. Distinguish query from selected record ID. |
| `soul.04.04` · Porto / Faro plus | Tap/click; Enter or Space | Add selected suggestion once, update count to 2, move it from Suggestions to Saved. Route: `self`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `soul.04.nav.1` · Today | Tap/click or Enter | Open Today; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `03-today`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `soul.04.nav.2` · Places | Tap/click or Enter | Open Places; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `04-places`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `soul.04.nav.3` · Settings | Tap/click or Enter | Open Settings; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-settings`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## 05 · Make the forecast yours

Entry: Settings tab. Selected destination: Settings.

[Screen image](../images/mobile/soul/05-settings.png) · [Exact prompt](../prompts/screens/soul/05-settings.txt)

Pictured state: SOUL header; cream background with blue accent and tiny sun. Heading "Make the forecast yours". Sections "Units": Temperature °C selected over °F; Wind km/h selected over mph; Time 24-hour selected over 12-hour. "Home city" row Lisbon. "Location" row Manual. "Golden-hour reminder" switch OFF. "Reduce motion" switch ON. Links "Privacy" and "Data sources". Bottom Today / Places / Settings; ONLY Settings active. Do not add a Save button: these preferences save immediately.

### Control ledger

| ID / element | Input | Result and route | React / accessibility |
| --- | --- | --- | --- |
| `soul.05.01` · Temperature / wind / time | Tap option; arrow keys | Save immediately; announce saved or restore previous selection with retry on failure; convert all displays consistently. Route: `self`. | Native radio group with one selection and a visible legend; selected and focus states are distinct. |
| `soul.05.02` · Home city | Tap/click; Enter | Choose default city without deleting saved places. Route: `04-places`. | Route link; announce destination heading after navigation and restore scroll on Back. |
| `soul.05.03` · Location: Manual | Tap/click; Enter or Space | Offer manual/current location; request permission only after explicit choice. Route: `aux:location-preference`. | Button with visible focus; pending state only for asynchronous work. Return focus after a sheet closes. |
| `soul.05.04` · Golden-hour reminder | Tap or Space | On requires permission; Off cancels future reminders. Route: `aux:notification-permission`. | Native checkbox styled as switch; label and checked state agree. Permission-dependent value stays off until granted. |
| `soul.05.05` · Reduce motion | Tap or Space | Persist preference; honor system reduced motion as initial default. Route: `self`. | Native checkbox styled as switch; label and checked state agree. Permission-dependent value stays off until granted. |
| `soul.05.06` · Privacy / Data sources | Tap/click; Enter | Open readable in-app document; Back returns to Settings at same scroll. Route: `aux:legal-and-sources`. | Route link; announce destination heading after navigation and restore scroll on Back. |
| `soul.05.nav.1` · Today | Tap/click or Enter | Open Today; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `03-today`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `soul.05.nav.2` · Places | Tap/click or Enter | Open Places; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `04-places`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |
| `soul.05.nav.3` · Settings | Tap/click or Enter | Open Settings; show only its selected state. Preserve independent tab scroll and draft state; selecting the active destination is a no-op. Route: `05-settings`. | Route link inside nav; aria-current=page on the active destination. No automatic save, sound or permission request on navigation. |

### Display, scroll and hover

Brand, headings, body copy, background texture, decorative vignettes and dividers are noninteractive. Read meaningful copy in document order; decorative artwork uses empty alt. OS chrome is intentionally omitted from exports; production safe-area insets belong to the app shell. Step markers communicate progress and are not buttons. Numeric totals derive from saved data or the explicitly described draft. Any exceptions appear in the control ledger.

One vertical scroll region. Preserve the airy spacing; at small heights or large text allow scrolling instead of scaling text down. Keep the bottom destination navigation above the safe area when present, and add content inset so it covers nothing. Keyboard opening scrolls the focused field into view; closing it restores the prior position. No horizontal paging gesture changes destination.

Touch is primary. Fine-pointer hover may tint or underline an existing control in 120 ms, with an equivalent focus-visible state. It never reveals the only way to act. Press feedback uses opacity/color, no layout shift. Default route transition is a 160 ms crossfade; honor reduced motion with an immediate change. Botanical and weather artwork is still by default.

## Additional routes and recovery

These states are specified, not additional image exports. Every `aux:` destination in the ledger is defined here. Shared loading, error, back and persistence behavior is in the [React handoff](react-handoff.md).

### city-search

Labeled city search, clear-query button, result list with country and timezone, loading/no-results/error states. Selection uses a stable city ID. Add/Use is explicit; duplicate saved city selects the existing record. Cancel restores the invoking route and draft.

### daylight-detail

Show sunrise, sunset and daylight window as readable times with timezone/source. Optional reminder requires its own explicit action. Close returns to the initiating row/arc; polar-day/no-data states need explanatory text.

### hour-detail

Present the chosen hour, temperature and available forecast metrics with a data timestamp. Previous/Next hour controls and an accessible text table are alternatives to the chart. Missing data uses a dash and explanation, not zero.

### legal-and-sources

Readable Privacy and Data sources documents with heading, links, provider attribution and Close/Back. Preserve Settings scroll; external links are identified and do not silently change the current preference.

### location-permission

Use my location explains foreground lookup, then requests it on Continue. Resolve coordinates to a named city with confirmation. Denial, timeout or unavailable result returns to manual search; never invent a location.

### location-preference

Offer Manual city and Current location. Manual opens saved/search cities. Choosing Current requests permission only if needed; denial retains Manual and the previously saved city.

### manage-city

An accessible More menu exposes Move up/down and Remove. Swipe may reveal the same actions but is never required. Removal offers Undo; removing the active/home city first selects another or returns to setup if none remain.

### notification-permission

Explain the specific reminder; Continue invokes the platform prompt. Granted enables and schedules; denied or dismissed keeps reminders off with a Settings/help route. Cancel returns to the exact invoking control. Do not prompt on every visit.

### weather-detail

Show the selected metric, units, explanation and provider timestamp; keep missing/error values distinct. Close returns focus to Wind or Humidity, not the top of the page.

## Alternative to evaluate

**Manual city first.** Default to city search. Offer location only as a secondary explicit shortcut and move reminder setup until after the first forecast. Compare first forecast success, permission denial recovery and city corrections.

## Implementation acceptance

- Every visible control maps to a ledger ID; decorative and operating-system content is explicitly excluded.
- Resolve every route and carry `returnTo`, record ID and draft ID through editors.
- Test primary flow plus back/cancel, rejected permission, empty data, failed save/retry, offline resume and duplicate activation.
- Test keyboard-only, screen reader order, reduced motion, 200% text and a narrow viewport; no clipped controls or hidden essential actions.
- Verify the fixed data checks above with shared selectors rather than hardcoded repeated strings.

<!-- MOTION CONTRACT -->

## Motion, rollover and implementation prompts

Extract the sun and cloud language from the approved blue scene, then animate reconstructed objects with a fixed camera. The forecast stays data driven; the sculpture gives it character.

[Complete motion contract](motion/soul.md) · [App interaction prompt](../prompts/interaction/soul.txt) · [Asset preparation prompt](../prompts/motion/soul-assets.txt) · [Motion direction prompt](../prompts/motion/soul-direction.txt)

Proposed motion and interaction specification. No video, shader, extracted asset or 3D model has been produced in this round; the review remains a static screen study with an action explorer.

- [01 screen interaction prompt](../prompts/interaction/soul/01-place.txt) — Search field focus freezes the 3D scene. Result hover tints without selecting; activation checks Lisbon. Use Lisbon proceeds with its ID; Use my location has an explicit permission route.

- [02 screen interaction prompt](../prompts/interaction/soul/02-preferences.txt) — Segmented options tint on hover and animate the selected fill 140 ms after activation. Units remain real values; changing them never morphs the sculpture.

- [03 screen interaction prompt](../prompts/interaction/soul/03-today.txt) — Forecast hover/focus shows the exact hour and value without changing selection; tap opens detail. City change updates data and condition group only after a successful fetch; preserve old data with loading status.

- [04 screen interaction prompt](../prompts/interaction/soul/04-places.txt) — Saved-city rows tint on hover; More and Add are independent targets. Add Porto changes saved count only on success, with a 180 ms row appearance. Avoid duplicating a saved city.

- [05 screen interaction prompt](../prompts/interaction/soul/05-settings.txt) — Unit selection updates all derived values. Reduce motion immediately freezes the scene and persists; switching it off does not force a replay. Privacy and sources are route links.
