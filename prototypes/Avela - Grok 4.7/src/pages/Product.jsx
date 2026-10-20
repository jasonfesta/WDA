import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Accordion from '../components/Accordion'
import { findProduct, money, products } from '../data/catalog'
import { useBag } from '../context/BagContext'

export default function Product({ slug }) {
  const product = findProduct(slug)
  const { add } = useBag()
  const [active, setActive] = useState(0)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    setActive(0)
    setQty(1)
    if (product) document.title = `${product.name} — Avela`
  }, [product])

  if (!product) return null

  const others = products.filter((item) => item.id !== product.id)
  const photo = product.gallery[active]

  return (
    <>
      <section className="wrap pdp">
        <div className="gallery">
          <div className="thumbs">
            {product.gallery.map((image, index) => (
              <button
                key={image.src}
                type="button"
                className={index === active ? 'on' : ''}
                aria-label={`Show image ${index + 1} of ${product.name}`}
                aria-pressed={index === active}
                onClick={() => setActive(index)}
              >
                <img src={image.src} alt="" />
              </button>
            ))}
          </div>
          <img className="gallery-main" src={photo.src} alt={photo.alt} />
        </div>

        <div className="buybox">
          <p className="eyebrow">{product.color}</p>
          <h1>{product.name}</h1>
          <p className="price">{money(product.price)}</p>
          <p>{product.summary}</p>
          <p className="size-line">
            <span className="swatch" style={{ background: product.swatch }} />
            {product.color} · {product.dimensions}
          </p>
          <div className="qty buy-qty">
            <button type="button" aria-label="Decrease quantity" onClick={() => setQty((value) => Math.max(1, value - 1))}>
              –
            </button>
            <span>{qty}</span>
            <button type="button" aria-label="Increase quantity" onClick={() => setQty((value) => Math.min(12, value + 1))}>
              +
            </button>
          </div>
          <button type="button" className="btn solid" onClick={() => add(product.id, qty)}>
            Add to bag · {money(product.price * qty)}
          </button>
          <p className="demo-note">
            <span>Demo</span>
            Adding a bag only updates this browser. Checkout does not take payment.
          </p>
          <Accordion
            name={`${product.id}-facts`}
            items={[
              {
                title: 'Leather',
                body: product.leather,
              },
              {
                title: 'Size',
                body: `${product.name} measures ${product.dimensions}. ${product.fit}.`,
              },
              {
                title: 'Carry',
                body: `${product.carry}. Opening: ${product.opening}.`,
              },
              {
                title: 'Care',
                body: 'Empty it the same day, let the leather rest, and keep it out of prolonged heat and rain. The full notes live on the Care page.',
              },
            ]}
          />
        </div>
      </section>

      {product.id === 'arc' ? <ArcStory /> : <SiblingStory product={product} />}

      <section className="wrap related">
        <h2>The other shapes</h2>
        <div className="related-row">
          {others.map((item) => (
            <Link key={item.id} to={item.path}>
              <img src={item.card} alt={item.cardAlt} />
              <span>
                {item.name} · {item.color} · {money(item.price)}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

function ArcStory() {
  return (
    <>
      <section className="wrap center-block">
        <h2>The shape of Arc.</h2>
        <p>
          A single curve, gathered along the top and closed with a clasp. Arc is $420 and measures 30 × 22 × 10 cm.
          It is the crescent. Fold is the camel flap. Day is the olive tote.
        </p>
      </section>

      <section className="wrap split">
        <div>
          <h2>Open it in the country</h2>
          <p>The mouth opens along the curve, wide enough for a phone and a card sleeve without a second hand.</p>
        </div>
        <img src="/images/arc-open.jpg" alt="Hands holding Arc open with a phone and cards inside" />
      </section>

      <section className="wrap split reverse">
        <img src="/images/arc-carry.jpg" alt="Arc carried at the side on a coastal path" />
        <div>
          <h2>A way to carry it</h2>
          <p>The handle sits in the hand or in the crook of the arm. The body stays close because the depth is 10 cm.</p>
        </div>
      </section>

      <section className="wrap split">
        <img src="/images/arc-stone.jpg" alt="Arc in profile on stone" />
        <div>
          <h2>Inside the opening</h2>
          <p>30 cm across, 22 cm high, 10 cm deep. That is the whole measurement: wide enough, and no extra bulk.</p>
          <Link to="/care">How to look after it</Link>
        </div>
      </section>

      <section className="wrap center-block">
        <h2>Inside the Avela workshop</h2>
        <p>Marked, stitched, and finished with a clasp that reads as a small piece of metal, not a logo.</p>
        <div className="trio">
          <figure>
            <img src="/images/shop-mark.jpg" alt="A hand marking the leather edge" />
            <figcaption>Mark the line</figcaption>
          </figure>
          <figure>
            <img src="/images/shop-stitch.jpg" alt="Hands stitching the Arc seam" />
            <figcaption>Stitch the join</figcaption>
          </figure>
          <figure>
            <img src="/images/shop-clasp.jpg" alt="Gold clasp wrapped on the handle" />
            <figcaption>Set the clasp</figcaption>
          </figure>
        </div>
      </section>

      <section className="wrap split">
        <img src="/images/arc-bag-rest.jpg" alt="Arc resting on a stone surface" />
        <div>
          <h2>Keep the character</h2>
          <p>Stuff the curve lightly when it is not out, so the crescent stays a crescent.</p>
        </div>
      </section>

      <section className="wrap questions">
        <div>
          <h2>A few practical questions</h2>
          <Accordion
            name="arc-questions"
            items={[
              { title: 'What fits', body: 'A phone, a card sleeve, keys, and a small notebook. A water bottle does not.' },
              { title: 'The metal', body: 'One clasp where the handle meets the body, and a zipper along the opening.' },
              { title: 'The size again', body: '30 × 22 × 10 cm. Price $420.' },
              { title: 'If it rains', body: 'Wipe the surface, let it dry open, and keep it away from heat. More on the Care page.' },
            ]}
          />
        </div>
        <aside className="bench-card">
          <img src="/images/mini-arc.jpg" alt="" />
          <p>Arc · Burgundy</p>
          <p>30 × 22 × 10 cm</p>
          <strong>$420</strong>
        </aside>
      </section>

      <section className="quote-band">
        <div className="quote-copy">
          <h2>The opening makes the small things easy to hold.</h2>
        </div>
        <img src="/images/arc-quote-sit.jpg" alt="Arc held while seated by the coast" />
        <img src="/images/arc-quote-wall.jpg" alt="Arc hanging against a sunlit wall" />
      </section>
    </>
  )
}

function SiblingStory({ product }) {
  const second = product.gallery[1]
  const third = product.gallery[2]
  return (
    <section className="wrap split">
      <img src={second.src} alt={second.alt} />
      <div>
        <h2>{product.name} keeps its own line.</h2>
        <p>
          {product.summary} It measures {product.dimensions} and is made in {product.color.toLowerCase()} only, so it
          stays distinct from the other two.
        </p>
        <img className="inline-photo" src={third.src} alt={third.alt} />
      </div>
    </section>
  )
}
