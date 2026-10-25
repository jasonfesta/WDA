# Secondary frames — Visuals v5

36 new static PNG mockups: 12 each for Ledger (finance), FORM (health), and Daybook (to-do). Each concept has three secondary pages across mobile app, native desktop app, browser web app, and desktop website. Component views are excluded.

Open [the review page](../../visuals-v5.html). It presents one frame at a time, with a **Compare with first frame** control and full-resolution image links. The complete v4 first frames remain unchanged.

```sh
python3 -m http.server 5207 --bind 127.0.0.1 --directory trackers/moodboard
```

Then visit <http://127.0.0.1:5207/visuals-v5.html#peloton/mobile/1>.

## Page inventory

| Concept | Three app pages, each in mobile / native desktop / browser | Three full website pages | Count |
| --- | --- | --- | --- |
| Ledger | Activity and receipt; groceries budget; upcoming bills | Budgeting; spending; how it works | 12 |
| FORM | Class library; mobility session detail; weekly plan | Mobility training; Maya Chen coach profile; progress | 12 |
| Daybook | Project detail; task detail; weekly calendar | Projects; template directory; weekly planner detail | 12 |

All image paths, dimensions, hashes, and corresponding first-frame paths are recorded in [manifest.json](manifest.json). The final images are in `images/ramp/`, `images/peloton/`, and `images/notion/`.

## Continuity

Every generation used the corresponding existing first frame as its image reference. Ledger keeps its heavy sans-serif headings, pale workspace, yellow actions, green charts, and open financial rows. FORM keeps graphite app surfaces, violet progress markers, white actions, and the established fictional coach and studio photography. Daybook keeps serif document titles, ink illustrations, quiet database rows, pastel properties, and blue app controls.

The first-frame SHA-256 hashes are preserved in the manifest and checked against both the working files and the committed v4 baseline. These are generated raster extensions of the existing concepts, not editable app implementations or pixel-identical reconstructions.

## Research and provenance

The official sources informed page structure and tasks; the first frames controlled visual styling. [research.json](research.json) contains 11 sources, findings, saved reference assets, and access limitations. Each frame maps to its relevant sources.

- Ledger: [Ramp transaction and mobile workflows](https://support.ramp.com/ramp-mobile-app/), [budget detail](https://support.ramp.com/budgets-overview-and-setup/), [budget feature pages](https://ramp.com/budgets), and [expense management](https://ramp.com/expense-management).
- FORM: [Peloton class discovery](https://www.onepeloton.com/classes), [personalized plans](https://www.onepeloton.com/blog/personalized-workout-plan), and [instructors](https://www.onepeloton.com/instructors).
- Daybook: [Notion projects and tasks](https://www.notion.com/en-gb/help/guides/getting-started-with-projects-and-tasks), [database views](https://www.notion.com/help/views-filters-and-sorts), [planner directory](https://www.notion.com/templates/category/personal-planner), and [template detail](https://www.notion.com/templates/simple-weekly-planner09).

Created with the built-in `image_gen` tool, one image per request. [prompts.json](prompts.json) retains all 36 original generation prompts. [revision-prompts.json](revision-prompts.json) records targeted corrections made after visual review. [generation-results.json](generation-results.json) identifies the final assets and their hashes.

Public publisher material was used; no authenticated app sessions were accessed. Mobbin required a paid plan and was not used. Ledger's native desktop view is an original concept extension, not a claim that Ramp offers a native desktop app. All people, accounts, transactions, tasks, and workouts in the generated designs are fictional. Chart geometry is illustrative. The review page supplies navigation around static images only.

## Validation

The release checks 36 distinct decodable PNG files, 12 per concept, three per surface, valid image/source links, matching saved hashes, and unchanged first frames. Each image was visually reviewed, including the nine targeted corrections. Browser checks cover all four surface controls, all three concept controls, page selection, comparison mode, and full-image links. Results are saved in [validation.json](validation.json).
