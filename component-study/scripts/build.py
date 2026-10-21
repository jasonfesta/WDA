#!/usr/bin/env python3
"""Build the WDA component reviews and Markdown handoff from structured content."""
from pathlib import Path
import html,json
R=Path(__file__).resolve().parents[1]
C=json.loads((R/'data/components.json').read_text());S=json.loads((R/'data/references.json').read_text());BY={x['id']:x for x in S};E=html.escape

def write(path,text): (R/path).write_text(text.rstrip()+'\n')
def link(url,label,cls=''):return f'<a href="{E(url)}" class="{cls}">{E(label)}</a>'
def image(a,alt,loading='lazy'):return f'<img src="{E(a["file"])}" width="{a["dimensions"][0]}" height="{a["dimensions"][1]}" alt="{E(alt)}" loading="{loading}">'
def relasset(a,prefix='../'):return dict(a,file=prefix+a['file'])
def shell(title,body,prefix='',data=None):
 script=''
 if data:
  payload=json.dumps(data).replace('</','<'+chr(92)+'/')
  script=f'<script id="review-data" type="application/json">{payload}</script><script src="{prefix}study.js" defer></script>'
 return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="author" content="Jason Festa"><meta name="description" content="Six WDA components, thirty designed interaction states, prompts, references and implementation ledgers."><title>{E(title)} · WDA</title><link rel="stylesheet" href="{prefix}style.css"></head><body><a class="skip" href="#main">Skip to content</a><header class="top"><a class="brand" href="{prefix}index.html">WDA <span>/ Component study</span></a><span>Jason Festa · October 2026</span></header><main id="main">{body}</main><footer><span>WDA / Jason Festa</span><nav aria-label="Study resources">{link(prefix+'index.html','Components')}{link(prefix+'research.html','Research & ledgers')}{link('https://github.com/jasonfesta/WDA/tree/main/component-study','GitHub ↗')}</nav></footer>{script}</body></html>'''
def md_sources(c):return '\n'.join(f'- [{BY[i]["title"]}]({BY[i]["url"]}) — {BY[i]["application"]}' for i in c['sources'])
def sources_html(c):return '<ul class="source-list">'+''.join(f'<li>{link(BY[i]["url"],BY[i]["title"]+" ↗")}<p>{E(BY[i]["observed"])}</p><p><strong>Applied here.</strong> {E(BY[i]["application"])}</p></li>' for i in c['sources'])+'</ul>'
def actions_html(s):return ''.join(f'<button class="button flow-action" data-target="{E(a["target"])}" title="{E(a["note"])}">{E(a["label"])} →</button><span class="flow-note">{E(a["note"])}</span>' for a in s['actions'])
def state_notes(c,s):return f'<p class="eyebrow">{c["slug"]} / {s["id"]}</p><h3>{E(s["title"])}</h3><dl><dt>Entry</dt><dd>{E(s["entry"])}</dd><dt>On screen</dt><dd>{E(s["visible"])}</dd><dt>Exit / return</dt><dd>{E(s["exit"])}</dd></dl><p class="eyebrow action-label">Follow a path</p><div class="flow-actions">{actions_html(s)}</div>'
def control_notes(c,x):
 d=''.join(f'<dt>{label}</dt><dd>{E(x[key])}</dd>' for key,label in [('action','Activation'),('rollover','Rollover'),('press','Touch / press'),('keyboard','Keyboard / focus'),('result','Result / return')])
 refs=''.join(f'<button class="button" data-related-state="{sid}">{E(next(s["title"] for s in c["states"] if s["id"]==sid))} ↗</button>' for sid in x['states'])
 return f'<p class="eyebrow">{c["slug"]}-{x["id"]}</p><h3>{E(x["label"])}</h3><dl>{d}</dl><p class="eyebrow action-label">Related state images</p><div class="actions">{refs}</div>'
summary=[]
for c in C:
 slug=c['slug'];name=c['name'];states=c['states'];first=states[0]
 for s in states:s['prompt_text']=(R/s['prompt']).read_text()
 state_md=''
 for s in states:
  paths='\n'.join(f'- **{a["label"]}** → [{a["target"]}](#{a["target"]}). {a["note"]}' for a in s['actions'])
  state_md+=f'''\n<a id="{s['id']}"></a>\n## {s['id']} / {s['title']}

