(() => {
  'use strict';
  const node = document.getElementById('review-data');
  if (!node) return;
  const data = JSON.parse(node.textContent);
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const $ = id => document.getElementById(id);
  let current = 0;
  const fields = (item, keys) => '<dl>' + keys.map(([key, label]) => `<dt>${label}</dt><dd>${esc(item[key])}</dd>`).join('') + '</dl>';
  function showState(index, updateHash = true, focusResult = false) {
    if (!Number.isInteger(index) || index < 0 || index >= data.states.length) return;
    current = index;
    const state = data.states[index];
    document.querySelectorAll('[data-state]').forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    const activeThumb = document.querySelector('[data-state="' + index + '"]');
    const strip = activeThumb.parentElement;
    if (strip.scrollWidth > strip.clientWidth) strip.scrollLeft = Math.max(0, activeThumb.offsetLeft - strip.offsetLeft - (strip.clientWidth - activeThumb.offsetWidth) / 2);
    $('state-image').src = '../' + state.image.file;
    $('state-image').alt = `${data.name} / ${state.title}`;
    $('state-image').width = state.image.dimensions[0];
    $('state-image').height = state.image.dimensions[1];
    $('state-image-link').href = '../' + state.image.file;
    $('state-caption').textContent = `${String(index + 1).padStart(2, '0')} / ${state.title} · ${state.image.dimensions.join(' × ')}`;
    $('state-count').textContent = `${index + 1} / ${data.states.length}`;
    $('previous-state').disabled = index === 0;
    $('next-state').disabled = index === data.states.length - 1;
    $('state-result').innerHTML = `<p class="eyebrow">${esc(data.slug)} / ${esc(state.id)}</p><h3 tabindex="-1">${esc(state.title)}</h3>${fields(state, [['entry','Entry'],['visible','On screen'],['exit','Exit / return']])}<p class="eyebrow action-label">Follow a path</p><div class="flow-actions">${state.actions.map(a => `<button class="button flow-action" data-target="${esc(a.target)}">${esc(a.label)} →</button><span class="flow-note">${esc(a.note)}</span>`).join('')}</div>`;
    $('state-prompt-link').href = '../' + state.prompt;
    $('state-reference-link').href = '../' + state.reference;
    $('state-ledger-link').href = `../interaction/${data.slug}.md#${state.id}`;
    $('state-prompt-text').textContent = state.prompt_text;
    if (updateHash) history.replaceState(null, '', '#' + state.id);
    if (focusResult) $('state-result').querySelector('h3').focus({preventScroll:true});
  }
  function showControl(index) {
    const control = data.controls[index];
    if (!control) return;
    document.querySelectorAll('[data-control]').forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    $('control-result').innerHTML = `<p class="eyebrow">${esc(data.slug)}-${esc(control.id)}</p><h3>${esc(control.label)}</h3>${fields(control, [['action','Activation'],['rollover','Rollover'],['press','Touch / press'],['keyboard','Keyboard / focus'],['result','Result / return']])}<p class="eyebrow action-label">Related state images</p><div class="actions">${control.states.map(id => `<button class="button" data-related-state="${esc(id)}">${esc(data.states.find(s=>s.id===id).title)} ↗</button>`).join('')}</div>`;
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-state')) showState(Number(button.dataset.state));
    if (button.hasAttribute('data-control')) showControl(Number(button.dataset.control));
    if (button.hasAttribute('data-target')) showState(data.states.findIndex(s=>s.id===button.dataset.target), true, true);
    if (button.hasAttribute('data-related-state')) {
      showState(data.states.findIndex(s=>s.id===button.dataset.relatedState), true, true);
      $('behavior').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    }
    if (button.id === 'previous-state') showState(current - 1);
    if (button.id === 'next-state') showState(current + 1);
  });
  function fromHash() {
    const index = data.states.findIndex(s=>s.id===location.hash.slice(1));
    if (index >= 0) showState(index, false);
  }
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
