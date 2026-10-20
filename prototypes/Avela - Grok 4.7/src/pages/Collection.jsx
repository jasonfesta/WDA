import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { money, products } from '../data/catalog'
import { useBag } from '../context/BagContext'

const filters = [
  { id: 'all', label: 'All' },
  { id: 'arc', label: 'Arc' },
  { id: 'fold', label: 'Fold' },
  { id: 'day', label: 'Day' },
]

export default function Collection() {
  const [filter, setFilter] = useState('all')
  const { add } = useBag()
  const shown = products.filter((product) => filter === 'all' || product.id === filter)

  useEffect(() => {
    document.title = 'Collection — Avela'
  }, [])

  return (
    <>
      <section className="wrap page-intro">
        <p className="eyebrow">The collection</p>
        <h1>Choose the shape that follows your day.</h1>
        <p className="lede">
          Arc is the crescent. Fold is the flap. Day is the open tote. Filter by shape, then compare the opening,
          the carry, and the size.
        </p>
      </section>

      <section className="wrap filter-block">
        <div className="filter-copy">
          <h2>Arc / Fold / Day.</h2>
          <p>Three outlines. The color stays with the shape: burgundy, camel, olive.</p>
        </div>
        <div className="filters" role="group" aria-label="Filter by shape">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              className={filter === item.id ? 'on' : ''}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="wrap product-grid" aria-live="polite">
        {shown.map((product) => (
          <article className="product-card" key={product.id}>
            <Link to={product.path}>
              <img src={product.card} alt={product.cardAlt} />
            </Link>
            <div className="card-meta">
              <div>
                <h3>
                  <Link to={product.path}>{product.name}</Link>
                </h3>
                <p>{product.color}</p>
              </div>
              <strong>{money(product.price)}</strong>
            </div>
            <p className="swatches" aria-label={`${product.name} color`}>
              <i style={{ background: product.swatch }} />
              {product.dimensions}
            </p>
            <button type="button" className="btn solid" onClick={() => add(product.id, 1)}>
              Add {product.name} to bag
            </button>
          </article>
        ))}
      </section>

      <section className="wrap split">
        <img src="/images/shoulder.jpg" alt="Arc carried on the shoulder, seen from the side" />
        <div>
          <h2>A curve with a little certainty.</h2>
          <p>Arc stays at the hip. Fold closes flat under the arm. Day stands open when both hands are needed.</p>
          <Link to="/arc">Start with Arc</Link>
        </div>
      </section>

      <section className="wrap split reverse">
        <div>
          <h2>From the smaller things within reach</h2>
          <p>Day is the one with room. Set it down, and the olive leather still reads as a tote, not a crescent and not a flap.</p>
          <Link to="/day">See Day</Link>
        </div>
        <img src="/images/day-sea.jpg" alt="Olive Day tote on a wall by the sea" />
      </section>

      <section className="wrap compare">
        <h2>Choose by opening, width, and clasp.</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col"> </th>
                {products.map((product) => (
                  <th key={product.id} scope="col" className={filter === product.id ? 'active-col' : ''}>
                    <img src={product.mini} alt="" />
                    {product.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Opening</th>
                {products.map((product) => (
                  <td key={product.id}>{product.opening}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Carry</th>
                {products.map((product) => (
                  <td key={product.id}>{product.carry}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Size</th>
                {products.map((product) => (
                  <td key={product.id}>{product.dimensions}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Price</th>
                {products.map((product) => (
                  <td key={product.id}>{money(product.price)}</td>
                ))}
              </tr>
              <tr>
                <th scope="row"> </th>
                {products.map((product) => (
                  <td key={product.id}>
                    <Link to={product.path}>See {product.name}</Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="wrap split">
        <img src="/images/clasp-macro.jpg" alt="Macro of a gold clasp against burgundy leather" />
        <div>
          <h2>The hardware stays quiet.</h2>
          <p>A clasp on Arc, a magnet under the Fold flap, and an open mouth on Day. The metal never tries to be the shape.</p>
          <Link to="/care">Care for the small parts</Link>
        </div>
      </section>

      <section className="quote-band slim">
        <div className="quote-copy">
          <h2>The opening makes the small things easy to hold.</h2>
          <p>Dimensions, delivery notes, and care live with each shape, before you decide.</p>
        </div>
        <img src="/images/col-quote-carry.jpg" alt="Arc carried along the coast" />
      </section>
    </>
  )
}
