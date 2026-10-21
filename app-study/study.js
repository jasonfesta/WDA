(()=>{
 const dataEl=document.getElementById('review-data');if(!dataEl)return;
 const app=JSON.parse(dataEl.textContent);let current=0;
 const byId=id=>document.getElementById(id);
 const text=(id,value)=>{byId(id).textContent=value;};
 function select(id,updateHash=true){
  const idx=app.screens.findIndex(s=>s.id===id);if(idx<0)return;current=idx;const s=app.screens[idx];
  text('screen-title',`${String(idx+1).padStart(2,'0')} / ${s.title}`);text('screen-entry',`Entry: ${s.entry}. Active destination: ${s.selected_tab||'none — setup or editor'}.`);
  text('screen-position',`${idx+1} / 5`);byId('previous').disabled=idx===0;byId('next').disabled=idx===4;
  const img=byId('active-screen');img.src='../'+s.image;img.alt=app.name+' — '+s.title;img.width=s.native_size[0];img.height=s.native_size[1];byId('full-image').href=img.src;byId('download-screen').href=img.src;byId('download-screen').download=`${app.id}-${s.id}.png`;text('image-size',`${s.native_size.join(' × ')} px · native export · square outer edges`);
  text('scroll-notes',s.scroll_notes);text('hover-notes',s.hover_notes);text('display-notes',s.display_notes);
  text('ambient-notes',s.motion.ambient);text('action-notes',s.motion.action);byId('interaction-prompt').href='../'+s.interaction_prompt_path;
  const list=byId('control-list');list.replaceChildren();
  for(const c of [...s.controls,...s.shared_controls]){const b=document.createElement('button');b.type='button';b.className='control-row';b.setAttribute('aria-pressed','false');b.append(document.createTextNode(c.label));const label=document.createElement('span');label.textContent=c.id+' / '+c.kind;b.append(label);b.addEventListener('click',()=>inspect(c,b));list.append(b);}
  byId('control-result').replaceChildren(Object.assign(document.createElement('p'),{textContent:'Select a control to inspect its route and behavior.'}));
  document.querySelectorAll('[data-select]').forEach(el=>{if(el.dataset.select===id)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
  if(updateHash)history.replaceState(null,'','#'+id);
 }
 function inspect(c,button){
  document.querySelectorAll('.control-row').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  const panel=byId('control-result');panel.replaceChildren();
  const put=(tag,value,cls)=>{const el=document.createElement(tag);el.textContent=value;if(cls)el.className=cls;panel.append(el);return el;};
  put('p',c.id,'eyebrow');put('h3',c.label);put('p',c.effect);put('p','Input: '+c.trigger);put('p',c.implementation,'small');
  put('p','Rollover / press / focus','eyebrow');put('p',c.rollover);put('p',c.motion_feedback,'small');
  if(c.target.startsWith('aux:')){put('p','Additional route: '+c.target.slice(4).replaceAll('-',' '),'eyebrow');put('p',app.auxiliary_routes[c.target.slice(4)]);put('p','This route is specified in the MD ledger; it has no additional image in this five-screen set.','small');}
  else if(app.screens.some(s=>s.id===c.target)){const b=put('button','View pictured destination →','pill');b.type='button';b.addEventListener('click',()=>{select(c.target);byId('screen-title').tabIndex=-1;byId('screen-title').focus({preventScroll:true});});put('p','The destination uses its pictured review state. Saved values and edits are described in the ledger.','small');}
  else put('p',c.target==='none'?'Display-only status; no navigation.':'The action updates the current screen state. See the ledger for persistence and recovery.','small');
 }
 document.querySelectorAll('[data-select]').forEach(el=>el.addEventListener('click',event=>{event.preventDefault();select(el.dataset.select);byId('walkthrough').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));
 byId('previous').addEventListener('click',()=>select(app.screens[current-1].id));byId('next').addEventListener('click',()=>select(app.screens[current+1].id));
 addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(app.screens.some(s=>s.id===id))select(id,false);});
 const initial=location.hash.slice(1);select(app.screens.some(s=>s.id===initial)?initial:app.screens[0].id,false);
})();