![{name}: {s['title']}](../{s['image']['file']})

[Exact image prompt](../{s['prompt']}) · [Attached visual reference](../{s['reference']})

- **Entry:** {s['entry']}
- **Visible:** {s['visible']}
- **Exit / return:** {s['exit']}

{paths}
'''
 controlmd=''
 for x in c['controls']:
  controlmd+=f"\n### {slug}-{x['id']} / {x['label']}\n\nScope: {x['scope']} · {x['instances']} element instances\n\n"+'\n'.join(f'- **{label}:** {x[k]}' for k,label in [('action','Activation'),('rollover','Rollover'),('press','Touch / press'),('keyboard','Keyboard / focus'),('result','Result / return')])+f"\n\nRelated images: "+', '.join(f'[{sid}](#{sid})' for sid in x['states'])+'.\n'
 branches='\n'.join('- '+v for v in c['branches'])
 common='\n\n'.join(c['common'].values())
 ledger=f'''# {name} / Interaction ledger

WDA / Jason Festa · 21 October 2026

[Visual review](../reviews/{slug}.html) · [React prompt](../prompts/interaction/{slug}.md) · [Motion prompt](../prompts/motion/{slug}.md)

Five rendered states of the same component. Review order is an index; the action paths below define the actual transitions. Supporting loading, data and host-route branches are specified after the images.

{state_md}
## Every control
{controlmd}
## Descriptive regions

{c['descriptive']}

## Supporting branches and all return paths

{branches}

## Rollover, motion and extraction

{c['motion']}

{c['assets']}

## Scroll, touch and accessibility

{common}

## React translation

{c['react']}

{chr(10).join('- '+v for v in c['invariants'])}

## Alternative layout

{c['alternative']}

## Build references

{md_sources(c)}
'''
 write(Path('interaction')/(slug+'.md'),ledger)
 prompt=f'''# {name} / Interaction implementation prompt

WDA / Jason Festa · 21 October 2026

Build the {c['type'].lower()} using the [five-state ledger](../../interaction/{slug}.md), [original artwork](../../{c['original']['file']}) and exact state images linked below. Implement working DOM controls; raster text is a visual reference, not an interactive layer.

## Art direction

{c['direction']}

{c['font']}

## Screens and transitions

{chr(10).join('- **'+s['id']+' / '+s['title']+'** — [image](../../'+s['image']['file']+'). '+s['visible'] for s in states)}

{branches}

## State ownership

{c['react']}

Use [fixtures.json](../../data/fixtures.json) for deterministic study data. Replace fixtures with verified host data before production. Derive labels, counts and active treatments from one source of truth. Ignore late responses using request IDs or cancellation. Separate attempted values from confirmed values where saves can fail.

## Controls

{chr(10).join('- '+x['label']+': '+x['action']+' '+x['result'] for x in c['controls'])}

{c['descriptive']}

## Input and motion

{common}

{c['motion']}

## Acceptance

{chr(10).join('- '+v for v in c['invariants'])}

Read the ledger for the per-control rollover, press, focus, loading, cancel, retry and return behavior. Every supporting overlay has an explicit close route; every external request has pending, error and retry handling. Keep all reference pixels separate from the working UI.

## References

{md_sources(c)}
'''
 write(Path('prompts/interaction')/(slug+'.md'),prompt)
 motion=f'''# {name} / Asset and motion prompt

WDA / Jason Festa · 21 October 2026

Use the [original reference](../../{c['original']['file']}) and [five rendered states](../../interaction/{slug}.md) to prepare separate decorative assets. This is a production brief; new animation, cutouts and meshes are not included.

{c['assets']}

{c['motion']}

{c['common']['reduced_motion']}

{c['common']['scroll']}

Keep labels, focus rings, selection rings, counters and buttons live in the DOM. Use matched camera, light, material identity and baseline across extracted/reconstructed objects. A raster cannot supply a true 3D mesh; reconstruct and compare before delivery. Decorative layers do not capture pointer events. Preserve the same result for hover, keyboard and touch.

