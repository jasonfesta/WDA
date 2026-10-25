const brands = [
  {
    id:'doordash', name:'DoorDash', number:'01', area:'Food / Restaurant ordering',
    subtitle:'Menu discovery, item customization and a persistent, priced action.',
    web:'https://www.doordash.com/store/sweetgreen-new-york-52008/',
    desktop:'images/doordash/menu-desktop.jpg', desktopLong:'images/doordash/menu-desktop.jpg',
    desktopCaption:'Sweetgreen menu · live website capture',
    mobile:'images/doordash/customize-mobile.jpg', mobileCaption:'Item customization · mobile website',
    mobileSource:'https://www.doordash.com/store/sweetgreen-new-york-52008/',
    nativeDefault:2, nativeCount:6, appStore:'https://apps.apple.com/us/app/doordash-food-grocery-more/id719972451', version:'8.41.0',
    component:{file:'images/doordash/customize-desktop.jpg',original:[1440,1000],crop:[440,730,560,255],title:'Customization & action',description:'Options above. Quantity and total stay together.',caption:'Detail from the captured item modal.'},
    sequence:['Choose a meal','Customize','Review basket','Checkout'],
    takeaway:'Keep the close control separate from content. Keep the price and primary action together.',
    evidence:'Live captures cover the restaurant menu and item customizer. The native previews show the publisher’s broader delivery marketplace. Cart and checkout were not captured. The four-step sequence is our study map, not a claim that every step has been observed.',
  },
  {
    id:'instacart', name:'Instacart', number:'02', area:'Food / Grocery ordering',
    subtitle:'Store selection, grocery browsing and explicit item preferences.',
    web:'https://www.instacart.com/store/?categoryFilter=homeTabForYou',
    desktop:'images/instacart/desktop-home.jpg', desktopLong:'images/instacart/desktop-home-long.jpg',
    desktopCaption:'Store selection · live desktop website',
    mobile:'images/instacart/mobile-web-home.jpg',mobileLong:'images/instacart/mobile-web-home-long.jpg',mobileCaption:'Public store selection · mobile website',mobileSource:'https://www.instacart.com/',
    nativeDefault:2,nativeCount:8,appStore:'https://apps.apple.com/us/app/instacart-groceries-food/id545599256',version:'9.38.0',
    component:{file:'images/instacart/app-03.jpg',original:[1200,2601],crop:[30,510,1130,1050],title:'Preference picker',description:'Three visual choices. One selected state. One confirmation.',caption:'Detail from an official iPhone publisher preview.',square:true},
    sequence:['Choose a store','Build basket','Review & replacements','Delivery & checkout'],
    takeaway:'Make product preferences explicit. Separate shopping decisions from delivery and payment decisions.',
    evidence:'Desktop and mobile-web entry screens were captured live. Mobile web used Chrome’s iPhone 16 emulation. Deeper store browsing encountered sign-up or login screens. Native previews are publisher artwork and may depict a different region; the retrieved Instacart set includes Canadian retailer branding. Consumer help documents cart review, replacements and checkout, but those screens were not captured live.',
    help:'https://www.instacart.com/help/article/360039163432',helpLabel:'Instacart: how to place an order',
  },
  {
    id:'kayak', name:'KAYAK', number:'03', area:'Travel / Flight booking',
    subtitle:'Compare itineraries, inspect the fare and understand where booking happens.',
    web:'https://www.kayak.com/flights/JFK-LHR/2026-11-12/2026-11-19?sort=bestflight_a',
    desktop:'images/kayak/results-desktop.jpg',desktopLong:'images/kayak/results-desktop-long.jpg',desktopAspect:'1.7778',
    desktopCaption:'JFK–London comparison · live website capture',
    mobile:'images/kayak/results-mobile.jpg',mobileCaption:'Flight comparison · mobile website',mobileSource:'https://www.kayak.com/flights/JFK-LHR/2026-11-12/2026-11-19?sort=bestflight_a',
    nativeDefault:3,nativeCount:6,appStore:'https://apps.apple.com/us/app/kayak-flights-hotels-cars/id305204535',version:'297.0.0',
    component:{file:'images/kayak/detail-desktop.jpg',original:[1440,1000],crop:[350,190,728,265],title:'Fare comparison card',description:'Times, stops, baggage, price and the next action.',caption:'Detail from a sponsored result in the live website.'},
    sequence:['Search trip','Compare flights','Inspect fare','Book with provider'],
    takeaway:'Give comparison facts a stable order. Explain the fare and provider before the booking action.',
    evidence:'Desktop and mobile-web search/results and fare details were captured. Native previews are official App Store promotional images. The highlighted desktop component is a sponsored Delta result. Provider checkout was not captured. KAYAK can redirect to a provider or offer a provider-fulfilled booking within its interface.',
    help:'https://www.kayak.com/c/help/bookings/',helpLabel:'KAYAK booking help',
  },
  {
    id:'booking', name:'Booking.com', number:'04', area:'Travel / Hotel booking',
    subtitle:'Compare places to stay, then make room, policy and price decisions.',
    web:'https://www.booking.com/searchresults.html?ss=London&checkin=2026-11-12&checkout=2026-11-19&group_adults=2&no_rooms=1&group_children=0',
    desktop:'images/booking/desktop-results.jpg',desktopLong:'images/booking/desktop-results-long.jpg',desktopAspect:'1.7778',
    desktopCaption:'London hotel results · live desktop website',
    mobile:'images/booking/mobile-web-results.jpg',mobileLong:'images/booking/mobile-web-results-long.jpg',mobileCaption:'London hotel results · mobile website',
    mobileSource:'https://www.booking.com/searchresults.html?ss=London&checkin=2026-11-12&checkout=2026-11-19&group_adults=2&no_rooms=1&group_children=0',
    nativeDefault:2,nativeCount:8,appStore:'https://apps.apple.com/us/app/booking-com-hotels-travel/id367003839',version:'70.8',
    component:{file:'images/booking/component-result-card.jpg',title:'Property result card',description:'Room facts and the stay total lead to availability.',caption:'Cropped during capture from the live results page.'},
    sequence:['Search stay','Compare hotels','Choose room & rate','Guest details & booking'],
    takeaway:'Distinguish the nightly rate from the stay total. Keep room conditions close to the selection action.',
    evidence:'Desktop and mobile results were captured for the same sample London dates, November 12–19, 2026, two adults and one room. Results and ranking vary between captures. Mobile web used Chrome’s iPhone 16 emulation. Native previews are official publisher examples. Room selection and final booking were not captured live.',
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
   <div class="figure-links">${b.mobileLong?`<a href="${b.mobileLong}" data-file="${b.mobileLong}" data-title="${b.name} / Full mobile page" data-kind="Original mobile website capture · full page" data-full="true" data-portrait="true">Full page ↗</a>`:''}${external(b.mobileSource,'Source')}</div>
  </figure>
  <figure class="app-figure" data-brand="${b.id}" data-current="${b.nativeDefault}">
   <div class="figure-heading"><h3><span class="num">03</span>Native app</h3><span class="meta">iPhone</span></div>
   ${zoomButton(nativeFile(b,b.nativeDefault),b.name+' / Native app preview','Official publisher iPhone preview',`<img src="${nativeFile(b,b.nativeDefault)}" alt="${esc(b.name+' official iPhone preview '+b.nativeDefault)}" loading="lazy">`,'app-image')}
   <div class="preview-nav"><span class="count">Preview <span class="current">${b.nativeDefault}</span> / ${b.nativeCount}</span><div class="preview-actions"><button data-direction="-1" aria-label="Previous ${b.name} app preview">←</button><button data-direction="1" aria-label="Next ${b.name} app preview">→</button></div></div>
   <figcaption class="caption">Official App Store publisher preview</figcaption>
   <div class="figure-links">${external(b.appStore,'App Store source')}</div>
  </figure>
 </div>
 <div class="flow-note"><div><h4>Flow to study</h4><p class="sequence">${b.sequence.map(esc).join('<span>→</span>')}</p></div><div><h4>Our design focus</h4><p>${b.takeaway}</p></div></div>
 <details class="source-details"><summary>Sources & capture coverage</summary><p>${b.evidence}</p><p>App Store metadata retrieved October 24, 2026: version ${b.version}. Preview artwork may predate the current app release. ${b.help?external(b.help,b.helpLabel):''} <a href="apps.json" target="_blank">Publisher image provenance ↗</a></p></details>
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
 document.getElementById('viewer-caption').textContent=trigger.dataset.kind.includes('publisher')?'Publisher promotional artwork. Open original for the full-resolution source image.':'Original capture. Scroll to inspect longer images; Open original shows the saved asset.';
 viewerImage.src=trigger.dataset.file;viewerImage.alt=trigger.dataset.title;
 const body=viewer.querySelector('.viewer-body');
 const portrait=trigger.classList.contains('app-image')||trigger.classList.contains('phone-image')||trigger.dataset.portrait;
 body.className='viewer-body'+(portrait?' portrait':trigger.dataset.full?' full-page':'');
 viewer.showModal();body.scrollTop=0;
});
document.getElementById('close-viewer').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',event=>{if(event.target===viewer)viewer.close();});
const sectionObserver=new IntersectionObserver(entries=>{
 for(const entry of entries){if(entry.isIntersecting){document.querySelectorAll('.brand-nav a').forEach(a=>{const active=a.hash==='#'+entry.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}
},{rootMargin:'-10% 0px -65% 0px',threshold:0});
document.querySelectorAll('.brand-section').forEach(section=>sectionObserver.observe(section));
if(location.hash){requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());}
