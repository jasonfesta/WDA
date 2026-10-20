import { useEffect } from 'react'

export default function Story() {
  useEffect(() => {
    document.title = 'Our Story — Avela'
  }, [])

  return (
    <>
      <section className="story-hero">
        <p className="eyebrow light">Our story</p>
        <h1>The shape starts on paper.</h1>
        <p>The curve is drawn before the hide is chosen.</p>
      </section>

      <section className="story-photo">
        <img src="/images/story-draw.jpg" alt="Hands drawing bag patterns on a paper-covered table" />
        <div className="story-caption">
          <h2>Start with a line.</h2>
          <p>Arc, Fold, and Day begin as three drawings. The crescent, the flap, and the open tote are decided here.</p>
        </div>
      </section>

      <section className="wrap split">
        <img src="/images/story-leather.jpg" alt="A sweep of burgundy leather grain" />
        <div>
          <h2>Choose by touch.</h2>
          <p>The hide has to take a gather for Arc, hold a crease for Fold, and stand quietly for Day.</p>
        </div>
      </section>

      <section className="wrap center-block">
        <h2>Follow the cut.</h2>
        <p>Pattern, pieces, and the edge that will become a seam.</p>
        <div className="trio">
          <figure>
            <img src="/images/cut-sketch.jpg" alt="A pencil sketch of the crescent pattern" />
            <figcaption>The pattern</figcaption>
          </figure>
          <figure>
            <img src="/images/cut-pieces.jpg" alt="Cut pieces of burgundy leather" />
            <figcaption>The pieces</figcaption>
          </figure>
          <figure>
            <img src="/images/cut-edge.jpg" alt="Fingers holding a stitched leather edge" />
            <figcaption>The edge</figcaption>
          </figure>
        </div>
      </section>

      <section className="wrap split reverse">
        <div>
          <h2>Make the join.</h2>
          <p>The seam is stitched where the curve needs support, and left soft where the bag should collapse in the hand.</p>
        </div>
        <img src="/images/story-sew.jpg" alt="Hands sewing the edge of a burgundy bag" />
      </section>

      <section className="wrap center-block">
        <h2>Refine the contact points.</h2>
        <p>Clasp, body, and zipper. These are the places the hand meets the bag every day.</p>
        <div className="trio tall">
          <figure>
            <img src="/images/story-hardware.jpg" alt="Gold clasp on gathered burgundy leather" />
            <figcaption>Clasp</figcaption>
          </figure>
          <figure>
            <img src="/images/story-body.jpg" alt="Gathered body of the Arc" />
            <figcaption>Body</figcaption>
          </figure>
          <figure>
            <img src="/images/story-zip.jpg" alt="Zipper set into burgundy leather" />
            <figcaption>Zipper</figcaption>
          </figure>
        </div>
      </section>

      <section className="wrap split">
        <img src="/images/story-motion.jpg" alt="Arc carried along a stone wall above the sea" />
        <div>
          <h2>Watch it in motion.</h2>
          <p>A bag that only looks right on the table is sent back to the pattern. Arc has to swing. Fold has to close. Day has to stand.</p>
        </div>
      </section>

      <section className="wrap center-block">
        <h2>Keep asking better questions.</h2>
        <p>Does the opening clear the hand? Does the color still belong to that shape? Does it rest without slumping?</p>
        <div className="duo">
          <img src="/images/story-q1.jpg" alt="Pattern sketch and a pencil on the bench" />
          <img src="/images/story-q2.jpg" alt="Leather pieces and notes on a wooden desk" />
        </div>
      </section>

      <section className="quote-band">
        <div className="quote-copy">
          <h2>The opening makes the small things easy to hold.</h2>
        </div>
        <img src="/images/story-quote-sit.jpg" alt="Hands opening Arc while seated" />
        <img src="/images/story-quote-sea.jpg" alt="Arc set on stone with the sea behind it" />
      </section>
    </>
  )
}
