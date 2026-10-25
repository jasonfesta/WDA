# Bunny Royale — Future technical plan

**Planning only. The current instruction explicitly excludes development.** No engine, dependency, multiplayer service or runtime implementation is selected by this document.

## Proposed separation of concerns

A future build should separate the simulation from rendering and interface presentation. The simulation owns movement, projectiles, enemy health, encounters and outcomes. Rendering consumes that state for animation, materials and effects. The HUD reads authoritative state rather than maintaining its own independent score or cooldown. This avoids a polished display becoming disconnected from actual play.

Character definitions should contain stable identity, equipment and ability references. Tunable combat parameters belong in a versioned data layer, not embedded across menu copy and effect files. The first level should be authored as a small sequence of encounter definitions with explicit completion conditions and spawn rules.

## A realistic first feasibility slice

After separate implementation approval, test one character, one weapon, a few cover objects and one enemy inside a simple arena. Establish camera comfort, aiming, hit feedback, collision and pause behavior before importing the complete art direction. A beautiful environment cannot compensate for an unreadable camera or unreliable controls.

The next slice should establish the actual character pipeline: modeled geometry, rig, animation, materials and weapon attachment. Only after that should the remaining fighters, richer map and menus be integrated. The raster reference package accelerates artistic decisions but does not replace these steps.

## Rendering and performance questions

The world calls for stylized 3D materials, broad lighting, limited transparent effects and clear silhouettes. The production team must choose a browser-capable renderer or engine according to demonstrated device support, asset workflow and maintenance needs. No specific frame-rate target is claimed as achieved. A future performance budget should name test hardware, resolution, scene complexity and acceptable thermal behavior.

Measure load time, texture memory, draw calls, active enemies and effect overdraw on representative hardware. Quality changes should first reduce optional particles, shadows or distant detail; they should preserve aim responsiveness and enemy telegraphs. A lower-quality path must remain readable rather than removing meaningful gameplay cues.

## Systems that require explicit decisions

Pointer capture and gamepad behavior, save/reset semantics, touch feasibility, collision strategy, enemy navigation and destructible-cover scope all need prototypes after authorization. Networking would add a separate authority, synchronization and abuse-prevention problem and is outside the first-level concept. The name “Royale” does not authorize adding servers.

## Evidence expected later

An implementation review should include a recorded full run, input-device checks, actual loading behavior, loss-of-focus recovery, accessibility settings and measured performance. It should identify placeholder art and incomplete systems. None of those later tests can be inferred from the current generated gameplay image or menu screens.