## References

{md_sources(c)}
'''
 write(Path('prompts/motion')/(slug+'.md'),motion)
 write(Path('reviews')/(slug+'.md'),f'''# {name} / {c['type']}

WDA / Jason Festa · 21 October 2026

{c['intro']}

{c['direction']}

[Interactive review]({slug}.html) · [Complete control and flow ledger](../interaction/{slug}.md) · [React prompt](../prompts/interaction/{slug}.md) · [Motion brief](../prompts/motion/{slug}.md)

{state_md}
## Original authority

![Original {name}](../{c['original']['file']})

[Original saved prompt](../{c['prompt']}) · [Historical supplied screenshot](../{c['source_image']['file']})

## References

{md_sources(c)}

## Supporting states

The [interaction ledger](../interaction/{slug}.md) specifies data permutations, loading, failure, cancellation, host routes and return paths beyond the five illustrated states. Earlier contextual brands are separate historical alternatives in the [archive]({c['archive_url']}).
''')
 thumbs=''.join(f'<button class="state-button" data-state="{i}" aria-pressed="{str(i==0).lower()}" aria-controls="state-result"><span class="thumb-art">{image(relasset(s["image"]),name+" / "+s["title"])}</span><span>0{i+1} / {E(s["title"])}</span></button>' for i,s in enumerate(states))
 controls=''.join(f'<button class="control-button" data-control="{i}" aria-pressed="{str(i==0).lower()}">{E(x["label"])}<span>{slug}-{x["id"]} · {E(x["scope"])}</span></button>' for i,x in enumerate(c['controls']))
 body=f'''<section class="review-hero"><a class="back" href="../index.html#{slug}">← All six components</a><p class="eyebrow">{E(c['type'])} / Five interaction states</p><h1>{name}<span class="period">.</span></h1><p class="lede">{E(c['intro'])}</p><div class="actions">{link('#behavior','Explore five states','button dark')}{link('../interaction/'+slug+'.md','Interaction ledger MD','button')}{link('../prompts/interaction/'+slug+'.md','React prompt','button')}{link('#references','Sources & original','button')}</div></section>
