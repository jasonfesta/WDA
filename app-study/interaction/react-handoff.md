# App study — interaction to React

Jason Festa / WDA · 21 October 2026

This is the implementation contract for the proposed experiences. The review gallery is a working review tool; its mobile images are visual specifications, not working native applications.

## Screen, route and state boundaries

Use `data/flows.json` as the route/control inventory. Each app has five pictured states, three main destinations and explicit auxiliary routes. `controls` covers screen-specific actions; `shared_controls` covers each visible destination link. Display, scroll and hover notes cover the rest of the screen. Keep the six app stores separate.

Build an `AppShell`, `DestinationNav`, screen components, a `SheetHost`, `FormField`, `InlineError`, `SaveStatus`, and domain components such as `RitualPlayer`, `PlantObservationForm`, `HouseholdNote`, `WeatherChart`, `PuzzleBoard`, and `PlanEditor`. Reuse behavior and accessibility primitives while keeping each app’s colors, typography, illustration and spacing distinct.

The bottom destinations are links inside a labeled navigation region, with `aria-current="page"` on the active route. They are not a generic tab widget. Use actual tab roles only for panels that share one view and follow the [W3C tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

Every editor carries `{recordId, mode, returnTo, draftId}`. Setup and editing may reuse a form but have different back targets. A deep link without a valid record shows a recoverable not-found state and a route to the relevant list. Returning users skip completed setup; interrupted setup resumes the latest valid draft. Browser/system Back closes the top sheet first, then returns through navigation history. A dirty draft opens Keep editing / Discard before leaving.

## Separate draft and saved data

Use a reducer for each multi-step form or play session; keep server/cache data separate from draft values. Changes must not mutate saved records until Save succeeds. Preferences explicitly described as immediate-save can use optimistic updates with rollback and retry. Do not persist notification tokens, credentials or private household content in browser localStorage. Production storage and authentication are implementation decisions; the study uses fixture data only.

Recommended domains:

| App | Canonical data | Derived display |
| --- | --- | --- |
| Afterglow | windDownMinutes, routineIds, completedRitualIds, trackId, elapsedSeconds, timerEndsAt | routine total, start time, audio remaining |
| Pocket Garden | plantsById, careTasksById, observationsById, noteDraft, demoMode | plant count, due count, note history |
| Home Note | householdId, peopleById, pendingInvitesById, agendaById, notesById, readReceipts | member/pending totals, agenda, unread state |
| Soul | selectedCityId, savedCityIds, rawForecastByCity, units, permission, reducedMotion | converted values, chart points, city count |
| Petal | collectionId, puzzleId, stripOffsets, completedPuzzleIds, preferences | aligned count, progress percentage, collection totals |
| Daybook | selectedDate, timezone, plansById, placesById, planDraft, importedSourceIds | duration, reminder time, weekly agenda, daylight remaining |

Never store the same total in two places. Completion is a set of IDs, not an increment on every visit. Save requests use a stable operation ID; disable repeat submission until resolved and reconcile retry without duplicate records. Version household records to detect concurrent edits; offer Reload latest / Review my draft when a conflict occurs.

## Interaction states

Every asynchronous action has idle, pending, success and error states. Keep a stable button width during pending. Error copy describes the action that failed and offers Retry or Cancel; preserve entered values. Announce save results with a polite status region, and focus the first invalid field on submit. Native labels, required indicators and error associations follow [W3C validation guidance](https://www.w3.org/WAI/tutorials/forms/validation/).

Lists have explicit empty states with the relevant first action. Weather loading shows a reserved layout; cached data is labeled with its update time and never presented as freshly loaded. Offline reads may use cached data. Offline edits show Saved on this device / Waiting to sync only after a local write actually succeeds; otherwise keep the draft and explain failure. Failed network actions never silently clear a form.

Sheets have a visible Close or Cancel, a heading, sensible initial focus, focus containment and focus restoration. Escape and Back close the sheet unless unsaved changes require a discard choice. This follows the [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Destructive actions have explicit confirmation; successful reversible removals offer Undo without moving focus.

## Scroll, pointer, keyboard and motion

One content scroll region per screen. Use safe-area insets around fixed destination navigation and bottom actions. At 320 CSS pixels wide, short landscape height, 200% text, or an open keyboard, let content scroll rather than squeezing typography or covering controls. Store scroll by route; editors return to their invoking row.

Project touch-target goal: at least 44 × 44 CSS pixels, including small icons. Hover can tint or underline an existing affordance in 120 ms; keyboard focus uses a visible outline and never relies on color alone. Press feedback uses a subtle color/opacity change. No hover-only actions, long-press-only menus or automatic navigation on focus.

Use a 160 ms crossfade for route transitions, 180 ms sheet entry, and the per-control timings in the motion briefs. These are proposed timings to evaluate, not measured competitor timings. Honor system or in-app reduced motion by removing translation, parallax and automatic illustration motion. [MDN reduced-motion guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) documents the system preference. Never animate all page sections into view on scroll.

## Motion assets and production prompts

The [six motion briefs](../research/motion-references.md) add app-specific ambient behavior, state feedback, rollover, press, focus, scrolling and asset preparation. Every screen has an `interaction_prompt_path`; every control has `rollover`, `motion_feedback` and `interaction_prompt` in `data/flows.json`. These detailed notes take precedence over earlier generic motion language.

| Experience | Proposed runtime | Asset work before implementation |
| --- | --- | --- |
| [Afterglow](motion/afterglow.md) | Localized light shader, then still | Crescent cutout and clean background plate |
| [Pocket Garden](motion/pocket-garden.md) | Short illustration clip or layered leaf motion | Five matching illustration poses with no baked-in UI |
| [Home Note](motion/home-note.md) | Short house vignette, code-driven control feedback | House plate; separate still avatars and card objects |
| [Soul](motion/soul.md) | React Three Fiber objects with fixed camera | Sun/ray/cloud cutouts, then separately reconstructed named 3D meshes |
| [Petal](motion/petal.md) | Pointer-driven strips and deterministic snapping | One continuous botanical source image |
| [Daybook](motion/daybook.md) | Data-driven SVG arc and timeline | Landscape plate separated from arc, marker and text |

Keep an `AmbientLayer` independent of app state transitions and a shared motion policy derived from system preference, saved preference, visibility and input focus. Decorative artwork does not receive pointer events or keyboard focus. The default is one short introduction that settles; continuous animation requires its own explicit pause control before shipping. Media/render failure shows the approved still. No animation callback may grant progress, send an invitation or commit a form.

All final screenshots omit OS chrome; actual safe areas remain a responsive layout concern. The media briefs describe future assets, not files already produced. Generated motion studies are pacing references, and a raster cutout is not editable 3D geometry. React behavior must derive from the app store, not video frames.

## Domain-specific behavior

**Afterglow:** instantiate audio in a service outside the screen lifecycle, so switching destinations does not reset it. Entering Sounds does not autoplay. The playing screenshot is after an explicit Play action. Seek clamps to track bounds; an audio interruption exposes Resume. Time picker wheels have numeric alternatives. Library checkmarks mean included in tonight’s routine; Tonight’s completion rings mean finished. These are separate states.

**Pocket Garden:** one soil check records an observation. Dry soil can offer contextual guidance and a separate Watered action; no watering event is recorded automatically. Demo mode is labeled and isolated. Note/photo upload errors keep the draft, and cancelled photo selection changes nothing.

**Home Note:** role checks are enforced by the backend, not inferred from a displayed name. Invites require a reviewed recipient and explicit Send. The People screenshot occurs after a successful send; setup does not send it. Mark read is a deliberate acknowledgement, not a side effect of opening a note. Illustrative onboarding cards are not live agenda controls.

**Soul:** city search stores a location ID and timezone; typed text alone is not a selected city. Keep weather in canonical units and derive all converted values with shared formatters. Chart points support tap and keyboard selection with a parallel readable table. Location/reminder requests happen only after a user chooses the feature. Denial keeps manual city lookup working; actual platform capabilities must be checked during implementation. Permission status and the reminder preference are distinct ([notification states](https://developer.mozilla.org/en-US/docs/Web/API/Notification/requestPermission_static)).

**Petal:** build all five strips from one continuous source illustration with shared crop coordinates; do not use five independently generated crops. Raster concepts show the intended states, but the production board must derive offsets, joins and progress mathematically. Pointer drag updates one strip, then snaps within a defined tolerance. Tap a strip and tap a destination is the single-pointer alternative; keyboard arrows provide another method. Cancel a gesture without committing on Escape or pointercancel. This addresses the [W3C dragging guidance](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html). Tutorial moves never add a completed puzzle ID. Hint highlights a target; it does not complete a piece. Persist completion once, then show the complete state; a replay does not inflate totals.

**Daybook:** store timestamps with an explicit timezone; date and time entry derive one duration. The editor preview shows a changed end time before save. Keep the original record until Save succeeds. Calendar import is read-only, optional and keyed by provider/source IDs to avoid duplicate events. Daylight labels derive from current time and sunset, and refresh on resume. Sample June data is a fixture, not today’s live forecast.

## Verification for later implementation

For each control ID, test the primary action and its return route. Cover setup resume, deep link, Back, dirty Cancel, repeated Save, permission denial, empty list, offline read, failed write/retry, expired invite and concurrent edit. Assert the per-app fixed-data checks in its ledger. Test keyboard order, screen-reader names/state, reduced motion, dynamic text and real-device safe areas. Measure actual contrast using the implemented colors; raster review alone does not establish accessibility compliance.

The image review, route walkthrough and documentation can be evaluated now. Authentication, storage, audio, forecast providers, calendar integration and native permission APIs remain later product implementation work.
