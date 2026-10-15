import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowUpRight, ArrowLeft, ArrowRight, Box, Scan } from 'lucide-react';
import Websites from './areas/Websites';
import Interfaces from './areas/Interfaces';
import Header from './Header';
import data from './registry.json';
import { baseline, themes, themeStyle } from './theme';
import type { AreaProps, ExampleState, Knobs, Typeface } from './shared';
const MaterialScene=lazy(()=>import('./areas/MaterialScene'));
type Entry=typeof data[number];
const leadIds=['REF-001','REF-007','REF-025','REF-014','REF-002','REF-009','REF-031','REF-019','REF-008','REF-029'];
const kindLabel: Record<string,string>={website:'Website',component:'Component',mobile:'Mobile',texture:'Texture',object:'Object render',webgl:'Interactive 3D'};
function readSaved(): {knobs:Knobs;states:Record<string,ExampleState>;recolorImages:boolean;typeface:Typeface} {
  try {
    const v=JSON.parse(localStorage.getItem('warm-explorer-v1')||'{}');
    return {knobs:{hue:Math.max(-20,Math.min(20,Number(v.knobs?.hue)||0)),warmth:Math.max(-30,Math.min(30,Number(v.knobs?.warmth)||0)),depth:Math.max(-25,Math.min(25,Number(v.knobs?.depth)||0))},states:v.states&&typeof v.states==='object'?v.states:{},recolorImages:v.recolorImages!==false,typeface:['sans','serif','mono'].includes(v.typeface)?v.typeface:'original'};
  } catch {return {knobs:baseline,states:{},recolorImages:true,typeface:'original'};}
}
function Scaled({width,height,children,className=''}:{width:number;height:number;children:ReactNode;className?:string}) {
  const ref=useRef<HTMLDivElement>(null);const [scale,setScale]=useState(1);
  useLayoutEffect(()=>{if(!ref.current)return;const node=ref.current;const update=()=>setScale(node.clientWidth/width);update();const ro=new ResizeObserver(update);ro.observe(node);return ()=>ro.disconnect();},[width]);
  return <div ref={ref} className={`scaled-frame ${className}`} style={{aspectRatio:`${width}/${height}`}}><div className="scaled-content" style={{width,height,transform:`scale(${scale})`}}>{children}</div></div>;
}
function Headline({focused=false}:{focused?:boolean}) {return <div className={`floating-headline ${focused?'large':''}`}><h1>Build me a warm<br/>landing page.</h1></div>;}
function Specimen({entry}:AreaProps&{entry:Entry}) {
  return <div className={`specimen ${entry.kind==='object'?'object-specimen':'texture-specimen'}`}><img src={entry.image} alt={entry.title} loading="lazy" draggable={false} style={{filter:'var(--photo-filter)'}}/></div>;
}
function HoverScene({entry,...props}:AreaProps&{entry:Entry}) {
  const [hovered,setHovered]=useState(false);
  const [engaged,setEngaged]=useState(false);
  const poster=<div className="scene-poster"><img src={entry.image} alt={entry.title} loading="lazy" style={{filter:'var(--photo-filter)'}}/><span><Box size={14}/> Drag to explore</span></div>;
  return <div className="scene-preview" tabIndex={0} aria-label={`Interact with ${entry.title}`} onPointerEnter={()=>setHovered(true)} onPointerLeave={()=>setHovered(false)} onFocus={()=>setEngaged(true)} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))setEngaged(false);}}>
    {hovered||engaged?<Suspense fallback={poster}><MaterialScene {...props}/></Suspense>:poster}
  </div>;
}
function Example({entry,...props}:AreaProps&{entry:Entry}) {
  if(entry.kind==='website')return <Websites {...props}/>;
  if(entry.kind==='component'||entry.kind==='mobile')return <Interfaces {...props}/>;
  if(entry.kind==='webgl')return props.focused?<Suspense fallback={<div className="scene-loading">Preparing the material study…</div>}><MaterialScene {...props}/></Suspense>:<HoverScene entry={entry} {...props}/>;
  return <Specimen entry={entry} {...props}/>;
}
export default function App() {
  const [saved]=useState(readSaved);const [knobs,setKnobs]=useState(saved.knobs);const [states,setStates]=useState(saved.states);
  const [recolorImages,setRecolorImages]=useState(saved.recolorImages);const [typeface,setTypeface]=useState<Typeface>(saved.typeface);
  const liveKnobs=knobs;const gradeImages=recolorImages;
  useEffect(()=>setKnobs(current=>Math.abs(current.hue)>20?{...current,hue:Math.max(-20,Math.min(20,current.hue))}:current),[]);
  const [theme,setTheme]=useState<number|null>(null);const [selected,setSelected]=useState<string|null>(()=>(location.hash==='#headline'||data.some(e=>e.id===location.hash.slice(1)))?location.hash.slice(1):null);
  const [showSource,setShowSource]=useState(false);
  const scroll=useRef(0);const selectedTitle=useRef<HTMLHeadingElement>(null);const lastSelection=useRef('');
  const active=data.find(e=>e.id===selected);const tone=active?.theme??theme??6;
  useEffect(()=>{try{localStorage.setItem('warm-explorer-v1',JSON.stringify({knobs,states,recolorImages,typeface}));}catch{/* In-memory controls still work when storage is unavailable. */}},[knobs,states,recolorImages,typeface]);
  useEffect(()=>{const handle=()=>{setSelected((location.hash==='#headline'||data.some(e=>e.id===location.hash.slice(1)))?location.hash.slice(1):null);setShowSource(false);};window.addEventListener('hashchange',handle);return ()=>window.removeEventListener('hashchange',handle);},[]);
  useEffect(()=>{if(selected)selectedTitle.current?.focus();},[selected]);
  const patch=useCallback((id:string,next:ExampleState)=>setStates(old=>({...old,[id]:{...old[id],...next}})),[]);
  function inspect(id:string) {if(!selected){scroll.current=window.scrollY;lastSelection.current=id;}setSelected(id);setShowSource(false);history.replaceState(null,'',`#${id}`);window.scrollTo(0,0);}
  const back=useCallback(()=>{setSelected(null);setShowSource(false);history.replaceState(null,'',location.pathname+location.search);requestAnimationFrame(()=>{window.scrollTo(0,scroll.current);document.getElementById(`inspect-${lastSelection.current}`)?.focus({preventScroll:true});});},[]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){if(selected)back();}};window.addEventListener('keydown',key);return ()=>window.removeEventListener('keydown',key);},[back,selected]);
  const shown=data.filter(e=>theme===null||e.theme===theme);
  const useLead=theme===null;
  function tile(entry:Entry,lead=false) {return <article className={`study-tile kind-${entry.kind} ${lead?'lead-'+entry.id:''}`} key={entry.id} style={themeStyle(entry.theme,liveKnobs,gradeImages)} data-reference={entry.id} aria-label={entry.title}><Scaled width={entry.width} height={entry.height}>{['texture','object'].includes(entry.kind)?<button className="artwork-inspect" aria-label={`Explore ${entry.title}`} onClick={()=>inspect(entry.id)}><Example entry={entry} id={entry.id} focused={false} state={states[entry.id]||{}} onState={next=>patch(entry.id,next)} knobs={liveKnobs}/></button>:<Example entry={entry} id={entry.id} focused={false} state={states[entry.id]||{}} onState={next=>patch(entry.id,next)} knobs={liveKnobs}/>}</Scaled><button id={`inspect-${entry.id}`} className="study-open" onClick={()=>inspect(entry.id)} aria-label={`Open ${entry.title}`}><ArrowUpRight size={17}/></button></article>;}
  return <div className="explorer" data-typeface={typeface}><a className="skip-link" href="#workspace">Skip to moodboard</a><Header direction={active?.theme??theme} knobs={knobs} states={states} recolorImages={recolorImages} onRecolorImages={setRecolorImages} typeface={typeface} onTypeface={setTypeface} onKnobs={setKnobs} onDirection={value=>{setTheme(value);setSelected(null);setShowSource(false);history.replaceState(null,'',location.pathname+location.search);window.scrollTo(0,0);}} onHome={()=>{setTheme(null);back();}}/><main id="workspace" className={selected?'focused-workspace':'board-workspace'}>{selected?<><div className="focus-toolbar"><button onClick={back}><ArrowLeft size={16}/> Back to moodboard</button><span>{active?kindLabel[active.kind]:'Typography'} / {active?.id??'Type study'}</span><div>{active&&<button aria-pressed={showSource} onClick={()=>setShowSource(!showSource)}><Scan size={15}/>{showSource?'Live example':'View reference'}</button>}<button aria-label="Previous study" onClick={()=>{const i=data.findIndex(e=>e.id===selected);inspect(data[(i-1+data.length)%data.length].id);}}><ArrowLeft size={16}/></button><button aria-label="Next study" onClick={()=>{const i=data.findIndex(e=>e.id===selected);inspect(data[(i+1)%data.length].id);}}><ArrowRight size={16}/></button></div></div><div className="focus-heading"><div><span className="eyebrow">{themes[tone].name.toUpperCase()} / WARM STUDY</span><h2 tabIndex={-1} ref={selectedTitle}>{active?.title??'Build me a warm landing page.'}</h2></div><p>{active?.kind==='webgl'?'Turn it. Change the material. Follow the light.':active?.kind==='object'?'A rendered object, with room to explore its color.':'Explore the details. Adjust the colors.'}</p></div><div className={`focus-stage focus-${active?.kind??'headline'}`} style={themeStyle(tone,liveKnobs,gradeImages)}>{active?showSource?<img className="reference-image" src={active.image} alt={`Original reference: ${active.title}`}/>:<Scaled width={active.width} height={active.height}><Example key={active.id} entry={active} id={active.id} focused state={states[active.id]||{}} onState={next=>patch(active.id,next)} knobs={liveKnobs}/></Scaled>:<Headline focused/>}</div></>:<>{useLead?<section className="lead-composition" aria-label="Featured moodboard arrangement">{leadIds.map(id=>tile(data.find(e=>e.id===id)!,true))}<div className="headline-tile" style={themeStyle(6,liveKnobs,gradeImages)}><Headline/><button className="headline-inspect" onClick={()=>inspect('headline')} aria-label="Open headline study"><ArrowUpRight size={17}/></button></div></section>:<div className="compact-intro" style={themeStyle(theme??6,liveKnobs,gradeImages)}><Headline/></div>}<section className="study-collection horizontal" aria-label="All moodboard studies">{shown.filter(e=>!useLead||!leadIds.includes(e.id)).map(e=>tile(e))}</section></>}</main></div>;
}
