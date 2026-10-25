# Bunny Royale — Interaction states

## Controls and visibility

The proposed desktop map is WASD movement, pointer look, primary click fire, Space jump, R reload, a remappable ability action and Escape pause. These are design defaults, not hard-coded promises. A later controller scheme must expose equivalent movement, aim, fire, jump and ability actions. Touch needs a dedicated layout and testing before it can be represented as supported.

Protect the central aiming corridor and horizon. The bottom HUD should occupy small separated islands rather than one large opaque dashboard. Context prompts appear near their relevant world objects, with a short timeout and an alternate help route. A temporary weapon choice replaces other secondary prompts; it does not stack another panel on top of them.

## State contract

| State | Available action | Response | Recovery |
| --- | --- | --- | --- |
| Main menu | Play, settings | Enter selection or deliberate settings screen | Back returns to menu |
| Character selection | Select, inspect, confirm | Update hero and loadout together | Keep choice when returning |
| Briefing | Start, change fighter | Show route and then loading progress | Return without losing choice |
| Loading | Wait or cancel | Report real stage progress; never fake percentage | Explain failure and retry |
| Active encounter | Move, fire, jump, ability | Immediate local feedback plus readable enemy response | Pause on focus loss |
| Reloading | Move, jump, ability if compatible | Clear reload progress; no misleading fire animation | Define cancellation consistently |
| Ability unavailable | Press ability | Small unavailable cue and recharge indication | No repeated blocking message |
| Pause | Resume, settings, exit | Freeze solo simulation and release pointer | Countdown before resume |
| Victory or defeat | Retry, change fighter, menu | Show result and next action | Preserve accessibility settings |

## Feedback hierarchy

Damage direction must be perceptible without painting the whole screen red. Health loss uses shape and text as well as color. Enemy windups need an animation and sound cue before damage. Ammo depletion should be distinct from a broken input device: an empty weapon has a specific feedback cue and a reload action.

Ability cooldowns, wave counts and scores in existing art are placeholders. Future values must come from actual game state and remain synchronized across HUD, pause and results. A screenshot is not evidence that timing, scoring or combat works.

## Accessibility and interruption

Provide remapping, adjustable sensitivity, hold/toggle alternatives where appropriate, subtitles for meaningful speech and visual equivalents for critical sound cues. Offer reduced camera shake and reduced flashes. Never use color as the only character, target or cooldown distinction.

Menus require visible keyboard focus. Escape should have a predictable single-level effect. A permission or pointer-lock failure must leave the user in a controllable menu rather than a frozen-looking arena. Exiting a run asks about lost run progress only when there is progress to lose; routine setting changes remain reversible.