<section id="behavior" class="section state-section"><div class="section-heading"><div><p class="eyebrow">01 / Designed states</p><h2>Every change, in view.</h2></div><p>Choose a state or follow an action below. Image, prompt and reference stay paired. These are designed screens with a review flow, ready for implementation.</p></div><div class="state-tabs visual-tabs" aria-label="Five designed states">{thumbs}</div><div class="state-workbench {slug}"><figure class="state-visual"><a id="state-image-link" href="../{first['image']['file']}">{image(relasset(first['image']),name+' / '+first['title'],'eager').replace('<img ','<img id="state-image" ')}</a><figcaption id="state-caption">01 / {E(first['title'])} · {first['image']['dimensions'][0]} × {first['image']['dimensions'][1]}</figcaption><div class="sequence-nav"><button class="button" id="previous-state" disabled>← Previous image</button><span id="state-count">1 / 5</span><button class="button" id="next-state">Next image →</button></div></figure><article id="state-result" class="state-result" aria-live="polite">{state_notes(c,first)}</article></div><div class="state-links actions">{link('../'+first['prompt'],'Exact image prompt ↗','button') .replace('<a ','<a id="state-prompt-link" ')}{link('../'+first['reference'],'Attached visual reference ↗','button').replace('<a ','<a id="state-reference-link" ')}{link('../interaction/'+slug+'.md#'+first['id'],'State ledger ↗','button').replace('<a ','<a id="state-ledger-link" ')}</div><details class="prompt-details"><summary>Read the selected state’s exact image prompt</summary><pre id="state-prompt-text">{E(first['prompt_text'])}</pre></details><p class="small review-caveat">Flow buttons simulate the documented paths. The raster controls are not production UI; host requests, checkout and routing are not connected.</p></section>
<section class="section" id="controls"><div class="section-heading"><div><p class="eyebrow">02 / Control-by-control handoff</p><h2>The detail behind the action.</h2></div><p>Rollover, touch, keyboard, result and return. Every control links back to the relevant state imagery.</p></div><div class="control-layout"><div class="control-list">{controls}</div><article id="control-result" class="control-result" aria-live="polite">{control_notes(c,c['controls'][0])}</article></div><div class="alternative"><p class="eyebrow">Descriptive regions</p><p>{E(c['descriptive'])}</p></div></section>
<section class="section"><div class="section-heading"><div><p class="eyebrow">03 / End-to-end branches</p><h2>And the ways back.</h2></div><p>Five images establish the visual grammar. These contracts cover the remaining data combinations and host-owned routes.</p></div><ol class="branch-list">{''.join('<li>'+E(v)+'</li>' for v in c['branches'])}</ol><div class="notes-grid"><article><h3>Motion direction</h3><p>{E(c['motion'])}</p>{link('../prompts/motion/'+slug+'.md','Asset & motion prompt ↗')}</article><article><h3>React translation</h3><p>{E(c['react'])}</p>{link('../prompts/interaction/'+slug+'.md','Implementation prompt ↗')}</article><article><h3>Assets to prepare</h3><p>{E(c['assets'])}</p><p class="small">Extraction and reconstruction brief. Animation and 3D meshes remain implementation work.</p></article><article><h3>Focus, scroll & reduced motion</h3><p>{E(c['common']['focus'])}</p><p>{E(c['common']['scroll'])}</p><p>{E(c['common']['reduced_motion'])}</p></article></div><div class="checks"><p class="eyebrow">Acceptance checks</p><ul>{''.join('<li>'+E(v)+'</li>' for v in c['invariants'])}</ul></div></section>
<section class="section" id="references"><div class="section-heading"><div><p class="eyebrow">04 / Original direction & references</p><h2>Same component. Same character.</h2></div></div><div class="original-section"><figure class="original-stage"><a href="../{c['original']['file']}">{image(relasset(c['original']),name+' original artwork')}</a><figcaption>Original concept · unchanged source pixels</figcaption></figure><div class="art-notes"><h3>{E(c['tagline'])}</h3><p>{E(c['direction'])}</p><p class="small">{E(c['font'])}</p>{link('../'+c['prompt'],'Original saved prompt ↗')}{link('../'+c['source_image']['file'],'Historical supplied screenshot ↗')}<p class="small">The historical screenshot documents inspiration. The original handoff does not retain a verified per-call attachment list. New states record their actual attached references.</p></div></div>{sources_html(c)}<details class="prompt-details"><summary>Read the original image prompt</summary><pre>{E((R/c['prompt']).read_text())}</pre></details><details class="prompt-details"><summary>Read the interaction implementation prompt</summary><pre>{E(prompt)}</pre></details><div class="alternative"><p class="eyebrow">Alternative layout</p><p>{E(c['alternative'])}</p></div><p class="small archive-note">Earlier contextual brands: {E(', '.join(c['archive_brands']))}. {link(c['archive_url'],'Download historical archive ↗')} They are separate alternatives, not the five states above.</p><div class="actions">{link('../reviews/'+slug+'.md','Review MD','button')}{link('../interaction/'+slug+'.md','Complete ledger MD','button')}{link('../research.html','Research & downloads','button')}</div></section>'''
 write(Path('reviews')/(slug+'.html'),shell(name+' / Five states',body,'../',c))
 summary.append(f'| {name} | {c["type"]} | [Review](reviews/{slug}.html) | [Ledger](interaction/{slug}.md) | [React prompt](prompts/interaction/{slug}.md) |')
# Overview: five actual states of each original, immediately visible together.
rows=''
for i,c in enumerate(C):
 tiles=''.join(f'<figure><a href="reviews/{c["slug"]}.html#{s["id"]}">{image(s["image"],c["name"]+" / "+s["title"],"eager" if i==0 else "lazy")}</a><figcaption><span>0{k+1}</span> {link("reviews/"+c["slug"]+".html#"+s["id"],s["title"])}</figcaption></figure>' for k,s in enumerate(c['states']))
 rows+=f'<article class="component-row {c["family"]}" id="{c["slug"]}"><div class="row-heading"><div><p class="eyebrow">0{i+1} / {E(c["type"])}</p><h2>{link("reviews/"+c["slug"]+".html",c["name"])}</h2></div><p>{E(c["tagline"])}</p><div class="actions">{link("reviews/"+c["slug"]+".html","Review five states ↗","button dark")}{link("interaction/"+c["slug"]+".md","Interaction MD","button")}</div></div><div class="state-strip">{tiles}</div></article>'
body=f'''<section class="hero"><p class="eyebrow">WDA / Study 03</p><h1>Small surfaces.<br><em>Every state considered.</em></h1><div class="hero-bottom"><p>Six original components, each designed across five interaction states. The images, actions, references and build notes, together in one review.</p><div class="metric"><b>06 <span>/</span> 30</b><span>Components / designed state images</span></div></div><div class="actions">{link('#collection','Explore the collection','button dark')}{link('research.html','Research & handoff','button')}{link('downloads/component-study.zip','Download full study ↓','button')}</div></section><nav class="component-nav" aria-label="Components">{''.join(link('#'+c['slug'],c['name']) for c in C)}</nav><section id="collection" class="state-collection">{rows}</section><section class="closing"><p class="eyebrow">From artwork to implementation</p><h2>The behavior belongs<br>with the image.</h2><p>Every state has its own image prompt and attached visual reference. Each component has a directed action flow, control ledger, rollover and keyboard notes, motion brief and React implementation prompt.</p><div class="actions">{link('downloads/component-study-images.zip','30 state images ↓','button dark')}{link('downloads/component-study-reference-pack.zip','Prompts & references ↓','button')}{link('research.html','Research and checks ↗','button')}</div><p class="small">Designed state images and an interactive review. Live service integrations, production components and animation assets follow the documented handoff.</p></section>'''
write(Path('index.html'),shell('Component study',body))
# Preserve and refine the shared implementation contract.
handoff=(R/'interaction/react-handoff.md').read_text().replace('Do not ship invented endpoint URLs or business prices.','Use deterministic study fixtures locally; production requires verified endpoints and business prices.').replace('The original image canvases intentionally retain their source presentation margins; those margins are not an implementation requirement.','Image canvases preserve natural silhouettes and raster aspect ratios. Presentation margins are not an implementation requirement. A closed picker has a shorter natural footprint than its open state.')
handoff=handoff.split('\n## Illustrated state mapping')[0]
handoff+='\n## Illustrated state mapping\n\nThe thirty state records in [components.json](../data/components.json) map each image to its prompt, actual visual reference and directed actions. Review buttons simulate those actions; they are not a live payment or data service. [fixtures.json](../data/fixtures.json) defines proposed weather, plan and usage values. Daily raster heights are illustrative; render production charts from numeric arrays and provide accessible data tables.\n\nRoam adds proposed Weekender $12 and Worldwide $48 design fixtures alongside the original Everyday $24. They are not live offers. Confirmation is gated by verified checkout completion.\n'
write(Path('interaction/react-handoff.md'),handoff)
research='''# WDA / Component research and provenance

