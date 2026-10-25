const brands = [
  {
    "id": "ramp",
    "name": "Ramp",
    "number": "01",
    "area": "Finance / Expense management",
    "subtitle": "The website, mobile product and budget controls in Ramp\u2019s own visual language.",
    "web": "https://ramp.com/expense-management",
    "nativeDefault": 1,
    "component": {
      "file": "images/ramp/budget-source.webp",
      "original": [
        1264,
        949
      ],
      "crop": [
        192,
        590,
        1072,
        225
      ],
      "title": "Budget utilization rows",
      "description": "Shared columns, inline progress and committed spend.",
      "caption": "Detail from Ramp\u2019s published budget interface composition. The source itself is cropped."
    },
    "sequence": [
      "Available spend",
      "Transactions",
      "Requirements",
      "Review"
    ],
    "takeaway": "Compare the website\u2019s headline scale with the app\u2019s compact labels, spending rows and contextual controls.",
    "evidence": "Live public expense-management webpage at desktop and 390px mobile widths. Budget detail is a previously collected official product composition, not an authenticated capture. Native app references are official Apple publisher previews. Ramp is a business expense product; it is not presented here as a personal budgeting app.",
    "desktop": "images/ramp/desktop.jpg",
    "desktopLong": "images/ramp/desktop-long.jpg",
    "mobile": "images/ramp/mobile-web.jpg",
    "desktopAspect": "1.7341",
    "desktopCaption": "Public product page \u00b7 live desktop capture",
    "mobileCaption": "Public product page \u00b7 390px responsive website",
    "mobileSource": "https://ramp.com/expense-management",
    "mobileLong": "images/ramp/mobile-web-long.jpg",
    "nativeCount": 7,
    "appStore": "https://apps.apple.com/us/app/ramp/id1628197245?uo=4",
    "version": "0.184.0"
  },
  {
    "id": "peloton",
    "name": "Peloton",
    "number": "02",
    "area": "Health / Training and progress",
    "subtitle": "Real app navigation, progress history and class context before any new health layouts.",
    "web": "https://www.onepeloton.com/app",
    "nativeDefault": 2,
    "component": {
      "file": "images/peloton/app-05.jpg",
      "original": [
        1200,
        2607
      ],
      "crop": [
        178,
        960,
        846,
        1088
      ],
      "title": "Activity calendar",
      "description": "Active days, daily streak and weekly streak share one calendar.",
      "caption": "Exact excerpt from official iPhone publisher preview 5. Open it to see the surrounding app.",
      "square": true
    },
    "sequence": [
      "Home",
      "Plan",
      "Workout",
      "Progress"
    ],
    "takeaway": "Inspect the actual navigation, compact search, segmented views, completion marks and metric hierarchy. The progress/calendar preview is available in the app carousel.",
    "evidence": "Live public Peloton App webpage at desktop and 390px mobile widths. Native images are official publisher previews. Default preview 2 shows Home; preview 3 shows Classes; preview 5 shows Progress. The component is a displayed crop of that original Progress preview. No AI-generated interpretation appears on this board.",
    "desktop": "images/peloton/desktop.jpg",
    "desktopLong": "images/peloton/desktop-long.jpg",
    "mobile": "images/peloton/mobile-web.jpg",
    "desktopAspect": "1.7341",
    "desktopCaption": "Public product page \u00b7 live desktop capture",
    "mobileCaption": "Public product page \u00b7 390px responsive website",
    "mobileSource": "https://www.onepeloton.com/app",
    "mobileLong": "images/peloton/mobile-web-long.jpg",
    "nativeCount": 7,
    "appStore": "https://apps.apple.com/us/app/peloton-fitness-workouts/id792750948?uo=4",
    "version": "15.135.0"
  },
  {
    "id": "notion",
    "name": "Notion",
    "number": "03",
    "area": "To-do / Tasks and documents",
    "subtitle": "Native editing tools, task rows and database controls with the original typography intact.",
    "web": "https://www.notion.com/product/projects",
    "nativeDefault": 6,
    "component": {
      "file": "images/notion/database-source.png",
      "original": [
        1440,
        804
      ],
      "crop": [
        96,
        94,
        934,
        335
      ],
      "title": "Task database",
      "description": "View tabs, assignment, status and type stay close to each task.",
      "caption": "Detail from Notion\u2019s published Issue Tracking interface example."
    },
    "sequence": [
      "Page",
      "Task",
      "Properties",
      "Views"
    ],
    "takeaway": "Inspect the native editor toolbar and keyboard state, then compare them with the desktop database\u2019s tighter property columns.",
    "evidence": "Live public Projects webpage at desktop and 390px mobile widths. The full mobile webpage exceeds a single capture limit, so its full-page view is shown in two consecutive original captures. The database is a previously collected official interface example. App previews are publisher artwork; the selected to-do screen contains a keyboard and is not a tested editing session.",
    "desktop": "images/notion/desktop.jpg",
    "desktopLong": "images/notion/desktop-long.jpg",
    "mobile": "images/notion/mobile-web.jpg",
    "desktopAspect": "1.7341",
    "desktopCaption": "Public product page \u00b7 live desktop capture",
    "mobileCaption": "Public product page \u00b7 390px responsive website",
    "mobileSource": "https://www.notion.com/product/projects",
    "mobileLong": "images/notion/mobile-web-part-1.jpg",
    "mobileLongSecond": "images/notion/mobile-web-part-2.jpg",
    "nativeCount": 7,
    "appStore": "https://apps.apple.com/us/app/notion-notes-tasks-ai/id1232780281?uo=4",
    "version": "1.7.349"
  }
];

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nativeFile=(b,n)=>`images/${b.id}/app-${String(n).padStart(2,'0')}.jpg`;
const external=(url,label)=>`<a href="${esc(url)}" target="_blank" rel="noopener">${label} ↗</a>`;
const zoomButton=(file,title,kind,body,extra='')=>`<button class="image-button ${extra}" data-file="${file}" data-title="${esc(title)}" data-kind="${esc(kind)}" aria-label="Inspect ${esc(title)}">${body}</button>`;
function componentImage(b){
 const c=b.component;
 if(!c.crop) return `<img src="${c.file}" alt="${esc(b.name+' — '+c.title)}" loading="lazy">`;
 const [x,y,w,h]=c.crop,[iw]=c.original;
 return `<span class="crop" style="aspect-ratio:${w}/${h}"><img src="${c.file}" alt="${esc(b.name+' — '+c.title+' excerpt')}" loading="lazy" style="width:${iw/w*100}%;left:${-x/w*100}%;top:${-y/h*100}%"></span>`;
}
document.getElementById('references').innerHTML=brands.map(b=>`
<section class="brand-section" id="${b.id}" aria-labelledby="${b.id}-heading">
 <div class="section-heading"><div><p class="eyebrow">${b.number} / ${esc(b.area)}</p><h2 class="brand-name" id="${b.id}-heading">${b.name}</h2></div><p class="section-subtitle">${b.subtitle}</p></div>
 <div class="board">
  <div class="desktop-stack">
   <figure class="desktop-figure">
    <div class="figure-heading"><h3><span class="num">01</span>Desktop website</h3><span class="meta">Live capture</span></div>
    ${zoomButton(b.desktop,b.name+' / Desktop website','Original website capture',`<img src="${b.desktop}" alt="${esc(b.name+' desktop website — '+b.desktopCaption)}" loading="lazy">`,'desktop-image')}
    <figcaption class="caption">${b.desktopCaption}</figcaption>
    <div class="figure-links"><a href="${b.desktopLong}" data-file="${b.desktopLong}" data-title="${b.name} / Full-page website" data-kind="Original website capture · full page" data-full="true">Full page ↗</a>${external(b.web,'Website source')}</div>
   </figure>
   <figure class="component-figure">
    <div class="figure-heading"><h3><span class="num">04</span>Component detail</h3><span class="meta">Original excerpt</span></div>
    <div class="component-card ${b.component.square?'component-square':''}">
     ${zoomButton(b.component.file,b.name+' / '+b.component.title,b.component.caption,componentImage(b))}
     <div class="component-copy"><strong>${b.component.title}</strong>${b.component.description}</div>
    </div>
    <figcaption class="caption">${b.component.caption}</figcaption>
   </figure>
  </div>
  <figure class="mobile-figure">
   <div class="figure-heading"><h3><span class="num">02</span>Mobile web</h3><span class="meta">Website</span></div>
   ${zoomButton(b.mobile,b.name+' / Mobile website','Live mobile website capture',`<img src="${b.mobile}" alt="${esc(b.name+' mobile website')}" loading="lazy">`,'phone-image')}
   <figcaption class="caption">${b.mobileCaption}</figcaption>
   <div class="figure-links">${b.mobileLong?`<a href="${b.mobileLong}" data-file="${b.mobileLong}" data-title="${b.name} / Full mobile page" data-kind="Original mobile website capture · full page" data-full="true" data-portrait="true" ${b.mobileLongSecond?`data-second="${b.mobileLongSecond}"`:""}>Full page ↗</a>`:''}${external(b.mobileSource,'Source')}</div>
  </figure>
  <figure class="app-figure" data-brand="${b.id}" data-current="${b.nativeDefault}">
   <div class="figure-heading"><h3><span class="num">03</span>Native app</h3><span class="meta">iPhone</span></div>
   ${zoomButton(nativeFile(b,b.nativeDefault),b.name+' / Native app preview','Official publisher iPhone preview',`<img src="${nativeFile(b,b.nativeDefault)}" alt="${esc(b.name+' official iPhone preview '+b.nativeDefault)}" loading="lazy">`,'app-image')}
   <div class="preview-nav"><span class="count">Preview <span class="current">${b.nativeDefault}</span> / ${b.nativeCount}</span><div class="preview-actions"><button data-direction="-1" aria-label="Previous ${b.name} app preview">←</button><button data-direction="1" aria-label="Next ${b.name} app preview">→</button></div></div>
   <figcaption class="caption">Official App Store publisher preview</figcaption>
   <div class="figure-links">${external(b.appStore,'App Store source')}</div>
  </figure>
 </div>
 <div class="flow-note"><div><h4>Product structure</h4><p class="sequence">${b.sequence.map(esc).join('<span>→</span>')}</p></div><div><h4>What to inspect</h4><p>${b.takeaway}</p></div></div>
 <details class="source-details"><summary>Sources & capture coverage</summary><p>${b.evidence}</p><p>App Store metadata retrieved October 25, 2026: version ${b.version}. Preview artwork may predate the current app release. ${b.help?external(b.help,b.helpLabel):''} <a href="apps.json" target="_blank">Publisher image provenance ↗</a></p></details>
</section>`).join('');

