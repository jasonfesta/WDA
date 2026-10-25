# Bunny Royale — Content and assets

## What exists

The [current asset manifest](manifest.json) is the source of truth for file paths, dimensions, alpha and prompt provenance. It includes 27 current PNGs. The [complete art review](index.html) groups the images and supports close inspection.

| Group | Count | Existing content |
| --- | ---: | --- |
| Brand | 1 | Transparent wordmark |
| Characters and equipment | 12 | Three fighters × turnaround, equipment sheet, transparent beauty render, transparent weapon |
| Environment | 3 | Revised suburban scene, encounter map and modular scenery sheet |
| Enemies, effects and rewards | 3 | Enemy roster, projectile/ability sheet, pickup sheet |
| Interface | 8 | Main menu, selection, briefing, gameplay, pause, victory, defeat and component sheet |

The 12 character/equipment images retain the approved designs. Interface revision 2 uses the corrected world. Earlier resort images and superseded menu studies are preserved in the workspace but excluded from this selected package.

## Asset-to-production translation

Turnaround sheets guide a modeler; they are not orthographic CAD, meshes or a guarantee of perfectly consistent hidden surfaces. Model production still needs a scale sheet, topology decisions, UVs, material definitions, rig tests and pose checks. Transparent beauty images are compositing assets, not rotatable 3D characters.

Each fighter needs locomotion, idle, jump, land, aim, fire, reload, ability, hit reaction and celebration animations. Bruno's drum and Volt's coils require distinct handling. The enemy roster needs matching readable windups and defeat motion. A first production pass should prove one full character pipeline before duplicating it for all three.

The world needs actual terrain, collision, navigable routes, cover geometry, spawn points and boundaries. The environment map describes encounter intent but does not supply usable world coordinates. Modular scenery art must become a kit with consistent scale, seams and collision rules.

## Interface and effects

Generated interface text is a visual guide. Production typography should be rebuilt with real text, responsive constraints and accessible labels. The component sheet is an intact reference image; it has not been sliced into an engine atlas. Projectile and pickup sheets likewise require individual extraction or reconstruction, pivot definitions and animation treatment.

Audio remains a missing production category: music, menu transitions, rabbit vocalizations, footsteps, weapon signatures, impacts, pickups and critical encounter cues. No existing commercial game's audio is included in this pack.

## Handoff convention

Preserve canonical character names and lowercase asset stems. New revisions should receive a new suffix and a manifest entry describing the changed feature. Keep rejected art out of current previews. Any additional asset must identify whether it is a reference, generated concept, production-ready element or tested runtime asset. Those are different statuses and should not be collapsed into “done.”