Jason Festa · 21 October 2026

## Scope and provenance

Six original components now have five rendered states each: thirty individual images, thirty exact generation prompts, one saved correction prompt, six control ledgers and six React/motion handoffs. The original artwork is the visual authority. State 01 attaches the original; states 02–05 attach the locked state-01 render. [Render ledger](../data/state-render-plan.json) records the actual paths. [Asset ledger](../data/assets.json) records native dimensions, byte lengths and SHA-256 hashes.

The original six image bytes remain unchanged in references/originals. Five historical supplied screenshots are in references/screenshots; Gather and Courtyard share one. The original handoff does not preserve a verified per-call attachment list, so those screenshots are labelled historical inspiration. No new source attribution is inferred.

Thirty older branded contextual alternatives and twenty correction inputs are preserved in a separate historical archive. They are not the new interaction states. Storycircle had a three-avatar/two-reader mismatch; Plotcrew omitted an overflow count for four people. These older issues are not promoted as approved behavior.

## Decisions from the research

- Folio uses four real route destinations and one independent keyboard-focus state. Its active marker follows committed route state, not hover or focus.
- Gather uses native checkboxes and a controlled popover. Counts, checkmarks and avatars derive from one selected-ID set; save errors preserve attempted versus confirmed values.
- Courtyard uses radios for one selected material. Shuffle and Undo store/restore the complete palette plus selected ID. The illustrated Undo branch starts with Moss.
- Sol separates canonical temperatures from display units and preserves truthful cached data after a refresh failure.
- Roam’s original Everyday $24 is joined by proposed Weekender $12 and Worldwide $48 study fixtures. All production pricing requires a verified catalogue. A confirmation image is a verified-completion state, not the automatic result of pressing Continue.
- Kiln distinguishes category shares of used credits from capacity shares of the allowance. Its weekly 6,600 difference is not remaining spendable balance. Chart text and fixture arrays define the values; raster segment lengths and daily bars are illustrative. A targeted correction shortened the Week capacity bar; its before-image and exact edit prompt remain packaged.
- Natural wide/shallow and tall silhouettes are preserved. The reviews never crop controls or stretch the PNGs. Closed Gather uses its natural smaller footprint.

