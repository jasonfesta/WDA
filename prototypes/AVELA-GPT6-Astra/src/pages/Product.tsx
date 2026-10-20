import { useEffect, useState } from 'react'
import type { Product as ProductType } from '../data'
import { money, usefulAnswers, products } from '../data'
import { useStore } from '../store'
import { Quantity } from '../components/Bag'
import { Accordion, Editorial, Icon, Modal, Photo, SectionTitle, TextLink, Triptych } from '../components/ui'
import ProductCard from '../components/ProductCard'

export default function Product({ product }: { product: ProductType }) {
  const [active, setActive] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [zoom, setZoom] = useState(false)
  const { add, saved, toggleSaved } = useStore()
  useEffect(() => { setActive(0); setQuantity(1) }, [product.id])
  const isArc = product.id === 'arc'
  const galleryIndex = Math.min(active, product.gallery.length - 1)
  return <>
    <section className="product-detail section">
      <p className="breadcrumb"><a href="#/collection">Collection</a><span>/</span>{product.name}</p>
      <div className="product-overview">
        <div className="product-gallery">
          <div className="thumbnails" aria-label="Product photographs">{product.gallery.map((image, i) => <button key={image} className={galleryIndex === i ? 'active' : ''} aria-label={`View ${product.name} photograph ${i + 1}`} aria-pressed={galleryIndex === i} onClick={() => setActive(i)}><Photo name={image} alt="" eager={i === 0} /></button>)}</div>
          <div className="main-product-image"><button className="zoom-trigger" aria-label={`Enlarge ${product.name} photograph`} onClick={() => setZoom(true)}><Photo name={product.gallery[galleryIndex]} alt={`${product.name}, ${product.color} — photograph ${galleryIndex + 1}`} eager /><span className="zoom-label"><Icon name="plus" size={18} /> A closer look</span></button><div className="gallery-controls"><button aria-label="Previous product photograph" onClick={() => setActive((galleryIndex + product.gallery.length - 1) % product.gallery.length)}>←</button><span>{galleryIndex + 1} / {product.gallery.length}</span><button aria-label="Next product photograph" onClick={() => setActive((galleryIndex + 1) % product.gallery.length)}>→</button></div></div>
        </div>
        <div className="product-info"><p className="eyebrow">The everyday collection</p><div className="product-title"><h1>Avela / {product.name}</h1><button className={`icon-button favorite ${saved.includes(product.id) ? 'saved' : ''}`} aria-label={`${saved.includes(product.id) ? 'Unsave' : 'Save'} ${product.name}`} aria-pressed={saved.includes(product.id)} onClick={() => toggleSaved(product.id)}><Icon name="heart" /></button></div><p className="product-description">{product.description}</p><p className="product-price">{money(product.price)} <span>USD</span></p><div className="product-color"><span className="swatch" style={{ background: product.hex }} /><span>{product.color} · Grained leather</span></div><div className="buy-row"><Quantity value={quantity} onChange={setQuantity} name={product.name} /><button className="button" onClick={() => add(product.id, quantity)}>Add to bag — {money(product.price * quantity)}<Icon name="arrow" size={17} /></button></div><p className="product-note">A considered piece, for the shape of your day.</p>
          <Accordion items={[
            { title: 'The details', body: isArc ? 'Burgundy grained leather. A softly gathered body, curved shoulder strap, warm metal detailing, and a zipped opening. Width 30 cm · Height 22 cm · Depth 10 cm.' : `${product.description} The ${product.name} is shown in ${product.color.toLowerCase()} leather. Full specifications and dimensions will be confirmed before launch.` },
            { title: 'Care & character', body: 'Dust gently with a clean, dry cloth. Store with a little support in a breathable bag, away from direct sun and heat. Never force the shape or overfill it.' },
            usefulAnswers[2],
          ]} />
        </div>
      </div>
    </section>
    <section className="product-statement"><p className="eyebrow">A form with a feeling</p><h2>The shape of {product.name}.</h2><div><p>{product.note}</p><p>{product.description}</p></div></section>
    {isArc ? <>
      <Editorial image="interior" alt="Arc open with a phone, wallet, and small notebook inside" eyebrow="All the little things" title="Open to the everyday." reverse><p>Phone, wallet, keys, a small notebook. The things you reach for, with a little room between them.</p></Editorial>
      <Editorial image="carry" alt="Arc carried on the shoulder beside a terracotta wall" eyebrow="Close, without holding on" title="A way to carry it." reverse><p>Resting at your side, following your rhythm. A shape that feels easy from the first errand to the longer way home.</p></Editorial>
      <Editorial image="arc-side" alt="The Arc bag sitting on a sunlit stone ledge" eyebrow="Every proportion considered" title="Measured with intention."><div className="dimensions"><div><strong>30</strong><span>cm wide</span></div><div><strong>22</strong><span>cm high</span></div><div><strong>10</strong><span>cm deep</span></div></div><p>Enough room for your essentials. A soft structure that stays close.</p></Editorial>
    </> : <Editorial image={`${product.id}-worn`} alt={`${product.name} carried over the shoulder`} eyebrow="Made for your own rhythm" title={product.id === 'fold' ? 'A little structure. A softer day.' : 'Room for the unexpected.'}><p>{product.description}</p><p>Wear it into your routine. Find the balance between the pieces you need and the space you leave open.</p></Editorial>}
    <section className="section gallery-section"><SectionTitle eyebrow="From the cutting table" title="Inside the Avela workshop.">Cutting, joining, and finishing. Small decisions that make the whole.</SectionTitle><Triptych cards={[
      { image: 'cutting', title: 'The first cut', body: 'A considered pattern gives each panel a purpose.' },
      { image: 'stitching', title: 'The join', body: 'A careful line brings the separate pieces together.' },
      { image: 'hardware-detail', title: 'The finish', body: 'Quiet details at every point that meets your hand.' },
    ]} /></section>
    <Editorial image="care-rest" alt="Arc standing upright in a softly lit room" eyebrow="A piece to live with" title="Keep the character." href="#/care" link="Your care companion"><p>A little attention, now and then. Give the leather room to rest and let its character grow with you.</p></Editorial>
    <section className="section product-faq"><div><p className="eyebrow">Before it becomes yours</p><h2>A few useful answers.</h2></div><Accordion items={isArc ? usefulAnswers : usefulAnswers.slice(1)} /></section>
    <section className="section related"><SectionTitle eyebrow="In good company" title="Other shapes, the same feeling." /><div className="product-grid two">{products.filter(p => p.id !== product.id).map(p => <ProductCard key={p.id} product={p} />)}</div><TextLink href="#/collection">Explore the collection</TextLink></section>
    <Modal open={zoom} onClose={() => setZoom(false)} title={`${product.name}, a little closer`} className="lightbox product-lightbox"><Photo name={product.gallery[galleryIndex]} alt={`${product.name} detail`} /><div className="lightbox-controls"><button className="text-button" onClick={() => setActive((galleryIndex + product.gallery.length - 1) % product.gallery.length)}>← Previous</button><span>{galleryIndex + 1} / {product.gallery.length}</span><button className="text-button" onClick={() => setActive((galleryIndex + 1) % product.gallery.length)}>Next →</button></div></Modal>
  </>
}
