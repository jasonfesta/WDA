import { useState } from 'react'
import { products, money, usefulAnswers } from '../data'
import { useStore } from '../store'
import ProductCard from '../components/ProductCard'
import { Accordion, Editorial, Icon, Photo, SectionTitle, TextLink } from '../components/ui'

export default function Collection() {
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('featured')
  const { saved, count, total, setBagOpen } = useStore()
  const filtered = products.filter(product => filter === 'all' || (filter === 'saved' ? saved.includes(product.id) : product.id === filter))
  const sorted = [...filtered].sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0)
  return <>
    <section className="page-intro collection-intro"><p className="eyebrow">The Avela collection</p><h1>Choose the shape<br />that follows your day.</h1><p>Considered in every curve. Made for the moments between.<br />Three forms, each with a character of its own.</p></section>
    <section className="collection-section section">
      <SectionTitle eyebrow="Find your form" title="Arc / Fold / Day.">A small family of shapes, with room to make them yours.</SectionTitle>
      <div className="collection-toolbar"><div className="filters" aria-label="Filter collection">{[{ id: 'all', label: 'All pieces' }, ...products.map(p => ({ id: p.id, label: p.name })), { id: 'saved', label: `Saved (${saved.length})` }].map(item => <button aria-pressed={filter === item.id} key={item.id} onClick={() => setFilter(item.id)}>{item.label}</button>)}</div><label className="sort-label">Sort by<select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort collection"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div>
      <div className="collection-caption"><p className="eyebrow">{filter === 'saved' ? 'Your considered selection' : 'The everyday collection'}</p><span>{sorted.length} {sorted.length === 1 ? 'piece' : 'pieces'}</span></div>
      <div className="product-grid">{sorted.map(product => <ProductCard product={product} key={product.id} />)}</div>
      {sorted.length === 0 && <div className="empty-collection"><Icon name="heart" size={30} /><h3>Keep a little possibility.</h3><p>Tap the heart on a piece to find it here.</p><button className="button outline" onClick={() => setFilter('all')}>Explore all pieces</button></div>}
    </section>
    <Editorial image="fold-worn" alt="The saddle Fold bag carried over a black sweater" eyebrow="A different kind of curve" title="Make room for Fold." href="#/product/fold" link="Discover Fold" className="fold-editorial"><p>A clean envelope shape meets the softness of leather. Just enough structure for a day with its own ideas.</p></Editorial>
    <Editorial image="day" alt="The olive Day tote in warm afternoon light" eyebrow="The whole day, within reach" title="Go lightly with Day." reverse href="#/product/day" link="Discover Day"><p>For a book you haven’t finished, the market on the way home, and a little more than you planned to carry.</p></Editorial>
    <section className="section comparison"><SectionTitle eyebrow="Different shapes. Thoughtful details." title="Compare the everyday details.">Find the opening, shape, and feeling that suit your day.</SectionTitle>
      <div className="table-scroll"><table><thead><tr><th scope="col"><span className="sr-only">Detail</span></th>{products.map(p => <th scope="col" key={p.id}><a href={`#/product/${p.id}`}><Photo name={p.image} alt={`${p.name} bag`} /><h3>{p.name}</h3></a></th>)}</tr></thead><tbody><tr><th scope="row">Character</th><td>Soft & gathered</td><td>Easy & structured</td><td>Generous & open</td></tr><tr><th scope="row">Colour</th>{products.map(p => <td key={p.id}>{p.color}</td>)}</tr><tr><th scope="row">Your everyday</th><td>The small essentials</td><td>A little more order</td><td>Room for the unexpected</td></tr><tr><th scope="row">Price</th>{products.map(p => <td key={p.id}>{money(p.price)}</td>)}</tr><tr><th scope="row"><span className="sr-only">Discover</span></th>{products.map(p => <td key={p.id}><TextLink href={`#/product/${p.id}`}>Meet {p.name}</TextLink></td>)}</tr></tbody></table></div>
    </section>
    <Editorial image="leather" alt="Close-up of burgundy grained leather" eyebrow="The point where feeling becomes form" title="A closer look at our materials." href="#/story" link="The story behind the surface"><p>Supple texture. A depth of colour. A surface that softens into your own rhythm. It starts with how it feels in your hand.</p></Editorial>
    <section className="section faq-bag"><div><p className="eyebrow">Before you choose</p><h2>The useful little details.</h2><Accordion items={usefulAnswers} /></div><aside className="selection-card"><Icon name="bag" size={30} /><h3>Your considered selection.</h3><p>{count ? `${count} ${count === 1 ? 'piece' : 'pieces'} waiting in your bag.` : 'A place for the pieces that feel like you.'}</p>{count > 0 && <strong>{money(total)}</strong>}<button className="button outline" onClick={() => setBagOpen(true)}>View your bag <Icon name="arrow" /></button></aside></section>
  </>
}