## Implementation boundary

The review is a static design study with an interactive state/action explorer. It does not perform purchases, fetch forecasts, persist people selections or implement host routes. All remaining data combinations, loading, failures, retry, cancellation, focus return and route ownership are documented in each ledger. Motion, object extraction and 3D reconstruction are briefs for the later build.

## Official references read on 21 October 2026

Documentation and build examples inform the behavior; they are not popularity rankings or claims of a hands-on audit of live products. Each application is a WDA design decision. No remote imagery or third-party source code was copied into this package.

'''
for r in S:research+=f'### {r["title"]}\n\n[Official reference]({r["url"]})\n\nObserved: {r["observed"]}\n\nApplied: {r["application"]}\n\n'
write(Path('research/README.md'),research)
entries=sum(len(c['controls']) for c in C)
readme=f'''# WDA / Component study

Jason Festa · 21 October 2026

**Six components. Five designed states each. Thirty state images.** Sol, Gather, Courtyard, Roam, Kiln and Folio retain their original art direction while showing their interaction states.

[Open the review](index.html) · [Research](research.html) · [30 images](downloads/component-study-images.zip) · [Reference pack](downloads/component-study-reference-pack.zip) · [Complete study](downloads/component-study.zip)

| Component | Family | Visual review | Interaction ledger | Build prompt |
| --- | --- | --- | --- | --- |
{chr(10).join(summary)}

Each review synchronizes the selected image, exact image prompt, actual visual reference and state ledger. Directed flow actions simulate transitions. {entries} control groups document activation, rollover, press, keyboard, result and return behavior. Supporting states cover loading, failure, cancellation, data variants and host routes beyond the five rendered images.

## Package structure

- `images/states/` — exactly thirty individual state PNGs, five per component; no historical variants mixed into this image download.
- `references/originals/` — six unchanged original concepts.
- `references/screenshots/` — five supplied historical screenshots.
- `references/corrections/` — exact input for the Kiln Week bar correction.
- `prompts/states/` — thirty exact prompts and one applied correction; reference attachments are explicitly recorded.
- `prompts/originals/` — six original saved prompts.
- `prompts/interaction/`, `prompts/motion/`, `interaction/` — behavior, flow, extraction and React handoff.
- `data/` — state mapping, sources, asset hashes and deterministic proposed fixtures.
- `reviews/` — six visual reviews and matching Markdown documents with all five images.
- `downloads/` — core, imagery, reference and separate historical-context archives.

## Design fixtures and limitations

The complete visual/interaction study is ready for review. Production components, live integrations and motion assets are future implementation work. Roam’s Weekender $12 and Worldwide $48 are proposed design fixtures alongside the original Everyday $24, not live pricing. Kiln’s raster charts are illustrative; numeric fixtures govern the eventual DOM/SVG charts. Every image is displayed at its native ratio. Closed Gather naturally differs in canvas shape from its open states.

## Historical contexts

