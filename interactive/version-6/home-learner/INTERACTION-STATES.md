# Interaction states

## Session lifecycle

Draft lesson contains a title, outcome and selected capability without recording. Source setup lists available inputs and permission status. Ready shows a preview and capture boundary; recording begins only after Start lesson. Recording exposes timer, active source, voice state, Mark step, Pause and Finish. Paused preserves the session without implying new media is being retained. Review operates on completed segments and can return to another capture segment.

Finishing capture does not confirm annotations or train a model. Review can save a dataset draft, publish a numbered dataset version, or discard selected material. Preparing model creates a run referencing an immutable dataset version and capability configuration. A failed or cancelled run leaves the previous model usable. Test uses a named model version and fresh session excluded from its training inputs.

## Observation lifecycle

An observation moves through suggested, needs review, confirmed, corrected or discarded. A voice label initially records what the person said; it is not automatically a verified event. Editing “charger packed” to “charger on table” preserves the original suggestion and its correction relationship. Splitting a long segment creates new boundaries without rewriting the raw source silently.

A prediction during testing has its own lifecycle. Confirming it records reviewer feedback; it does not instantly update the deployed model. “Add to next dataset” is explicit. The interface must show that Dataset 03 and Model 02 can coexist correctly.

## Interruptions and recovery

If permission is declined or never answered, setup remains usable with import and retry. A disconnected source pauses the segment, marks the gap and avoids pretending capture continued. Backgrounding or device lock follows the platform's actual behavior and returns to a clear interrupted state. Resume never hides missing footage.

Low storage stops new capture before promising to save more. An incomplete upload is distinct from local save failure. Cancelling cloud processing should report what was cancelled and what material still exists; it must not claim deletion without a confirmed result.

## Controls and access

All recording actions have visible touch controls. Optional voice commands are redundant conveniences, not the sole way to pause. Recording and playback shortcuts cannot fire while typing labels. Selection, recording, processing and permission are separate state dimensions, so a disabled Train action can explain its precise reason.

A future device-worker sheet uses invited, capability check, opted in, idle, assigned, paused, left and failed states. Leaving cancels future assignments; it does not silently revoke or erase the owner's completed dataset.


## Android interaction requirements

Plan for status/cutout and gesture-navigation insets, plus three-button navigation where selected. Compact visual controls still need at least 48 dp touch targets, accessible labels and a visible alternative to gestures. System Back must respect unsaved recording/review state. Font scaling should reflow review rows rather than truncate the correction or move Finish beneath system navigation. These are future validation requirements, not implemented behavior.
