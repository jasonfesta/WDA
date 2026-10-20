import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Accordion from '../components/Accordion'

const steps = [
  { href: '#after', label: '01 After a day out' },
  { href: '#rest', label: '02 Give it a place to rest' },
  { href: '#weather', label: '03 When the weather changes' },
  { href: '#surface', label: '04 Let the surface tell its story' },
  { href: '#parts', label: '05 Look after the small parts' },
  { href: '#repair', label: '06 A clean is a repair' },
]

export default function Care() {
  useEffect(() => {
    document.title = 'Care — Avela'
  }, [])

  return (
    <>
      <section className="wrap care-hero">
        <div>
          <p className="eyebrow">Care</p>
          <h1>Keep the curve in good company.</h1>
          <p className="lede">Leather keeps the day it was given. These notes are how Arc, Fold, and Day stay themselves.</p>
        </div>
        <img src="/images/care-clasp.jpg" alt="Gold clasp against the burgundy curve of Arc" />
        <ol className="care-index">
          {steps.map((step) => (
            <li key={step.href}>
              <a href={step.href}>{step.label}</a>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap care-block" id="after">
        <div>
          <h2>After a day out.</h2>
          <p>Empty the bag before it is put away. Tissue in the opening keeps the shape while the leather cools.</p>
        </div>
        <div className="trio">
          <figure>
            <img src="/images/care-empty.jpg" alt="Bag emptied, with its contents set beside it" />
            <figcaption>Empty it</figcaption>
          </figure>
          <figure>
            <img src="/images/care-tissue.jpg" alt="Tissue placed inside the Arc opening" />
            <figcaption>Tissue the opening</figcaption>
          </figure>
          <figure>
            <img src="/images/care-resting.jpg" alt="Arc closed and resting" />
            <figcaption>Let it rest</figcaption>
          </figure>
        </div>
      </section>

      <section className="wrap split" id="rest">
        <div>
          <h2>Give it a place to rest.</h2>
          <p>A shelf, out of the sun, with the handle up. Arc likes a light stuff. Fold likes to close. Day likes to stand.</p>
        </div>
        <img src="/images/care-rest.jpg" alt="Arc resting beside a ceramic vase on stone" />
      </section>

      <section className="wrap care-block" id="weather">
        <div>
          <h2>When the weather changes.</h2>
          <p>Rain, heat, and salt air ask for different pauses. None of them ask for soaking the leather.</p>
        </div>
        <div className="trio">
          <figure>
            <img src="/images/weather-1.jpg" alt="Arc in profile" />
            <figcaption>Rain: wipe, then air</figcaption>
          </figure>
          <figure>
            <img src="/images/weather-2.jpg" alt="Arc on a quiet shelf" />
            <figcaption>Heat: out of the car</figcaption>
          </figure>
          <figure>
            <img src="/images/weather-3.jpg" alt="Close view of leather grain" />
            <figcaption>Salt air: dry, then rest</figcaption>
          </figure>
        </div>
      </section>

      <section className="wrap split reverse" id="surface">
        <img src="/images/care-grain.jpg" alt="Burgundy leather grain in raking light" />
        <div>
          <h2>Let the surface tell its story.</h2>
          <p>A soft cloth is enough. Skip soaking, harsh cleaners, and anything that promises to make the hide new again.</p>
        </div>
      </section>

      <section className="wrap care-block" id="parts">
        <div>
          <h2>Look after the small parts.</h2>
          <p>The clasp, the zipper, and the pocket see the hand more often than the body does.</p>
        </div>
        <div className="trio">
          <figure>
            <img src="/images/parts-clasp.jpg" alt="Close view of the Arc clasp" />
            <figcaption>Clasp</figcaption>
          </figure>
          <figure>
            <img src="/images/parts-zip.jpg" alt="Zipper teeth in burgundy leather" />
            <figcaption>Zipper</figcaption>
          </figure>
          <figure>
            <img src="/images/parts-pocket.jpg" alt="Open pocket with a small leather case inside" />
            <figcaption>Pocket</figcaption>
          </figure>
        </div>
      </section>

      <section className="wrap care-block" id="repair">
        <div>
          <h2>A clean is a repair.</h2>
          <p>Most of what looks like wear is dust, a tight stuff, or a day of rain. Start there before anything else.</p>
        </div>
        <div className="repair-grid">
          <article>
            <h3>Photograph it</h3>
            <p>A clear picture of the clasp, the seam, or the spot on the hide.</p>
          </article>
          <article>
            <h3>Write the day</h3>
            <p>Rain, heat, or a catch on the zipper. The condition has a cause.</p>
          </article>
          <article>
            <h3>Pause</h3>
            <p>Let it dry and rest before deciding it needs new leather.</p>
          </article>
        </div>
      </section>

      <section className="wrap care-next">
        <div>
          <img src="/images/care-woman.jpg" alt="Arc carried beside a stone wall and the sea" />
        </div>
        <div>
          <h2>Find the right next step</h2>
          <p>Open the note that matches the bag in front of you.</p>
          <Accordion
            name="care-next"
            items={[
              {
                title: 'Daily care',
                body: 'Empty Arc, Fold, or Day the evening you carry it. A dry cloth over the leather is the whole routine on an ordinary day.',
              },
              {
                title: 'Storage',
                body: 'Stuff Arc lightly so the crescent holds. Close Fold. Let Day stand. Keep all three out of direct sun.',
              },
              {
                title: 'Weather',
                body: 'After rain, wipe and air the bag open. After heat, let it cool before it goes back in a sleeve. After salt air, a dry brush of the cloth is enough.',
              },
              {
                title: 'Repair',
                body: 'If a clasp loosens or a seam opens, stop carrying it and keep the piece. This page cannot book a repair. It is a care guide for the demo shop.',
              },
            ]}
          />
          <p className="demo-note">
            <span>Demo</span>
            Care notes are part of this preview. They do not submit a repair request.
          </p>
          <Link to="/arc">Back to Arc</Link>
        </div>
      </section>

      <section className="quote-band">
        <div className="quote-copy">
          <h2>In good company with Avela.</h2>
          <blockquote>
            <p>“Keep the curve, and the bag keeps the day.”</p>
          </blockquote>
        </div>
        <img src="/images/care-quote-navy.jpg" alt="Arc held by someone in a navy dress" />
        <img src="/images/care-quote-sea.jpg" alt="Arc on a stone ledge by the water" />
      </section>
    </>
  )
}
