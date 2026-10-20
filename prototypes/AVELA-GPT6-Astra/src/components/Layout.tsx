import { useEffect, useState, type FormEvent } from 'react'
import { navigation, products, money } from '../data'
import { useStore } from '../store'
import { Icon, Modal, Photo, TextLink } from './ui'

export function Header({ path }: { path: string }) {
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const [query, setQuery] = useState('')
  const { count, setBagOpen } = useStore()
  const isHome = path === '/'
  const isStory = path === '/story'
  useEffect(() => { setMenu(false); setSearch(false) }, [path])
  const results = products.filter(p => `${p.name} ${p.color} ${p.description}`.toLowerCase().includes(query.toLowerCase().trim()))
  const nav = (mobile = false) => navigation.map(item =>
    <a key={item.href} href={item.href} aria-current={item.href === `#${path}` ? 'page' : undefined} onClick={() => { if (mobile) setMenu(false) }}>{item.label}</a>,
  )
  return <>
    <header className={`site-header ${isHome ? 'on-hero' : ''} ${isStory ? 'on-wine' : ''}`}>
      <button className="icon-button menu-toggle" aria-label="Open navigation" onClick={() => setMenu(true)}><Icon name="menu" /></button>
      <a className="wordmark" href="#/" aria-label="Avela home">AVELA</a>
      <nav className="desktop-nav" aria-label="Main navigation">{nav()}</nav>
      <div className="header-actions">
        <button className="icon-button search-toggle" aria-label="Search collection" onClick={() => setSearch(true)}><Icon name="search" size={18} /></button>
        <button className="bag-trigger" onClick={() => setBagOpen(true)} aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`}><span>Bag ({count})</span><Icon name="bag" size={18} /></button>
      </div>
    </header>
    <Modal open={menu} onClose={() => setMenu(false)} title="Explore Avela" className="menu-modal">
      <nav aria-label="Mobile navigation">{nav(true)}</nav>
      <button className="mobile-search-button" onClick={() => { setMenu(false); setSearch(true) }}>Search the collection <Icon name="search" size={18} /></button>
      <Photo name="collection" alt="Arc, Fold, and Day in afternoon light" />
      <p>A considered shape for an unplanned day.</p>
    </Modal>
    <Modal open={search} onClose={() => setSearch(false)} title="Find your form" className="search-modal">
      <label className="field-label" htmlFor="site-search">Search by shape, colour, or detail</label>
      <div className="search-field"><input id="site-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try “Arc” or “Olive”" autoComplete="off" autoFocus /><Icon name="search" /></div>
      <p className="eyebrow">{results.length} {results.length === 1 ? 'piece' : 'pieces'}</p>
      <div className="search-results">{results.map(product => <a href={`#/product/${product.id}`} key={product.id} onClick={() => setSearch(false)}>
        <Photo name={product.image} alt={`${product.name} in ${product.color}`} />
        <div><h3>{product.name}</h3><p>{product.color}</p><span>{money(product.price)}</span></div><Icon name="arrow" />
      </a>)}</div>
      {results.length === 0 && <p className="empty-copy">No pieces found. Try Arc, Fold, Day, Burgundy, Saddle, or Olive.</p>}
    </Modal>
  </>
}

const community = [
  { image: 'arc-worn', title: 'A curve, carried close.', body: 'Arc in Burgundy. A familiar shape for the unfamiliar turn.' },
  { image: 'leather', title: 'A little closer.', body: 'Grain, folds, and the way leather catches the light.' },
  { image: 'craft', title: 'Time at the workbench.', body: 'The small, repeated decisions behind a considered piece.' },
  { image: 'arc-coast', title: 'An afternoon without a plan.', body: 'Good company, a little sea air, and room for what comes next.' },
]

export function Community() {
  const [selected, setSelected] = useState<number | null>(null)
  return <>
    <section className="company-band">
      <div><p className="eyebrow">A little less planned</p><h2>In good company<br /> with Avela.</h2><p>Objects to live with.<br />Days to make your own.</p><TextLink href="#/collection">Find your everyday piece</TextLink></div>
      <Photo name="arc-seated" alt="Arc resting on a lap in the afternoon sun" />
      <Photo name="fold-campaign" alt="The Fold bag in saddle leather, worn over the shoulder" />
    </section>
    <section className="community">
      <div className="community-heading"><h2>Avela, in the everyday.</h2><span className="eyebrow">A visual notebook <Icon name="camera" size={17} /></span></div>
      <div className="community-images">{community.map((item, i) => <button key={item.image} onClick={() => setSelected(i)} aria-label={`View photograph: ${item.title}`}><Photo name={item.image} alt={item.title} /><span><Icon name="plus" /></span></button>)}</div>
    </section>
    <Modal open={selected !== null} onClose={() => setSelected(null)} title={community[selected ?? 0].title} className="lightbox">
      {selected !== null && <><Photo name={community[selected].image} alt={community[selected].title} /><p>{community[selected].body}</p><div className="lightbox-controls">
        <button className="text-button" onClick={() => setSelected((selected + community.length - 1) % community.length)}>← Previous</button><span>{selected + 1} / {community.length}</span><button className="text-button" onClick={() => setSelected((selected + 1) % community.length)}>Next →</button>
      </div></>}
    </Modal>
  </>
}

export function Footer() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [info, setInfo] = useState<'privacy' | 'terms' | null>(null)
  const submit = (event: FormEvent) => {
    event.preventDefault()
    try {
      localStorage.setItem('avela-newsletter-preview', email.trim())
      setMessage('Your preview signup is saved on this device. No email has been sent.')
      setEmail('')
    } catch {
      setMessage('Signup preview complete. This browser cannot save it, and no email has been sent.')
    }
  }
  return <>
    <section className="newsletter">
      <p className="eyebrow">Keep a place for the next piece</p>
      <h2>Letters from Avela.</h2>
      <p>Occasional stories, new shapes, and notes from the studio.</p>
      <form onSubmit={submit}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" placeholder="Your email address" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} /><button type="submit">Join the letters <Icon name="arrow" size={17} /></button></form>
      <p className="form-note" role="status">{message || 'Preview signup · saved on this device only'}</p>
    </section>
    <footer className="site-footer">
      <div className="footer-top"><a className="wordmark" href="#/">AVELA</a><p>For the shape<br />of your day.</p><nav aria-label="Footer navigation">{navigation.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav><div className="footer-service"><a href="#/care?section=repair">Client care</a><button onClick={() => setInfo('privacy')}>Privacy</button><button onClick={() => setInfo('terms')}>Terms</button></div></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Avela</span><span>Concept storefront · USD · No live orders</span><a href="#/" aria-label="Return to Avela home">Considered, from the first curve.</a></div>
    </footer>
    <Modal open={info !== null} onClose={() => setInfo(null)} title={info === 'privacy' ? 'Your privacy' : 'About this concept'}>
      {info === 'privacy' ? <div className="body-copy"><p>This local demonstration stores your shopping bag, saved pieces, preview email signup, and care draft in your browser. It does not send this information to a server.</p><p>There are no analytics, payment processors, or third-party tracking scripts. Fonts and images are served with the project. Clear this site’s browser storage to remove your saved information.</p></div> : <div className="body-copy"><p>Avela is a fictional design concept brought to life as a React storefront. The products, imagery, and editorial copy demonstrate the experience. Purchases, payment processing, delivery, and customer support are not connected.</p><p>Arc’s reference price is $420. Fold and Day use illustrative prices for this prototype. This page is explanatory demo copy, not a live store’s terms of sale.</p></div>}
    </Modal>
  </>
}
