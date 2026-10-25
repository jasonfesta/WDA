# Interaction states

## Core state flow

The proposed state sequence is Loading, Ready, Riding, Airborne, Landing, and Results, with Pause and Recovery available where appropriate. Each state needs a specific input contract. A transition should follow physical contact or an explicit visitor action, not a decorative animation finishing at an arbitrary time.

**Ready:** the craft floats without moving away from the start marker. Ride and Free ride are distinct choices. Settings may be opened here. Audio begins only after a deliberate start action. If a required asset fails, the visitor sees a readable retry option instead of an empty ocean.

**Riding:** throttle, steering, slowing, and a limited boost are available. A preload hop is available only near water contact. Contextual hints disappear after demonstrated use. Gate progress advances once per valid crossing.

**Airborne:** thrust influence is limited, aerial yaw is bounded, and the camera retains a readable horizon. The UI may show one contextual trick action. It must not invite an action that is unavailable in the current jump.

**Landing:** evaluate contact and alignment, then issue one clean, rough, or wipeout result. Banking the chain happens once. A second contact sample must not award a duplicate landing.

## Recovery and interruption

A wipeout clears unbanked points and enters a brief recovery state. The reset pose must include position, heading, and a safe speed. It should never place the rider behind a ramp facing the wrong way or inside geometry. During recovery, throttle input is ignored until control is explicitly returned.

Pause freezes session progression and releases held controls. A hidden tab or lost focus should lead to pause rather than accumulate seconds of unseen simulation. Resume provides a calm re-entry. Restart clears run state while preserving settings. Exiting Free ride produces a summary without implying that a timed course was completed.

## Controls by device

Desktop proposals use W or Up for throttle, S or Down to slow, A/D or arrows to steer, Space for preload, and Q/E for a bounded aerial action. Optional look-around should not be required for steering. Escape must return from captured pointer interaction.

Touch uses left steering and right throttle/brake, plus one contextual action. Do not require four simultaneous contacts to complete a basic jump. Orientation change should suspend the run and offer a useful layout, not instantly wipe out the rider.

These are state specifications for later design and engineering review. No new input handler, simulation loop, or state machine is delivered in this pack.
