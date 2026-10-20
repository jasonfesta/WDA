import { useState, type FormEvent } from 'react'
import { Accordion, Editorial, Icon, Photo, SectionTitle, Triptych } from '../components/ui'
import { usefulAnswers } from '../data'

const topics = [
  ['daily', 'The everyday ritual'],
  ['storage', 'A place to rest'],
  ['weather', 'When the weather changes'],
  ['character', 'Natural character'],
  ['details', 'The small parts'],
  ['repair', 'Repairs & guidance'],
]

function readDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem('avela-care-draft') || '{}')
    return { name: typeof draft.name === 'string' ? draft.name : '', email: typeof draft.email === 'string' ? draft.email : '', message: typeof draft.message === 'string' ? draft.message : '', product: ['Arc', 'Fold', 'Day'].includes(draft.product) ? draft.product : 'Arc' }
  } catch { return { name: '', email: '', message: '', product: 'Arc' } }
}

export default function Care() {
  const [formOpen, setFormOpen] = useState(false)
  const [draft, setDraft] = useState(readDraft)
  const [status, setStatus] = useState('')
  const save = (event: FormEvent) => {
    event.preventDefault()
    try {
      localStorage.setItem('avela-care-draft', JSON.stringify(draft))
      setStatus('Your care draft is saved on this device. Nothing has been sent.')
    } catch { setStatus('Your draft is still here, but this browser could not save it. Nothing has been sent.') }
  }
  return <>
    <section className="care-intro section"><div><p className="eyebrow">Care & guidance</p><h1>Keep the curve<br />in good company.</h1><p>A little attention goes a long way.<br />Your practical companion for Avela leather goods.</p></div><Photo name="care-hero" alt="A close detail of Arc’s burgundy leather and warm metal hardware" eager /><nav aria-label="Care guide chapters"><p className="eyebrow">Your care guide</p>{topics.map(([id, title], i) => <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}><span>{String(i + 1).padStart(2, '0')}</span>{title}<Icon name="arrow" size={14} /></button>)}</nav></section>
    <section id="daily" className="section daily-care"><div><p className="eyebrow">01 — A simple ritual</p><h2>After a day out.</h2><p>A moment of care before tomorrow begins.</p></div><Triptych cards={[
      { image: 'care-empty', title: 'Empty', body: 'Take everything out. Check the corners for loose dust.' },
      { image: 'care-wipe', title: 'Wipe', body: 'Use a clean, dry, soft cloth. Keep the touch gentle.' },
      { image: 'care-rest', title: 'Rest', body: 'Let the leather breathe and settle back into its shape.' },
    ]} /></section>
    <Editorial id="storage" image="storage" alt="Arc resting on a soft cloth beside a ceramic vase" eyebrow="02 — Until the next day" title="Give it a place to rest." reverse><p>Store your bag in a breathable cloth bag. Support the shape gently with clean tissue and leave a little space around it.</p><p>A cool, dry place away from direct sunlight is a good home between outings.</p></Editorial>
    <section id="weather" className="section weather-care"><SectionTitle eyebrow="03 — A little preparation" title="When the weather changes.">Keep your piece away from prolonged moisture and direct heat.</SectionTitle><Triptych cards={[
      { image: 'weather', title: 'Caught in the rain?', body: 'Gently blot moisture with a dry, soft cloth. Do not rub or soak the surface.' },
      { image: 'care-rest', title: 'Let it dry naturally', body: 'Leave your bag at room temperature, away from radiators and hair dryers.' },
      { image: 'leather', title: 'Give it a little time', body: 'Let it dry completely before storing. If a mark remains, ask a leather-care specialist.' },
    ]} /></section>
    <Editorial id="character" image="patina" alt="The natural grain and folds of burgundy leather" eyebrow="04 — A surface with a story" title="Let the surface tell its story."><p>Soft creases and subtle shifts in tone can be part of living with natural leather.</p><p>Avoid household cleaners or untested treatments. If you are unsure about a mark, seek care advice before trying to remove it.</p></Editorial>
    <section id="details" className="section gallery-section"><SectionTitle eyebrow="05 — The details you reach for" title="Look after the small parts.">A little care at every point of contact.</SectionTitle><Triptych cards={[
      { image: 'hardware', title: 'The hardware', body: 'Wipe gently with a dry cloth. Avoid abrasive polish.' },
      { image: 'zipper', title: 'The opening', body: 'Close smoothly, without forcing. Keep loose threads clear.' },
      { image: 'care-interior', title: 'The inside', body: 'Leave some space. A comfortable fit protects the shape.' },
    ]} /></section>
    <section id="repair" className="section repair-section"><SectionTitle eyebrow="06 — A useful starting point" title="Ask about a repair.">A few details help start the right conversation.</SectionTitle>
      <div className="repair-steps">{[
        { icon: 'camera' as const, title: 'Take a clear photo', body: 'Capture the whole piece and a close view of the area.' },
        { icon: 'mail' as const, title: 'Describe the detail', body: 'Note the product, the issue, and how it happened.' },
        { icon: 'repair' as const, title: 'Find the right care', body: 'Ask for guidance before sending your piece anywhere.' },
      ].map(item => <div key={item.title}><Icon name={item.icon} size={30} /><h3>{item.title}</h3><p>{item.body}</p></div>)}</div>
      <button className="button outline" aria-expanded={formOpen} aria-controls="care-draft" onClick={() => setFormOpen(!formOpen)}>{formOpen ? 'Close care draft' : 'Prepare a care draft'}<Icon name={formOpen ? 'minus' : 'arrow'} size={17} /></button>
      {formOpen && <form id="care-draft" className="care-form" onSubmit={save}><h3>A note about your piece.</h3><p className="form-note">Local draft only. This form saves on your device and does not contact a support team.</p><div className="form-grid"><label>Your name<input autoComplete="name" value={draft.name} maxLength={100} required onChange={e => setDraft({ ...draft, name: e.target.value })} /></label><label>Email address<input type="email" autoComplete="email" value={draft.email} maxLength={254} required onChange={e => setDraft({ ...draft, email: e.target.value })} /></label></div><label>Your piece<select value={draft.product} onChange={e => setDraft({ ...draft, product: e.target.value })}><option>Arc</option><option>Fold</option><option>Day</option></select></label><label>What would you like help with?<textarea value={draft.message} required rows={4} maxLength={3000} onChange={e => setDraft({ ...draft, message: e.target.value })} /></label><button className="button" type="submit">Save draft on this device <Icon name="arrow" /></button><p role="status">{status}</p></form>}
    </section>
    <section className="care-next"><Photo name="care-lifestyle" alt="Arc carried by a woman beside a sunlit stone wall" /><div><p className="eyebrow">A little more guidance</p><h2>Find the right next step.</h2><Accordion items={usefulAnswers.slice(1)} /></div></section>
  </>
}
