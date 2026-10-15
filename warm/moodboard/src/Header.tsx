import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { baseline, luminance, themes, tokens } from './theme';
import { materialBaseColors } from './material-palettes';
import artworkPalettes from './artwork-palettes.json';
import photoPalettes from './photo-palettes.json';
import data from './registry.json';
import type { ExampleState, Knobs, Typeface } from './shared';

type Swatch = { value: string; source: string; filter?: string };
const roles = [['--ink', 'Text'], ['--muted', 'Secondary text'], ['--accent', 'Accent'], ['--accent-alt', 'Secondary'], ['--on-accent', 'Accent text'], ['--border', 'Border'], ['--surface', 'Surface'], ['--surface-raised', 'Paper']] as const;

function directionColors(index: number, knobs: Knobs, states: Record<string, ExampleState>, recolorImages: boolean): Swatch[] {
  const palette = tokens(index, knobs);
  const hasUI = data.some(entry => entry.theme === index && ['website', 'component', 'mobile'].includes(entry.kind));
  const ui = hasUI ? roles.map(([key, source]) => ({ value: palette[key], source })) : [];
  const artwork = (artworkPalettes as Record<string, string[]>)[index] ?? [];
  const photos = (photoPalettes as Record<string, string[]>)[index] ?? [];
  const materials = data.filter(entry => entry.theme === index && entry.kind === 'webgl').flatMap(entry => {
    const selected = states[entry.id]?.material;
    const finish = selected === 'stone' || selected === 'glaze' || selected === 'linen' ? selected : 'original';
    return Object.entries(materialBaseColors(entry.id, knobs, finish))
      .filter((pair): pair is [string, string] => typeof pair[1] === 'string')
      .map(([role, value]) => ({ value, source: role === 'amberAttenuation' ? 'Amber glass tint' : `3D ${role} base` }));
  });
  const swatches: Swatch[] = [...ui, ...materials, ...artwork.map(value => ({ value, source: 'Artwork base', filter: recolorImages ? palette['--image-filter'] : 'none' })), ...photos.map(value => ({ value, source: 'Photo base', filter: recolorImages ? palette['--image-filter'] : 'none' }))];
  return swatches
    .filter((swatch, index, all) => all.findIndex(other => other.value === swatch.value && (other.filter ?? 'none') === (swatch.filter ?? 'none')) === index)
    .sort((a, b) => luminance(a.value) - luminance(b.value));
}

type Props = {
  direction: number | null;
  onDirection: (value: number | null) => void;
  knobs: Knobs;
  states: Record<string, ExampleState>;
  onKnobs: (value: Knobs) => void;
  onHome: () => void;
  recolorImages: boolean;
  onRecolorImages: (value: boolean) => void;
  typeface: Typeface;
  onTypeface: (value: Typeface) => void;
};

export default function Header({ direction, onDirection, knobs, states, onKnobs, onHome, recolorImages, onRecolorImages, typeface, onTypeface }: Props) {
  const [open, setOpen] = useState(false);
  const editor = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!editor.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  const directions = direction === null ? themes.map((_, index) => index) : [direction];
  return <header className="control-bar">
    <div className="control-top">
      <a href="#" className="wordmark" onClick={event => { event.preventDefault(); onHome(); }}>warm</a>
      <div className="chrome-controls">
        <div className="tone-editor" ref={editor} onKeyDown={event => {
          if (event.key === 'Escape' && open) { event.stopPropagation(); setOpen(false); trigger.current?.focus(); }
        }}>
          <button ref={trigger} className="chrome-button" aria-expanded={open} aria-controls="tonal-settings" onClick={() => setOpen(!open)}>Tonal range <ChevronDown size={15}/></button>
          {open && <section id="tonal-settings" className="tone-popover" aria-label="Tonal range settings">
            <fieldset>
              <legend className="sr-only">Adjust the moodboard</legend>
              <div className="color-controls">
                {(['hue', 'warmth', 'depth'] as const).map(key => {
                  const limit = key === 'hue' ? 20 : key === 'depth' ? 25 : 30;
                  const label = key[0].toUpperCase() + key.slice(1);
                  return <label className="color-control" key={key}>
                    <span>{label}<output>{knobs[key] > 0 ? '+' : ''}{knobs[key]}</output></span>
                    <input aria-label={label} type="range" min={-limit} max={limit} step={1} value={knobs[key]}
                      style={{ '--range-position': `${(knobs[key] + limit) / (limit * 2) * 100}%` } as CSSProperties}
                      onChange={event => onKnobs({ ...knobs, [key]: Number(event.target.value) })}/>
                  </label>;
                })}
              </div>
              <label className="image-toggle"><span>Recolor images</span><input type="checkbox" role="switch" checked={recolorImages} onChange={event => onRecolorImages(event.target.checked)}/></label>
              <label className="font-select"><span>Font</span><select value={typeface} onChange={event => onTypeface(event.target.value as Typeface)}>
                <option value="original">Original</option><option value="sans">Google Sans Flex</option><option value="serif">Editorial serif</option><option value="mono">Monospace</option>
              </select></label>
              <button className="reset-colors" onClick={() => { onKnobs(baseline); onTypeface('original'); onRecolorImages(true); }}>Reset style</button>
            </fieldset>
          </section>}
        </div>
        <div className="direction-select">
          <select aria-label="Directions" value={direction ?? 'all'} onChange={event => { onDirection(event.target.value === 'all' ? null : Number(event.target.value)); setOpen(false); }}>
            <option value="all">Directions · All 10</option>
            {themes.map((theme, index) => <option key={theme.name} value={index}>Directions · {theme.name}</option>)}
          </select><ChevronDown size={15} aria-hidden="true"/>
        </div>
      </div>
    </div>
    <div className={`direction-palettes ${direction === null ? 'all-directions' : 'single-direction'}`} aria-label="Colors used by direction">
      {directions.map(index => {
        const swatches = directionColors(index, knobs, states, recolorImages);
        return <button className="direction-palette" key={index} data-palette={index} aria-pressed={direction === index}
          aria-label={direction === index ? `Show all directions from ${themes[index].name}` : `View ${themes[index].name} direction`}
          onClick={() => { onDirection(direction === index ? null : index); setOpen(false); }}>
          <span className="palette-name">{direction === index && <span aria-hidden="true">‹ </span>}{themes[index].name}</span>
          <span className="palette-colors" aria-hidden="true">
            {swatches.map((swatch, i) => <span key={`${swatch.source}-${i}`} style={{ backgroundColor: swatch.value, filter: swatch.filter }} title={`${swatch.source} · ${swatch.value.toUpperCase()}`} data-color-source={swatch.source}/>)}
          </span>
        </button>;
      })}
    </div>
  </header>;
}