brands.forEach(b=>{if(b.desktopAspect)document.querySelector(`#${b.id} .desktop-image`).style.aspectRatio=b.desktopAspect;});

const viewer=document.getElementById('viewer'), viewerImage=document.getElementById('viewer-image');
document.addEventListener('click',event=>{
 const direction=event.target.closest('[data-direction]');
 if(direction){
  const figure=direction.closest('.app-figure'),b=brands.find(b=>b.id===figure.dataset.brand);
  let n=(Number(figure.dataset.current)-1+Number(direction.dataset.direction)+b.nativeCount)%b.nativeCount+1;
  figure.dataset.current=n;figure.querySelector('.current').textContent=n;
  const button=figure.querySelector('.app-image'),img=button.querySelector('img');
  button.dataset.file=nativeFile(b,n);img.src=nativeFile(b,n);img.alt=`${b.name} official iPhone preview ${n}`;
  return;
 }
 const trigger=event.target.closest('[data-file]');
 if(!trigger)return;
 event.preventDefault();
 document.getElementById('viewer-title').textContent=trigger.dataset.title;
 document.getElementById('viewer-kind').textContent=trigger.dataset.kind;
 document.getElementById('viewer-original').href=trigger.dataset.file;
 document.getElementById('viewer-caption').textContent=trigger.dataset.kind.includes('publisher')?'Publisher promotional artwork. Open original for the full-resolution source image.':'Original reference. Components are labeled excerpts; open the original to inspect the full source. Scroll for longer captures.';
 viewerImage.src=trigger.dataset.file;viewerImage.alt=trigger.dataset.title;
 const body=viewer.querySelector('.viewer-body');
 const portrait=trigger.classList.contains('app-image')||trigger.classList.contains('phone-image')||trigger.dataset.portrait;
 body.className='viewer-body'+(portrait?' portrait':trigger.dataset.full?' full-page':'');
 body.querySelectorAll('.continuation').forEach(el=>el.remove()); if(trigger.dataset.second){const next=document.createElement('img');next.className='continuation';next.src=trigger.dataset.second;next.alt=trigger.dataset.title+' — continued';body.append(next);} viewer.showModal();body.scrollTop=0;
});
document.getElementById('close-viewer').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',event=>{if(event.target===viewer)viewer.close();});
const sectionObserver=new IntersectionObserver(entries=>{
 for(const entry of entries){if(entry.isIntersecting){document.querySelectorAll('.brand-nav a').forEach(a=>{const active=a.hash==='#'+entry.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}
},{rootMargin:'-10% 0px -65% 0px',threshold:0});
document.querySelectorAll('.brand-section').forEach(section=>sectionObserver.observe(section));
if(location.hash){requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());}
