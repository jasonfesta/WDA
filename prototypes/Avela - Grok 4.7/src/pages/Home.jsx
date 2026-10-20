import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const ways = [
  { src: '/images/way-arc.jpg', alt: 'Arc carried with a cream dress', name: 'Arc', text: 'The crescent, held in one hand.' },
  { src: '/images/way-fold.jpg', alt: 'Fold carried over a navy shoulder', name: 'Fold', text: 'The flap, close against the coat.' },
  { src: '/images/way-day.jpg', alt: 'Day carried in olive leather', name: 'Day', text: 'The tote, open for the afternoon.' },
]

export default function Home() {
  useEffect(() => {
    document.title = 'Avela — Soft Form'
  }, [])

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow light">Arc / Fold / Day</p>
          <h1>A curve for the unplanned day.</h1>
          <p>Three leather shapes, cut in small runs and finished by hand.</p>
          <Link className="btn ghost light" to="/collection">
            Explore the collection
          </Link>
        </div>
        <div className="hero-photo">
          <img src="/images/hero-woman.jpg" alt="A burgundy Arc held against a cream dress and blue sky" />
        </div>
        <p className="soft-form">SOFT FORM</p>
      </section>

      <section className="wrap company">
        <img src="/images/trio-bags.jpg" alt="Arc in burgundy, Fold in camel, and Day in olive, lined up on stone" />
        <div>
          <h2>Curves in company.</h2>
          <p>Explore Arc, Fold, and Day. Each keeps its own silhouette.</p>
          <Link to="/collection">See the three shapes</Link>
        </div>
      </section>

      <section className="wrap center-block">
        <h2>The Arc, opened up</h2>
        <p>A soft body, a metal clasp, and an opening wide enough for the things you actually carry.</p>
        <div className="trio">
          <figure>
            <img src="/images/detail-ruche.jpg" alt="Ruched burgundy body of the Arc" />
            <figcaption>The body</figcaption>
          </figure>
          <figure>
            <img src="/images/detail-zip.jpg" alt="Zipper and leather grain on Arc" />
            <figcaption>The opening</figcaption>
          </figure>
          <figure>
            <img src="/images/detail-clasp.jpg" alt="Gold clasp on the Arc handle" />
            <figcaption>The clasp</figcaption>
          </figure>
        </div>
      </section>

      <section className="wrap split">
        <img src="/images/hides.jpg" alt="Burgundy, olive, and camel leather hides folded together" />
        <div>
          <h2>From hide to handle</h2>
          <p>Burgundy for Arc. Camel for Fold. Olive for Day. The color belongs to the shape.</p>
          <Link to="/story">Read the making</Link>
        </div>
      </section>

      <section className="wrap split reverse">
        <div>
          <h2>Space without the bulk</h2>
          <p>Arc measures 30 × 22 × 10 cm. It holds a phone, cards, and a small notebook without standing away from the body.</p>
          <Link to="/arc">See Arc, $420</Link>
        </div>
        <img src="/images/flatlay.jpg" alt="Arc on stone with sunglasses, a card case, and a phone" />
      </section>

      <section className="full-photo">
        <img src="/images/coastal-walk.jpg" alt="Arc carried along a stone path above the sea" />
      </section>

      <section className="wrap split tight">
        <div>
          <h2>Our own for the small run</h2>
          <p>Each shape is cut when the hide is on the table. The run stays small enough that the curve can still be adjusted by hand.</p>
        </div>
        <Link to="/story">Inside the workshop</Link>
      </section>

      <section className="wrap">
        <div className="section-head">
          <h2>Three ways to carry it</h2>
          <p>The same hour, three different outlines.</p>
        </div>
        <div className="trio portraits">
          {ways.map((way) => (
            <figure key={way.name}>
              <img src={way.src} alt={way.alt} />
              <figcaption>
                <strong>{way.name}</strong>
                <span>{way.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="wrap center-block">
        <h2>A visual book from the cutting table</h2>
        <p>Pattern, hand, and the coast where the bags are carried.</p>
        <div className="trio">
          <figure>
            <img src="/images/sketch.jpg" alt="Pencil pattern studies of a crescent bag" />
            <figcaption>The pattern</figcaption>
          </figure>
          <figure>
            <img src="/images/hands-cut.jpg" alt="Hands cutting burgundy leather" />
            <figcaption>The cut</figcaption>
          </figure>
          <figure>
            <img src="/images/coast-town.jpg" alt="Stone coast and sea beyond a terrace" />
            <figcaption>The day</figcaption>
          </figure>
        </div>
      </section>

      <section className="quote-band">
        <div className="quote-copy">
          <h2>In good company with Avela.</h2>
          <blockquote>
            <p>“The opening makes the small things easy to hold.”</p>
            <footer>From the cutting table</footer>
          </blockquote>
        </div>
        <img src="/images/quote-seated.jpg" alt="Arc resting in the lap of a cream dress" />
        <img src="/images/quote-foldback.jpg" alt="Camel Fold bag seen from the back" />
      </section>

      <section className="wrap instagram">
        <div>
          <h2>Avela, in the everyday</h2>
          <p>A few notes from the bench and the path.</p>
        </div>
        <div className="ig-row">
          <img src="/images/ig-olive.jpg" alt="Olive Day bag outdoors" />
          <img src="/images/ig-grain.jpg" alt="Close grain of burgundy leather" />
          <img src="/images/ig-hands.jpg" alt="Hands setting a metal clasp into leather" />
          <img src="/images/ig-coast.jpg" alt="Arc carried beside the sea" />
        </div>
      </section>
    </>
  )
}
