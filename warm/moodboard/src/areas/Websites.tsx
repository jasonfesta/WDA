import type { ReactNode } from 'react';
import { asset, type AreaProps } from '../shared';
import './websites.css';

const Arrow = () => <span aria-hidden="true">↗</span>;
const BagIcon = () => <svg aria-hidden="true" className="web-bag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 8h14l1.5 13h-17L5 8Z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg>;
const SearchIcon = () => <svg aria-hidden="true" className="web-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>;
const webAsset = (name: string) => asset(`websites/${name}.png`);

/** A live image window onto a clean photographic portion of the selected raster. */
function PhotoCrop({ file, crop, label, className = '', sourceSize = [1586, 992] }: { file: string; crop: [number, number, number, number]; label: string; className?: string; sourceSize?: [number, number] }) {
  const [x, y, width, height] = crop;
  const [sourceWidth, sourceHeight] = sourceSize;
  // A single uniform scale preserves faces, circles, and objects when the viewport changes.
  return <div className={`web-photo-crop ${className}`}><svg role="img" aria-label={label} viewBox={`${x * sourceWidth} ${y * sourceHeight} ${width * sourceWidth} ${height * sourceHeight}`} preserveAspectRatio="xMidYMid slice"><image href={file.startsWith('/') ? file : webAsset(file)} width={sourceWidth} height={sourceHeight} /></svg></div>;
}

