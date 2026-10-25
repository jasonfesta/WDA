# Content and assets

**Asset specification. Existing images are generated raster studies; this inventory does not imply that editable artwork or a working renderer exists.**

## Current review package

The [V2 manifest](manifest.json) is the authoritative list of seven current images and their exact prompt files. The desktop images are approximately 1586 × 992 pixels; mobile images are approximately 852 × 1847 pixels. Small dimension differences are generation outputs, not intentional viewport standards.

| Mode | Desktop study | Mobile study |
| --- | --- | --- |
| Ink Score | [Landscape](assets/ink-score-desktop-v2.png) | [Portrait landscape](assets/ink-score-mobile-v2.png) |
| Kinetic Poster | [Painted title](assets/kinetic-poster-desktop-v2.png) | [Portrait title](assets/kinetic-poster-mobile-v2.png) |
| Listening Diary | [Memory sequence](assets/listening-diary-desktop-v2.png) | [Portrait sequence](assets/listening-diary-mobile-v2.png) |

The [control sheet](assets/shared-controls-v2.png) covers Play, Pause, active modes, phrase selection, looping and save confirmation. The draft sheet with misleading playback-state captions is superseded and must not be used.

## Artwork needed before implementation

A production art pass would need individual washes, river segments, botanical marks, ink strokes, title glyph treatments and vignette elements with clear compositing boundaries. Specify useful edge transparency, neutral resting poses and variants for sparse and dense compositions. Generated screenshots cannot simply be stretched and presented as live analysis.

Each element needs an identifier, mode, palette family, intended scale range, anchor points and permitted transformations. Painterly forms should tolerate modest translation and reveal; arbitrary scaling or rotation can destroy the brush character. Create a separate inventory of quiet-state artwork and reduced-motion stills. Interface icons, font files and focus indicators require their own precise design pass.

## Audio and writing

“Quiet Current / Demo track / 96 BPM / 03:12” is fictional metadata in the current art. Commission or license a real demonstration recording before presenting those values as factual. Supply its title, artist credit, duration, source, permission record and an authored cue sheet. Include at least one quiet passage, one clear rhythmic passage and one more sustained passage to expose weaknesses in the mapping.

User files should display supplied metadata cautiously and fall back to a filename. Estimates use labels such as “Tempo estimate”; unavailable information is omitted. Diary language belongs to the listener. Suggested words are editable prompts, not automatic emotional labels.

## Saved artifacts

A still export contains the chosen artwork and optional title/timestamp caption. It does not need the playback UI or raw audio. A composition record contains mode edits, seed, annotations, loop and source-reconnection metadata. The export flow must explain which artifact is being saved. Reference images from earlier research remain credited research material; no production license for them is asserted.
