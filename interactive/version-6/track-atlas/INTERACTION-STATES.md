# Interaction states

**Behavioral specification only. The [shared-controls study](assets/shared-controls-v2.png) illustrates selected states rather than an exhaustive component library.**

## Shared state contract

Track identity, active mode, current time, duration, playback state, loop bounds and selected annotation belong to the session. Composition edits and undo history belong to each mode. Changing mode must not restart playback, silently clear a loop, or overwrite another mode's work.

| State or event | Visible response | Exit and preservation rule |
| --- | --- | --- |
| No source | Quiet sample illustration; Open track and Try demo | No invented analysis or enabled playback |
| Loading/decoding | Track name, progress if known, Cancel | Preserve previous session until replacement succeeds |
| Ready, paused | Play action; stable current image | Play begins at displayed position |
| Playing | Pause action; moving playhead | Pause holds audio time and composition |
| Seeking | Time preview and explicit position | Release commits once; cancel restores prior position |
| Loop selection | Two handles and a labelled range | Handles cannot cross; clear returns to full track |
| Mode change | New composition at the same time | Retain per-mode edits and selection timestamps |
| Edit selected | Outline, handle and contextual actions | Undo restores the previous authored change |
| Save frame | Brief working indicator, then saved state | Failure keeps the current composition intact |
| Source error | Plain explanation and Choose another file | Never replace the last good artwork with a blank screen |

## Input behavior

Every visible action has a keyboard focus target. Space toggles playback only when focus is outside a text-entry control. Arrow keys adjust a focused timeline or selected object; they do not unexpectedly hijack page navigation. Escape cancels a transient edit or closes a sheet before it affects playback. Undo and redo describe the affected creative action.

A pointer drag begins only from a selected editable target. On touch, the first tap selects; a subsequent drag moves the target. Provide equivalent labelled controls for position and spacing so a precise drag is optional. Proposed touch targets are at least 44 CSS pixels, regardless of the smaller drawn icon. This is a design target to verify later.

## Motion, focus and interruptions

Reduced-motion mode removes continuous illustration movement and animated reconfiguration. Seeking presents a still for the requested time, and playback retains a restrained time indicator. A separate Pause visuals action lets the listener hold the artwork while audio continues; its label must be distinct from Pause audio.

Temporary sheets trap focus only while open and return it to the invoking action when closed. Status messages are available as text; screen readers should not announce every audio sample or frame. An optional session summary exposes track metadata, active mode, current time and diary entries in reading order.

If audio is interrupted by the browser or device, show “Playback interrupted” with Resume. Do not display the playing state while silence is caused by suspension. Background behavior is a future validation question: the preferred policy is to stop visual rendering when hidden while accurately reflecting any continued audio.