function Panel({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  return <section className="web-detail-panel" aria-label={title}>
    <button className="web-panel-close" onClick={close} aria-label="Close details">×</button>
    <span className="web-kicker">A closer look</span><h3>{title}</h3>{children}
  </section>;
}

function Avela({ state, onState }: AreaProps) {
  const color = String(state.color || 'Oxblood');
  const bag = Number(state.bag || 0);
  const panel = String(state.panel || '');
  return <div className="web-example web-avela">
    <img className="web-full-photo" src={asset('website-layers/avela-clean-photo.png')} alt="Sculptural oxblood leather bag carried against a sunlit terracotta wall and blue coast" draggable={false} />
    <header className="web-header"><button className="avela-logo" onClick={() => onState({ panel: '' })} aria-label="Avela home">AVELA</button>
      <nav aria-label="Avela"><button onClick={() => onState({ panel: 'arc' })}>The bags</button><button onClick={() => onState({ panel: 'workshop' })}>Our workshop</button><button onClick={() => onState({ panel: 'care' })}>Care & repair</button></nav>
      <button onClick={() => onState({ panel: 'bag' })}>Bag ({bag})</button>
    </header>
    <div className="avela-story"><div className="web-kicker">Object 01 / The Arc</div><h1>A softer shape.<br />A longer story.</h1><p>Cut by hand. Carried for years.</p></div>
    <div className="avela-product"><div className="avela-swatches" aria-label="Leather colors">
      {['Oxblood', 'Clay', 'Olive'].map((name, index) => <button key={name} className={`avela-swatch swatch-${index}`} aria-label={`Select ${name} leather`} aria-pressed={color === name} onClick={() => onState({ color: name })} />)}
    </div><div className="web-kicker">{color} · Grained leather</div><button className="web-underlined" onClick={() => onState({ panel: 'arc' })}>Meet the Arc <Arrow /></button></div>
    <div className="avela-large-type" aria-hidden="true">SOFT FORM</div>
    {panel && <Panel title={panel === 'workshop' ? 'Made slowly, by hand.' : panel === 'care' ? 'A longer story.' : panel === 'bag' ? 'Your bag' : 'The Arc'} close={() => onState({ panel: '' })}>
      {panel === 'workshop' ? <p>Cut, stitched, and finished by hand. A softly folded silhouette, considered down to the last brass clasp.</p> : panel === 'care' ? <p>Wipe gently with a dry, soft cloth. Store the Arc in its dust bag, and let the leather find its own character with time.</p> : panel === 'bag' ? <><p>{bag ? `${bag} × The Arc · ${color} leather` : 'Your bag is waiting for a longer story.'}</p>{bag > 0 && <button className="web-filled-button" onClick={() => onState({ bag: 0 })}>Empty bag</button>}</> : <><p>Grained leather. Folded gussets. A quiet brass clasp.<br />Selected finish: <strong>{color}</strong></p><button className="web-filled-button" onClick={() => onState({ bag: bag + 1, panel: 'bag' })}>Add the Arc to bag <Arrow /></button></>}
    </Panel>}
  </div>;
}

function Bakery({ state, onState }: AreaProps) {
  const panel = String(state.panel || '');
  const loaf = String(state.loaf || 'Orchard sourdough');
  const reserved = Boolean(state.reserved);
  const query = String(state.search || '');
  const loaves = ['Orchard sourdough', 'Olive & rye focaccia', 'Stone-milled country loaf'];
  const details: Record<string, [string, string]> = {
    bake: ['Fresh from the oven', 'Stone-milled sourdough · Apricot morning buns · Olive & rye focaccia. Baked in small batches, every morning.'],
    orchard: ['Rooted in the orchard', 'Slow fermentation, stone-milled flour, and fruit from the trees just outside our door.'],
    visit: ['Meet us in the orchard', 'The orchard bakery opens at 06:30. Follow the stone path to the rose awning. Come early for something still warm.'],
  };
  return <div className="web-example web-bakery">
    <div className="bakery-strip">✳ <span>Fermented slowly. Shared early.</span> ✳</div>
    <header className="web-header"><button className="bakery-logo" onClick={() => onState({ panel: '' })}>Rill & Rye<small>Orchard bakery</small></button>
      <nav aria-label="Rill and Rye"><button onClick={() => onState({ panel: 'bake' })}>Today’s bake</button><button onClick={() => onState({ panel: 'orchard' })}>The orchard</button><button onClick={() => onState({ panel: 'visit' })}>Visit us</button></nav>
      <div className="bakery-header-actions"><button className="bakery-search-button" aria-label="Search the bakery" onClick={() => onState({ panel: 'search' })}><SearchIcon /></button><button className="web-outline-button" onClick={() => onState({ panel: 'reserve' })}>{reserved ? 'Your loaf is reserved ✓' : 'Collect an order'} <BagIcon /></button></div>
    </header>
    <div className="bakery-copy"><h1>The long way<br />to a good<br />morning.</h1><p>Our orchard oven wakes at six. Stone-milled sourdough, apricot buns, and something warm for the walk home.</p>
      <div className="bakery-actions"><button className="web-filled-button" onClick={() => onState({ panel: 'reserve' })}>Reserve tomorrow’s loaf <span aria-hidden="true">→</span></button><button className="web-underlined" onClick={() => onState({ panel: 'visit' })}>Find the orchard bakery <Arrow /></button></div>
      <div className="bakery-next-bake web-kicker">Next bake<br />Saturday · 06:30</div>
    </div>
    <figure className="bakery-photo"><PhotoCrop file="02-rill-and-rye-bakery" crop={[.466, .198, .518, .718]} sourceSize={[1681, 936]} label="Small orchard bakery with rose awning, copper roof, citrus trees, and a stone path" /><figcaption>Fresh from the orchard oven</figcaption></figure>
    {panel && <Panel title={panel === 'reserve' ? (reserved ? 'A good morning, reserved.' : 'Save a loaf for tomorrow.') : panel === 'search' ? 'Find something warm.' : details[panel]?.[0] || 'The orchard'} close={() => onState({ panel: '' })}>
      {panel === 'search' ? <><label className="web-field-label">Search today’s bread<input type="search" value={query} onChange={event => onState({ search: event.target.value })} placeholder="Sourdough, rye, country…" /></label><div className="bakery-search-results">{loaves.filter(name => name.toLowerCase().includes(query.toLowerCase().trim())).map(name => <button key={name} onClick={() => onState({ loaf: name, reserved: false, panel: 'reserve' })}>{name}<Arrow /></button>)}{!loaves.some(name => name.toLowerCase().includes(query.toLowerCase().trim())) && <p>No loaves match yet. Try sourdough, rye, or country.</p>}</div></> : panel === 'reserve' ? reserved ? <><p>Your {loaf.toLowerCase()} is on the list for Saturday, from 06:30.</p><button className="web-underlined" onClick={() => onState({ reserved: false })}>Change your reservation</button><p className="web-demo-note">This is a local preview reservation.</p></> : <><label className="web-field-label" htmlFor="bakery-loaf">Choose your loaf</label><select id="bakery-loaf" value={loaf} onChange={event => onState({ loaf: event.target.value })}>{loaves.map(name => <option key={name}>{name}</option>)}</select><button className="web-filled-button" onClick={() => onState({ reserved: true })}>Reserve for Saturday →</button></> : <p>{details[panel]?.[1]}</p>}
    </Panel>}
  </div>;
}

function Interiors({ state, onState }: AreaProps) {
  const detail = Number(state.detail || 0);
  const panel = String(state.panel || '');
  const views = ['The courtyard house', 'The gathering room', 'Materials for living'];
  const captions = ['Walnut, wool, and late afternoon.', 'An open door. A slower afternoon.', 'Olive velvet, warm oak, and soft wool.'];
  const info: Record<string, [string, string]> = {
    homes: ['The courtyard house', 'A home shaped around light and daily rituals. Soft seating gathers around walnut, wool, and the view into a planted courtyard.'],
    objects: ['Objects with a place', 'A walnut table. A blue ceramic vessel. A sculptural orange lamp. Pieces chosen to be lived with.'],
    notes: ['The afternoon edit', 'Let the light lead. Keep the materials honest. Leave room for the way a home changes through the day.'],
    discuss: ['Start with a room', 'Choose the space you would like to explore.'],
  };
  return <div className="web-example web-interiors">
    <div className="interiors-masthead"><header className="web-header"><button className="doorway-mark" aria-label="Room and Ritual home" onClick={() => onState({ panel: '' })}><i /><i /></button><nav aria-label="Room and Ritual"><button onClick={() => onState({ panel: 'homes' })}>Homes</button><button onClick={() => onState({ panel: 'objects' })}>Objects</button><button onClick={() => onState({ panel: 'notes' })}>Field notes</button></nav><button className="web-outline-button" onClick={() => onState({ panel: 'discuss' })}>Discuss a space <Arrow /></button></header>
      <h1 className="interiors-wordmark"><span>ROOM</span><em>&</em><span>RITUAL</span></h1>
      <div className="interiors-caption"><p>A home should hold<br />more than furniture.</p><button className="interiors-project" onClick={() => onState({ detail: (detail + 1) % 3 })}><span><span className="web-kicker">0{detail + 1} — {views[detail]}</span><em>{captions[detail]}</em></span><b aria-hidden="true">→</b></button></div>
    </div>
    <PhotoCrop file="03-room-and-ritual-interiors" crop={detail === 1 ? [.23, .40, .70, .60] : detail === 2 ? [.27, .65, .70, .35] : [0, .37, 1, .63]} label={detail === 2 ? 'Close view of olive sofa, wool cushions, and walnut table' : 'Sunlit living room with olive velvet sofa, courtyard window, walnut table, and orange lamp'} className="interiors-photo" />
    {panel && <Panel title={info[panel]?.[0] || 'Room & Ritual'} close={() => onState({ panel: '' })}><p>{info[panel]?.[1]}</p>{panel === 'discuss' && <><div className="web-choice-row">{['Living room', 'Whole home', 'A single object'].map(room => <button aria-pressed={state.room === room} key={room} onClick={() => onState({ room })}>{room}</button>)}</div>{state.room && <p className="web-inline-confirmation">A beginning: {state.room}. Explore the materials and light that make it yours.</p>}</>}</Panel>}
  </div>;
}

function Oriel({ state, onState }: AreaProps) {
  const chapter = Number(state.chapter || 0);
  const material = Number(state.material || 0);
  const panel = String(state.panel || '');
  const stories = [['An old foundry.', 'A new place to gather.'], ['Earth, oak, and light.', 'A material conversation.'], ['A quiet threshold.', 'An open invitation.'], ['Built to belong.', 'Made for the everyday.']];
  const materials = ['Rust plaster', 'Honey oak', 'Brushed brass'];
  return <div className="web-example web-oriel">
    <img className="web-full-photo" src={asset('website-layers/oriel-clean-photo.png')} alt="Rammed-earth meeting house with a monumental oval opening and warm sunlight" draggable={false} />
    <header className="web-header"><button className="oriel-logo" onClick={() => onState({ chapter: 0, panel: '' })}>ORIEL<small>Spatial practice</small></button><nav aria-label="Oriel"><button onClick={() => onState({ panel: 'projects' })}>Projects</button><button onClick={() => onState({ panel: 'approach' })}>Approach</button><button className="oriel-menu" aria-label="Open practice information" onClick={() => onState({ panel: 'approach' })}>□</button></nav></header>
    <h1 className="oriel-wordmark">oriel</h1><div className="oriel-story"><p>{stories[chapter][0]}<br />{stories[chapter][1]}</p><div className="web-kicker">Willow Hall — Culture & community</div></div>
    <div className="oriel-pagination"><span className="web-kicker">0{chapter + 1} — 04</span><div>{stories.map((_, index) => <button key={index} aria-label={`Read Willow Hall chapter ${index + 1}`} aria-pressed={chapter === index} onClick={() => onState({ chapter: index })} />)}</div></div>
    <div className="oriel-material-card"><div className="oriel-materials">{materials.map((name, index) => <button key={name} className={`oriel-material material-${index}`} aria-label={`Inspect ${name}`} aria-pressed={material === index} onClick={() => onState({ material: index })}><PhotoCrop file="04-oriel-spatial-practice" crop={[.7847 + index * .063, .7179, .0595, .108]} sourceSize={[1681, 936]} label={`${name} material sample`} /></button>)}</div><p>{material === 0 ? 'Built around belonging' : materials[material]}</p><button className="web-underlined" onClick={() => onState({ panel: 'inside' })}>Step inside <Arrow /></button></div>
    {panel && <Panel title={panel === 'approach' ? 'Built around belonging' : panel === 'inside' ? materials[material] : 'Willow Hall'} close={() => onState({ panel: '' })}><p>{panel === 'approach' ? 'We bring old spaces into new use through careful materials, generous light, and room for people to gather.' : panel === 'inside' ? ['Textured earth catches the changing light. Warm rust plaster gives the hall a sense of weight and welcome.', 'Honey-toned oak brings warmth to the meeting room, tracing the curve of the gathering space.', 'A small, luminous detail. Brushed brass carries the warmth of sunlight into the quieter corners.'][material] : 'An old foundry becomes a new place to gather. Explore four chapters of the same hall using the progress marks.'}</p></Panel>}
  </div>;
}

function Sundrop({ state, onState }: AreaProps) {
  const panel = String(state.panel || '');
  const basket = Number(state.basket || 0);
  const count = Number(state.pack || 4);
  return <div className="web-example web-sundrop">
    <header className="web-header"><button className="sundrop-logo" onClick={() => onState({ panel: '' })}>SUNDROP <span aria-hidden="true">☼</span></button><nav aria-label="Sundrop"><button onClick={() => onState({ panel: 'pour' })}>The aperitifs</button><button onClick={() => onState({ panel: 'serve' })}>How we pour</button><button onClick={() => onState({ panel: 'table' })}>Our table</button></nav><button onClick={() => onState({ panel: 'basket' })}>Your basket {basket} <BagIcon /></button></header>
    <div className="sundrop-main"><PhotoCrop file={asset('website-layers/sundrop-clean-photo.png')} crop={[0, .072, 1, .928]} label="Amber spritz in a ribbed glass, blood orange, apricots, and a coral Sundrop aperitif can" className="sundrop-photo" />
      <div className="sundrop-copy"><h1>A SLOWER SIP.<br />A BRIGHTER<br />AFTERNOON.</h1><p>Apricot, bitter orange, and a little sparkle.<br />Made for the hour you keep for yourself.</p><div className="sundrop-actions"><button className="web-filled-button" onClick={() => onState({ panel: 'pour' })}>Find your first pour</button><button className="web-underlined" onClick={() => onState({ panel: 'inside' })}>What’s inside <Arrow /></button></div><div className="sundrop-taste web-kicker">Fruit forward · Gently bitter · Ready to pour</div></div>
      <div className="sundrop-series web-kicker">The afternoon series<br /><span>01</span><i /></div>
    </div>
    {panel && <Panel title={panel === 'basket' ? 'Your afternoon basket' : panel === 'serve' ? 'The slow pour' : panel === 'table' ? 'An afternoon, shared.' : panel === 'inside' ? 'A little sunshine inside.' : 'Your first pour'} close={() => onState({ panel: '' })}>
      {panel === 'pour' ? <><p>Apricot aperitif · 200 ml · 8% alc/vol</p><div className="web-choice-row">{[4, 8, 12].map(n => <button key={n} aria-pressed={count === n} onClick={() => onState({ pack: n })}>{n} cans</button>)}</div><button className="web-filled-button" onClick={() => onState({ basket: basket + count, panel: 'basket' })}>Add {count} to your basket →</button></> : panel === 'basket' ? <><p>{basket ? `${basket} cans of apricot aperitif, ready for a slower afternoon.` : 'There’s room for a little sunshine.'}</p>{basket > 0 && <button className="web-underlined" onClick={() => onState({ basket: 0 })}>Clear basket</button>}</> : <p>{panel === 'inside' ? 'Apricot, bitter orange, and a little sparkle. Fruit forward, gently bitter, ready to pour.' : panel === 'serve' ? 'Chill well. Pour over a little ice. Finish with a thin slice of blood orange. Find a sunny spot.' : 'A few friends, something to share, and all the time in the afternoon. Pull up a chair.'}</p>}
    </Panel>}
  </div>;
}

function Serein({ state, onState }: AreaProps) {
  const panel = String(state.panel || '');
  const step = Number(state.step || 0);
  const bag = Number(state.bag || 0);
  const steps = ['Cleanse', 'Nourish', 'Pause'];
  const descriptions = ['Soft textures. Botanical oils.\nA quieter moment at the sink.', 'A few drops, warmed in your hands.\nA soft finish for every day.', 'Take a breath. Let it settle.\nA little moment, just for you.'];
  return <div className="web-example web-serein">
    <header className="web-header"><button className="serein-logo" onClick={() => onState({ panel: '', step: 0 })}>SEREIN</button><nav aria-label="Serein"><button onClick={() => onState({ panel: 'ritual' })}>The daily ritual</button><button onClick={() => onState({ panel: 'ingredients' })}>Ingredients</button><button onClick={() => onState({ panel: 'approach' })}>Our approach</button><button onClick={() => onState({ panel: 'bag' })}>Bag ({bag})</button></nav></header>
    <div className="serein-main"><div className="serein-copy"><h1>A little care,<br /><em>every day.</em></h1><p>{descriptions[step]}</p><button className="web-filled-button" onClick={() => onState({ panel: 'ritual' })}>Build your daily ritual <span aria-hidden="true">→</span></button><span className="serein-product-caption">— &nbsp; Daily Oil · A soft finish</span></div>
      <PhotoCrop file="06-serein-botanical-care" crop={[.365, .068, .164, .85]} label="Macro botanical photograph of oil drops on an olive leaf" className="serein-botanical" />
      <PhotoCrop file="06-serein-botanical-care" crop={[.53, .068, .47, .85]} label="Woman with warm brown skin applying botanical oil to her cheek" className="serein-portrait" />
      <PhotoCrop file="06-serein-botanical-care" crop={[.243, .526, .172, .354]} label="Serein Daily Oil amber glass bottle with sculptural coral pump" className="serein-bottle" />
    </div>
    <div className="serein-steps" aria-label="Daily ritual steps">{steps.map((name, index) => <button key={name} aria-pressed={step === index} onClick={() => onState({ step: index })}><span>0{index + 1}</span><i>/</i>{name}<b /></button>)}</div>
    {panel && <Panel title={panel === 'ritual' ? 'Three small moments.' : panel === 'ingredients' ? 'Botanical by nature.' : panel === 'bag' ? 'Your daily care' : 'A quieter approach.'} close={() => onState({ panel: '' })}>
      {panel === 'ritual' ? <><p>Cleanse gently. Nourish with Daily Oil. Take a moment to pause.</p><div className="web-choice-row">{steps.map((name, index) => <button key={name} aria-pressed={step === index} onClick={() => onState({ step: index })}>{name}</button>)}</div><button className="web-filled-button" onClick={() => onState({ bag: bag + 1, panel: 'bag' })}>Add Daily Oil to bag →</button></> : panel === 'bag' ? <><p>{bag ? `${bag} × Daily Oil · 30 ml` : 'Your next small ritual starts here.'}</p>{bag > 0 && <button className="web-underlined" onClick={() => onState({ bag: 0 })}>Empty bag</button>}</> : <p>{panel === 'ingredients' ? 'Botanical oils and soft textures, brought together for a simple daily ritual. A few drops are all you need.' : 'Care can be simple. A quiet shelf, a few considered essentials, and a moment at the sink each day.'}</p>}
    </Panel>}
  </div>;
}

export default function Websites(props: AreaProps) {
  switch (props.id) {
    case 'REF-001': return <Avela {...props} />;
    case 'REF-002': return <Bakery {...props} />;
    case 'REF-003': return <Interiors {...props} />;
    case 'REF-004': return <Oriel {...props} />;
    case 'REF-005': return <Sundrop {...props} />;
    case 'REF-006': return <Serein {...props} />;
    default: return null;
  }
}
