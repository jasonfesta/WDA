import { Link } from 'react-router-dom'
import { money } from '../data/catalog'
import { useBag } from '../context/BagContext'

export default function BagDrawer() {
  const { lines, count, subtotal, open, setOpen, checkoutOpen, setCheckoutOpen, setQty, remove, clear } = useBag()

  if (!open) return null

  return (
    <div className="drawer-root">
      <button type="button" className="drawer-scrim" aria-label="Close bag" onClick={() => setOpen(false)} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="bag-title">
        <header className="drawer-head">
          <h2 id="bag-title">Your bag</h2>
          <button type="button" onClick={() => setOpen(false)}>
            Close
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="drawer-empty">
            <p>The bag is empty.</p>
            <Link to="/collection" onClick={() => setOpen(false)}>
              See the collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="bag-lines">
              {lines.map((line) => (
                <li key={line.id}>
                  <img src={line.product.card} alt="" />
                  <div>
                    <div className="line-title">
                      <Link to={line.product.path} onClick={() => setOpen(false)}>
                        {line.product.name}
                      </Link>
                      <strong>{money(line.lineTotal)}</strong>
                    </div>
                    <p>
                      {line.product.color} · {money(line.product.price)} each
                    </p>
                    <div className="qty">
                      <button
                        type="button"
                        aria-label={`Decrease ${line.product.name} quantity`}
                        onClick={() => setQty(line.id, line.qty - 1)}
                      >
                        –
                      </button>
                      <span aria-live="polite">{line.qty}</span>
                      <button
                        type="button"
                        aria-label={`Increase ${line.product.name} quantity`}
                        onClick={() => setQty(line.id, line.qty + 1)}
                      >
                        +
                      </button>
                      <button type="button" className="text-button" onClick={() => remove(line.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="drawer-total">
              <div>
                <span>Pieces</span>
                <span>{count}</span>
              </div>
              <div>
                <span>Delivery</span>
                <span>Included in this demo</span>
              </div>
              <div className="total-row">
                <span>Total</span>
                <strong aria-live="polite">{money(subtotal)}</strong>
              </div>
              <p className="demo-note">
                <span>Demo</span>
                Checkout does not take payment.
              </p>
              <button type="button" className="btn solid" onClick={() => setCheckoutOpen(true)}>
                Review demo checkout
              </button>
              <button type="button" className="text-button" onClick={clear}>
                Clear bag
              </button>
            </div>

            {checkoutOpen ? (
              <div className="checkout-panel" role="status">
                <p className="eyebrow">Demo checkout</p>
                <h3>No payment is taken.</h3>
                <p>
                  This preview shows {count} {count === 1 ? 'piece' : 'pieces'} at {money(subtotal)}. Nothing is
                  charged, and no order is placed.
                </p>
                <button type="button" className="btn ghost" onClick={() => setCheckoutOpen(false)}>
                  Close preview
                </button>
              </div>
            ) : null}
          </>
        )}
      </aside>
    </div>
  )
}
