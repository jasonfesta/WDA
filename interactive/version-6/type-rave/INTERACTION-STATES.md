# Interaction states

## Composition and performance

The proposed core states are Ready, Composing, Performing, Frozen, and Exporting. Audio-source status and microphone permission should be independent substates. This prevents an unavailable microphone from disabling text editing or a prepared loop. Phrase content should persist across behavior changes, input changes, and temporary dialogs.

**Ready:** the phrase is visible in a stable composition. Play and Edit phrase are primary. A small source indicator identifies the prepared loop. No sensor request appears until the visitor deliberately chooses it.

**Composing:** the text field owns keyboard focus. Global shortcuts are disabled. The visitor can change words and line breaks, with a useful length indicator before layout becomes crowded. Closing the editor preserves the phrase and returns focus to the stage.

**Performing:** one behavior is active with bounded intensity. Pointer manipulation affects the selected composition parameter. The interface indicates which input is driving motion. Changing behavior retains content and eases into the new arrangement.

**Frozen:** the current frame is held intentionally. The control label changes to Resume, and Save becomes prominent. Freeze should not be confused with silent audio or an unloaded font. A future project save would preserve the exact chosen state rather than re-randomizing it.

## Source and permission paths

Microphone states are Off, Requesting, Live, Denied, and Unavailable. Live requires a persistent but compact indicator and an obvious stop action. Silence is different from denial: it should show a low input level while keeping the composition usable. Switching back to the prepared loop should not ask for permission again or leave capture running unnecessarily.

Local-file audio, if approved later, needs Decoding, Ready, and Error states. A failed file should leave the current valid source intact. Source changes should not clear the phrase or destroy a frozen composition.

## Export, reset, and interruptions

Exporting should show the target size and a short progress state only when needed. Failure returns to Frozen with the frame preserved. Reset should restore the current behavior's parameters; clearing the visitor's words is a separate action. Closing a mapping popover must not reset its confirmed value.

A hidden tab should pause unnecessary work and preserve the state. Resizing should reflow from saved composition rules rather than randomly reposition letters. Keyboard proposals include Space for transport, F for freeze, and 1/2/3 for behaviors, with equivalent labeled controls.

These states describe future behavior. No microphone permission, file analysis, font engine, export process, or interactive application is started by the documentation pack.
