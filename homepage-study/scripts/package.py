"""Validate the self-contained study and rebuild its two clean downloads."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
import hashlib, json, re, zipfile

root=Path(__file__).resolve().parents[1]
downloads=root/'downloads'
downloads.mkdir(exist_ok=True)
manifest=json.loads((root/'manifest.json').read_text())
assert len(manifest['items'])==5
assert sorted(p.name for p in (root/'images').iterdir())==['desktop','mobile']
for kind in ['desktop','mobile']:
 assert len(list((root/'images'/kind).iterdir()))==5
for item in manifest['items']:
 for kind in ['desktop','mobile']:
  assert hashlib.sha256((root/item[kind]).read_bytes()).hexdigest()==item['sha256'][kind]

with zipfile.ZipFile(downloads/'homepage-study-images.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted((root/'images').rglob('*')):
  if p.is_file():z.write(p,p.relative_to(root))
# Create the full ZIP before link validation so download links resolve.
def bundle():
 with zipfile.ZipFile(downloads/'homepage-study.zip','w',zipfile.ZIP_DEFLATED) as z:
  for p in sorted(root.rglob('*')):
   if p.is_file() and p != downloads/'homepage-study.zip' and p.suffix != '.pyc' and '__pycache__' not in p.parts and p.name!='.DS_Store':
    z.write(p,Path('homepage-study')/p.relative_to(root))
bundle()

class Links(HTMLParser):
 def __init__(self):super().__init__();self.links=[]
 def handle_starttag(self,tag,attrs):
  for key,value in attrs:
   if key in ['href','src'] and value:self.links.append(value)
broken=[];checked=0
for p in sorted(root.rglob('*')):
 if p.suffix not in ['.html','.md']:continue
 checked+=1;text=p.read_text()
 if p.suffix=='.html':
  parser=Links();parser.feed(text);links=parser.links
 else:links=[m[1] for m in re.findall(r'(!?\[[^\]]*\])\(([^)]*)\)',text)]
 for link in links:
  parsed=urlparse(link)
  if parsed.scheme or parsed.netloc or not parsed.path:continue
  path=(p.parent/unquote(parsed.path)).resolve()
  if not path.exists():broken.append(dict(file=str(p.relative_to(root)),link=link))
report=dict(homepages=5,final_images=10,review_pages=5,tout_specifications=50,checked_documents=checked,broken_local_links=broken)
(root/'validation.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
assert not broken,'Repair local links before delivery.'
bundle()
print('Image download:',round((downloads/'homepage-study-images.zip').stat().st_size/1024**2,2),'MiB')
print('Complete study:',round((downloads/'homepage-study.zip').stat().st_size/1024**2,2),'MiB')
