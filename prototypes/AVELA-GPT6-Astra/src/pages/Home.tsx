import { Editorial, Icon, Photo, SectionTitle, TextLink, Triptych } from '../components/ui'

export default function Home() {
  return <>
    <section className="home-hero">
      <Photo name="hero" alt="The burgundy Arc bag carried beside a sunlit terracotta wall on the coast" eager />
      <div className="hero-shade" />
      <div className="hero-intro"><p className="eyebrow">Considered shapes. Unplanned days.</p><h1>A curve for<br />the unplanned day.</h1><p>A gathered silhouette with space<br />for the things you reach for.</p><a className="button outline light" href="#/collection">Explore the collection <Icon name="arrow" size={17} /></a></div>
      <a className="hero-product" href="#/product/arc"><span className="hero-swatches"><i /><i /><i /></span><span>Soft by nature.<br />Considered by design.</span><span className="hero-product-link">Meet the Arc <Icon name="arrow" size={15} /></span></a>
      <div className="hero-word" aria-hidden="true">SOFT FORM</div>
      <span className="hero-index">THE EVERYDAY COLLECTION — 01</span>
    </section>
    <Editorial image="collection" alt="Arc, Fold, and Day bags together on warm stone" eyebrow="Three shapes. Your own way." title="Curves in company." href="#/collection" link="Find your form">
      <p>A softer curve. A considered fold. Room for the whole day. Meet the pieces that make space for you.</p>
    </Editorial>
    <section className="section gallery-section"><SectionTitle eyebrow="An introduction to our signature" title="The Arc, opened up.">From the broad idea to the smallest detail.</SectionTitle>
      <Triptych cards={[
        { image: 'arc-card', title: 'The silhouette', body: 'A gentle curve that sits close, with an opening that gives a little.', href: '#/product/arc' },
        { image: 'zipper', title: 'The inside', body: 'A considered place for the small things you reach for.', href: '#/product/arc' },
        { image: 'hardware', title: 'The finishing touch', body: 'Warm metal, quiet details, and a handle made to meet your hand.', href: '#/story' },
      ]} />
    </section>
    <Editorial image="materials" alt="Burgundy, olive, and saddle leather swatches" eyebrow="A feeling, first" title="From hide to handle." href="#/story" link="Inside our process"><p>Materials chosen for the way they feel, work, and change with use. A little texture. A little character. Always room to become your own.</p></Editorial>
    <Editorial image="essentials" alt="Arc laid out with a notebook, sunglasses, phone, and wallet" eyebrow="Less searching. More living." title="Space without the bulk." reverse href="#/product/arc" link="Explore the Arc"><p>Your phone, wallet, keys, and a pocket notebook. All the little things that make a day yours, close at hand.</p></Editorial>
    <section className="panorama"><Photo name="coast" alt="A woman carrying Arc overlooking the Mediterranean coast" /><div className="panorama-caption"><div><p className="eyebrow">The days between the plans</p><h2>Out past the usual turn.</h2></div><TextLink href="#/collection">See where the day takes you</TextLink></div></section>
    <section className="wearing-band"><div className="wearing-photos"><Photo name="arc-worn" alt="Arc worn over a cream dress" /><Photo name="fold-worn" alt="Fold worn over a black top" /><Photo name="day-worn" alt="Day carried over a green jacket" /></div><div className="editorial-copy"><p className="eyebrow">A form for every rhythm</p><h2>Three ways<br />to make it yours.</h2><p>Different routines. One considered starting point. Find the shape that feels like you.</p><TextLink href="#/collection">Explore all three</TextLink></div></section>
    <section className="section journal"><SectionTitle eyebrow="Notes from the studio" title="A notebook from the cutting table.">The ideas, details, and places that stay with us.</SectionTitle>
      <Triptych cards={[
        { image: 'sketchbook', title: 'Before the first stitch', body: 'Where a line on paper becomes something to live with.', href: '#/story' },
        { image: 'handwork', title: 'A good kind of slow', body: 'A closer look at the decisions made by hand.', href: '#/story' },
        { image: 'coast-detail', title: 'The long way home', body: 'A little care for a piece that comes along for the journey.', href: '#/care' },
      ]} />
    </section>
  </>
}
