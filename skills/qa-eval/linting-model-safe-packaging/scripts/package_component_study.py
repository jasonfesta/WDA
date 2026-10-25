#!/usr/bin/env python3
"""Validate and package thirty WDA state images and their handoff."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import hashlib,json,re,struct,zipfile
R=Path(__file__).resolve().parents[1];errors=[];checked=0
C=json.loads((R/'data/components.json').read_text());A=json.loads((R/'data/assets.json').read_text());P=json.loads((R/'data/state-render-plan.json').read_text());F=json.loads((R/'data/fixtures.json').read_text())
class Links(HTMLParser):
 def __init__(self):super().__init__();self.links=[]
 def handle_starttag(self,tag,attrs):
  for key,value in attrs:
   if key in ('href','src') and value:self.links.append(value)
def check(file,link):
 global checked
 link=link.strip('<>');u=urlsplit(link)
 if u.scheme or u.netloc or not u.path:return
 checked+=1;target=(file.parent/unquote(u.path)).resolve()
 if target.suffix=='.zip' and target.parent==R/'downloads':return
 if not target.exists():errors.append(str(file.relative_to(R))+' -> '+link)
imagepaths=[];action_count=0
assert len(C)==6 and len(P)==30
for c in C:
 assert len(c['states'])==5
 ids={s['id'] for s in c['states']}
 for s in c['states']:
  imagepaths.append(s['image']['file'])
  for k in ['prompt','reference']:assert (R/s[k]).exists(),s[k]
  assert (R/s['image']['file']).exists()
  j=next(j for j in P if j['component']==c['slug'] and j['id']==s['id'])
  assert j['image']==s['image']['file'] and j['prompt_file']==s['prompt'] and j['reference']==s['reference']
  assert j['prompt'] in (R/s['prompt']).read_text()
  for a in s['actions']:
   assert a['target'] in ids and a['label'] and a['note'];action_count+=1
 for x in c['controls']:
  for key in ['id','label','action','rollover','press','keyboard','result','scope','states']:assert x[key],(c['slug'],x['id'],key)
  assert all(s in ids for s in x['states'])
 for kind in ['interaction','motion']:assert (R/'prompts'/kind/(c['slug']+'.md')).exists()
 assert len(c['branches'])>=3
assert len(imagepaths)==len(set(imagepaths))==30
assert set(imagepaths)=={str(p.relative_to(R)) for p in (R/'images').rglob('*.png')}
for a in A:
 raw=(R/a['file']).read_bytes()
 assert hashlib.sha256(raw).hexdigest()==a['sha256'],a['file']
 assert list(struct.unpack('>II',raw[16:24]))==a['dimensions'],a['file']
for v in F['usage'].values():
 assert sum(v['categories'].values())==v['used']==sum(v['daily'])
 assert len(v['daily'])==v['days'] and all(n>=0 for n in v['daily'])
 assert v['average']==v['used']/v['days'] and v['capacity_percent']==v['used']/v['limit']*100
 assert v['difference_from_allowance']==v['limit']-v['used']
for p in R.rglob('*'):
 if not p.is_file():continue
 if p.suffix=='.html':
  parser=Links();parser.feed(p.read_text())
  for v in parser.links:check(p,v)
 elif p.suffix=='.md':
  for v in re.findall(r'\]\(([^)]+)\)',p.read_text()):check(p,v)
report=dict(status='pass' if not errors else 'fail',date='2026-10-21',components=6,state_images=30,exact_state_prompts=30,applied_correction_prompts=1,originals=6,historical_screenshots=5,asset_hashes_checked=len(A),directed_review_actions=action_count,ledger_control_groups=sum(len(c['controls']) for c in C),documented_element_instances=sum(x['instances'] for c in C for x in c['controls']),primary_references=len(json.loads((R/'data/references.json').read_text())),local_links_checked=checked,fixture_totals='pass',errors=errors)
(R/'validation.json').write_text(json.dumps(report,indent=2)+'\n')
if errors:raise SystemExit(json.dumps(report,indent=2))
manifest=dict(title='WDA / Component study',maintainer='Jason Festa',date='2026-10-21',repository='https://github.com/jasonfesta/WDA/tree/main/component-study',status='thirty designed states ready for review; production behavior specified',assets=A,render_ledger='data/state-render-plan.json',validation='validation.json',browser_checks='browser-checks.json')
(R/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
files=sorted(p for p in R.rglob('*') if p.is_file() and 'downloads' not in p.relative_to(R).parts and '__pycache__' not in p.parts and p.name!='.DS_Store')
sets={'component-study-images.zip':[p for p in files if p.relative_to(R).parts[0]=='images'],'component-study-reference-pack.zip':[p for p in files if p.relative_to(R).parts[0] in ['references','prompts','research','interaction','data'] or p.suffix=='.md' or p.name in ['manifest.json','validation.json','browser-checks.json']],'component-study.zip':files}
(R/'downloads').mkdir(exist_ok=True)
for name,entries in sets.items():
 path=R/'downloads'/name
 with zipfile.ZipFile(path,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for p in entries:z.write(p,p.relative_to(R))
 assert path.stat().st_size<100*1024**2,'Archive exceeds publication limit: '+name
 with zipfile.ZipFile(path) as z:assert z.testzip() is None
 print(name,len(entries),'files',round(path.stat().st_size/1024**2,2),'MiB')
print(json.dumps(report,indent=2))