[Download the separate earlier-context archive](https://github.com/jasonfesta/WDA/raw/refs/heads/main/component-study/downloads/component-context-archive.zip). It preserves thirty earlier brand variations, six originals, five historical screenshots, thirty saved prompt documents and twenty correction inputs. These are alternatives, not the thirty interaction screens. Keeping them separate makes the main image folder unambiguous.

## Open and rebuild

Extract the complete ZIP and open `index.html`, or run `python3 -m http.server 5187` from this directory. The review uses local HTML, CSS and JavaScript, with no external font or script dependency. Official reference links require internet access.

Run `python3 scripts/build.py` after content edits, then `python3 scripts/package.py` to validate and rebuild downloads. The complete archive omits nested ZIPs; rerunning the package script recreates its three core downloads. The historical archive is downloaded separately and never mixed into the core package.

Published under [Jason Festa’s WDA](https://github.com/jasonfesta/WDA/tree/main/component-study).
'''
write(Path('README.md'),readme)
ledgers=''.join(f'<article><p class="eyebrow">{E(c["type"])}</p><h3>{c["name"]}</h3>{link("reviews/"+c["slug"]+".html","Five-state review ↗")}{link("interaction/"+c["slug"]+".md","Interaction ledger MD ↗")}{link("prompts/interaction/"+c["slug"]+".md","React prompt ↗")}{link("prompts/motion/"+c["slug"]+".md","Motion & extraction ↗")}</article>' for c in C)
refs=''.join(f'<article>{link(r["url"],r["title"]+" ↗")}<p>{E(r["observed"])}</p><p>{E(r["application"])}</p></article>' for r in S)
body=f'''<section class="review-hero"><a class="back" href="index.html">← Components</a><p class="eyebrow">WDA / Research & handoff</p><h1>The thinking<br><em>behind the surface.</em></h1><p class="lede">Thirty states, their exact prompts and references, and the interaction contracts that carry six original components into a build.</p><div class="actions">{link('downloads/component-study-images.zip','30 images ↓','button dark')}{link('downloads/component-study-reference-pack.zip','Reference pack ↓','button')}{link('downloads/component-study.zip','Complete study ↓','button')}</div></section><section class="section"><div class="section-heading"><h2>Six complete review files.</h2><p>30 state images · {entries} control groups · {len(S)} primary references</p></div><div class="ledger-grid">{ledgers}</div></section><section class="section"><h2>The record stays with the work.</h2><div class="notes-grid"><article><h3>Image provenance</h3><p>Six original concepts and five historical screenshots preserved. Each new state records its actual attached reference and exact prompt. Kiln’s Week bar correction retains its exact input.</p>{link('data/state-render-plan.json','Render ledger ↗')}{link('data/assets.json','Asset hashes & dimensions ↗')}</article><article><h3>Design fixtures</h3><p>Weather, pricing and usage values are explicit study data. The host supplies verified production data. Charts must be rebuilt from numeric arrays; raster lengths are illustrative.</p>{link('data/fixtures.json','Fixture data ↗')}{link('research/README.md','Research findings & provenance ↗')}</article><article><h3>From study to React</h3><p>Live controls, derived counts and active states, focus return, keyboard parity, loading, retry, cancel and host-route contracts.</p>{link('interaction/react-handoff.md','Shared React handoff ↗')}</article><article><h3>Review checks</h3><p>Thirty state/image/prompt pairs, directed action targets, image hashes, file links and browser interactions.</p>{link('validation.json','Package validation ↗')}{link('browser-checks.json','Browser checks ↗')}</article></div></section><section class="section"><p class="eyebrow">Official references / Read 21 October 2026</p><h2>Patterns to build from.</h2><div class="source-grid">{refs}</div></section><section class="closing"><h2>Earlier context, preserved.</h2><p>The thirty older branded variations are a separate historical archive. The main study and image download contain the five new states of each original component.</p>{link('https://github.com/jasonfesta/WDA/raw/refs/heads/main/component-study/downloads/component-context-archive.zip','Download historical archive ↗','button')}</section>'''
write(Path('research.html'),shell('Research & handoff',body))
print('Built eight HTML pages and all Markdown handoffs for thirty states.')
