import { Editorial, Photo, SectionTitle, TextLink, Triptych } from '../components/ui'

export default function Story() {
  return <>
    <section className="page-intro story-intro"><p className="eyebrow">Inside the Avela studio</p><h1>The shape starts<br />on paper.</h1><p>A line. A feeling. The beginning of something you’ll carry.</p></section>
    <section className="story-opening"><Photo name="drawing" alt="A designer sketching bag shapes at a sunlit worktable" eager /><div><p className="eyebrow">01 — The first study</p><h2>Start with a line.</h2><p>Before there is a bag, there is a question: how should it sit, open, and move? We start with the way a piece will feel in an ordinary day.</p></div></section>
    <Editorial image="leather" alt="Soft folds of burgundy grained leather" eyebrow="02 — Material matters" title="Choose by touch."><p>A colour with depth. A grain you can feel. The right material brings a drawing into the world, giving the shape its own quiet character.</p><div className="material-note"><span className="material-chip" /><span>Burgundy grained leather<br /><small>The signature Arc study</small></span></div></Editorial>
    <section className="section gallery-section"><SectionTitle eyebrow="03 — From flat to form" title="Follow the cut.">Every panel has a part to play.</SectionTitle><Triptych cards={[
      { image: 'pattern', title: 'The pattern', body: 'A curve on paper becomes a guide for the whole.' },
      { image: 'cut-pattern', title: 'The pieces', body: 'Leather laid out, with attention to grain and direction.' },
      { image: 'seam', title: 'The edge', body: 'The meeting of two surfaces, considered from the start.' },
    ]} /></section>
    <Editorial image="craft" alt="Hands carefully joining a leather seam" eyebrow="04 — The work of the hands" title="Make the join." reverse><p>Small, repeated decisions give the shape its strength. The line of a stitch. The turn of an edge. A connection that feels as considered as it looks.</p><p>There is no single moment when a piece becomes itself. It happens one detail at a time.</p></Editorial>
    <section className="section gallery-section"><SectionTitle eyebrow="05 — Made to meet you" title="Refine the contact points.">The parts you feel before you notice them.</SectionTitle><Triptych cards={[
      { image: 'hardware', title: 'The handle', body: 'A comfortable curve and a quiet metal accent.' },
      { image: 'arc-card', title: 'The gathering', body: 'A little movement that gives the body its softness.' },
      { image: 'zipper', title: 'The opening', body: 'An easy way into the things you carry.' },
    ]} /></section>
    <Editorial image="carry" alt="Arc worn along the coast" eyebrow="06 — Out in the world" title="A shape in motion." href="#/product/arc" link="Meet the finished Arc"><p>The last part of the design belongs to the person who carries it. A shoulder, a hand, a familiar route. The shape starts to find its own rhythm.</p></Editorial>
    <section className="section studio-notes"><SectionTitle eyebrow="The next page" title="Keep asking better questions.">Each piece begins with what the last one taught us.</SectionTitle><div className="studio-pair"><Photo name="sketchbook" alt="A notebook filled with Avela bag studies" /><div><h3>Room for another idea.</h3><p>We come back to the same few things: how a piece feels, what it holds, and the way it becomes part of your everyday.</p><TextLink href="#/collection">Find your starting point</TextLink></div><Photo name="cut-pattern" alt="Leather patterns laid out on a studio table" /></div></section>
  </>
}
