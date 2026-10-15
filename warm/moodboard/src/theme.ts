import type { CSSProperties } from 'react';
import type { Knobs } from './shared';

export const baseline: Knobs = { hue: 0, warmth: 0, depth: 0 };
export const themes = [
  { name: 'Terracotta', accent: '#ac482b', surface: '#f2d4bd', ink: '#4a241d', alt: '#716638' },
  { name: 'Orchard', accent: '#a25331', surface: '#efe2aa', ink: '#493720', alt: '#6d713d' },
  { name: 'Rosette', accent: '#8b302f', surface: '#f1c2b7', ink: '#511817', alt: '#ada36d' },
  { name: 'Moss', accent: '#656a41', surface: '#e6e7c9', ink: '#303b29', alt: '#ba7944' },
  { name: 'Honey', accent: '#b66b0f', surface: '#fae5b4', ink: '#59361a', alt: '#e7a343' },
  { name: 'Citron', accent: '#a27f10', surface: '#f2ecc2', ink: '#504827', alt: '#d9783c' },
  { name: 'Apricot', accent: '#c76036', surface: '#f9dcc0', ink: '#60282b', alt: '#a5b9bd' },
  { name: 'Burgundy', accent: '#7c2835', surface: '#f1d7d5', ink: '#422226', alt: '#bd7349' },
  { name: 'Cocoa', accent: '#78492e', surface: '#e9dbca', ink: '#382a21', alt: '#be8154' },
  { name: 'Coral', accent: '#c74f39', surface: '#f6ccc1', ink: '#6b2728', alt: '#717947' },
];
export function clamp(n: number, lo: number, hi: number) { return Math.min(hi, Math.max(lo, n)); }
function hsl(hex: string): [number, number, number] {
  const [r,g,b] = [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255);
  const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min,l=(max+min)/2;
  let h=0;
  if (d) { h=max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4; h*=60; }
  return [(h+360)%360,d?d/(1-Math.abs(2*l-1))*100:0,l*100];
}
function rgb(h: number,s: number,l: number) {
  s/=100;l/=100;
  const a=s*Math.min(l,1-l);
  return [0,8,4].map(n=>{const k=(n+h/30)%12;return l-a*Math.max(-1,Math.min(k-3,9-k,1));});
}
export function color(hex: string,k: Knobs,depthFactor=0.35) {
  const [h,s,l]=hsl(hex),hue=clamp(k.hue,-20,20),warmth=clamp(k.warmth,-30,30);
  // Explore within the original material family, never rotate warm colors into cool ones.
  const signedHue=h>330?h-360:h;
  let nh=h;
  if(signedHue>=-30&&signedHue<=70) nh=clamp(signedHue+hue*.6+(36-signedHue)*warmth/250,-12,68);
  else if(h>70&&h<160) nh=clamp(h+hue*.2+(78-h)*warmth/450,68,160);
  else nh=h+hue*.12;
  nh=(nh+360)%360;
  const ns=clamp(s+k.warmth*.18,6,90),nl=clamp(l-k.depth*depthFactor,9,97);
  return '#'+rgb(nh,ns,nl).map(n=>Math.round(n*255).toString(16).padStart(2,'0')).join('');
}
export function luminance(hex: string) {
  const c=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
  return c[0]*.2126+c[1]*.7152+c[2]*.0722;
}
export function tokens(index: number,k: Knobs): Record<string,string> {
  const t=themes[index]??themes[0],surface=color(t.surface,k,.4),accent=color(t.accent,k,.24);
  return { '--surface':surface,'--surface-raised':color('#fffcf4',k,.3), '--ink':color(t.ink,k,.12), '--muted':color(t.ink,k,.08), '--accent':accent, '--accent-alt':color(t.alt,k,.24), '--on-accent':luminance(accent)>.179?'#211d18':'#fffdf8','--border':color(t.surface,{...k,depth:k.depth+22},.5), '--image-filter':`hue-rotate(${clamp(k.hue,-20,20)*.35}deg) saturate(${1+k.warmth/150}) brightness(${1-k.depth/150})` };
}
export const themeStyle=(index: number,k: Knobs,recolorImages=true)=>{
  const palette=tokens(index,k);
  return {...palette,'--photo-filter':recolorImages?palette['--image-filter']:'none'} as CSSProperties;
};
