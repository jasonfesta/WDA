from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,zipfile,struct,hashlib,re
r=Path(__file__).resolve().parents[1]
a=json.loads((r/'data/flows.json').read_text());expected=['afterglow','pocket-garden','home-note','soul','petal','daybook'];assert [x['id'] for x in a]==expected
errors=[];ids=set();images=[];controls=0
for app in a:
 assert len(app['screens'])==5
 routes={s['id'] for s in app['screens']}
 for s in app['screens']:
  image=r/s['image'];b=image.read_bytes();size=list(struct.unpack('>II',b[16:24]));sha=hashlib.sha256(b).hexdigest()
  if size!=s['native_size'] or sha!=s['sha256']:errors.append('Asset metadata mismatch '+s['image'])
  if abs(size[0]/size[1]-874/1800)>.004:errors.append('Aspect ratio '+s['image'])
  images.append(image)
  if (r/s['prompt']).read_text().strip()!=s['exact_prompt'].strip():errors.append('Prompt mismatch '+s['prompt'])
  if s.get('os_chrome') is not False:errors.append('OS chrome status missing '+s['image'])
  if (r/s['interaction_prompt_path']).read_text().strip()!=s['interaction_prompt'].strip():errors.append('Interaction prompt mismatch '+s['id'])
  if len(s.get('motion',{}))!=3:errors.append('Missing screen motion '+s['id'])
  if s.get('cleanup_reference') and not (r/s['cleanup_reference']).exists():errors.append('Missing cleanup input '+s['id'])
  for c in s['controls']+s['shared_controls']:
   controls+=1
   if c['id'] in ids:errors.append('Duplicate control '+c['id'])
   ids.add(c['id']);t=c['target']
   if not all(c.get(k) for k in ['rollover','motion_feedback','interaction_prompt']):errors.append('Missing control behavior '+c['id'])
   if t.startswith('aux:'):
    if t[4:] not in app['auxiliary_routes']:errors.append('Missing auxiliary route '+t)
   elif t not in routes|{'self','none'}:errors.append('Unknown route '+t)
  for p in s['input_references']:
   if not (r/p).exists():errors.append('Missing reference '+p)
 m=app['motion']
 for key in ['path','prompt_path','asset_prompt_path','motion_prompt_path']:
  if not (r/m[key]).exists():errors.append('Missing motion deliverable '+m[key])
actual=list((r/'images/mobile').rglob('*.png'))
if set(actual)!=set(images):errors.append('Mobile export folder is not exactly 30 final images')
(r/'downloads').mkdir(exist_ok=True)
manifest={'title':'WDA / App study','author':'Jason Festa','date':'2026-10-21','apps':6,'screens':30,'control_and_navigation_entries':controls,'motion_status':'Specifications and prompts only; motion assets and runtime animation are future implementation.','motion_briefs':[{'app':app['id'],'method':app['motion']['method'],'brief':app['motion']['path'],'interaction_prompt':app['motion']['prompt_path'],'asset_prompt':app['motion']['asset_prompt_path'],'motion_prompt':app['motion']['motion_prompt_path']} for app in a],'files':[{'app':app['id'],'screen':s['id'],'path':s['image'],'size':s['native_size'],'sha256':s['sha256'],'prompt':s['prompt'],'interaction_prompt':s['interaction_prompt_path'],'os_chrome':s['os_chrome'],'cleanup_reference':s.get('cleanup_reference'),'cleanup_input_sha256':hashlib.sha256((r/s['cleanup_reference']).read_bytes()).hexdigest() if s.get('cleanup_reference') else None} for app in a for s in app['screens']]}
(r/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
def bundle(name,files):
 with zipfile.ZipFile(r/'downloads'/name,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for p in sorted(set(files)):z.write(p,p.relative_to(r))
 with zipfile.ZipFile(r/'downloads'/name) as z:
  if z.testzip():errors.append('ZIP corruption '+name)
refs=[p for folder in ['interaction','research','references','prompts','data'] for p in (r/folder).rglob('*') if p.is_file()]+[r/'README.md',r/'manifest.json']
bundle('app-study-images.zip',images);bundle('app-study-reference-pack.zip',refs)
# Validate local links in all active HTML and Markdown.
class Links(HTMLParser):
 def __init__(self):super().__init__();self.urls=[]
 def handle_starttag(self,tag,attrs):
  for k,v in attrs:
   if k in ('src','href') and v:self.urls.append(v)
linkcount=0
for p in list(r.rglob('*.html'))+list(r.rglob('*.md')):
 text=p.read_text(); urls=[]
 if p.suffix=='.html':
  parser=Links();parser.feed(text);urls=parser.urls
 else:urls=re.findall(r'\]\(([^)]+)\)',text)
 for url in urls:
  u=urlsplit(url)
  if u.scheme or u.netloc or not u.path:continue
  linkcount+=1;dest=(p.parent/unquote(u.path)).resolve()
  if not dest.exists() and dest not in {r/'downloads/app-study.zip',r/'validation.json'}:errors.append(f'Missing link {p.relative_to(r)}: {url}')
report={'apps':6,'screens':30,'control_and_navigation_entries':controls,'auxiliary_routes':sum(len(x['auxiliary_routes']) for x in a),'motion_briefs':6,'screen_interaction_prompts':30,'controls_with_rollover_notes':controls,'os_chrome_free_exports':30,'local_links_checked':linkcount,'all_mobile_assets_in_manifest':len(actual)==30,'image_pixel_review':'21 OS-chrome edits inspected, 9 already-clean images retained. Full-bleed square edges, copy and state consistency checked. Raster component detail still needs normalization during implementation.','errors':errors,'passed':not errors}
(r/'validation.json').write_text(json.dumps(report,indent=2)+'\n')
if errors:
 print('\n'.join(errors));raise SystemExit(1)
files=[p for p in r.rglob('*') if p.is_file() and 'downloads' not in p.relative_to(r).parts and '__pycache__' not in p.parts and p.name!='.DS_Store']
bundle('app-study.zip',files)
print(json.dumps(report,indent=2))
