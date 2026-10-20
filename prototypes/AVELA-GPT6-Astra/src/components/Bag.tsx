import { useEffect, useState } from 'react'
import { findProduct, money } from '../data'
import { useStore } from '../store'
import { Icon, Modal, Photo } from './ui'
import { MAX_QUANTITY } from '../cart.mjs'

export function Quantity({ value, onChange, name }: { value: number; onChange: (value: number) => void; name: string }) {
  return <div className="quantity"><button aria-label={`Decrease ${name} quantity`} disabled={value <= 1} onClick={() => onChange(value - 1)}><Icon name="minus" size={14} /></button><output aria-label={`${name} quantity`}>{value}</output><button aria-label={`Increase ${name} quantity`} disabled={value >= MAX_QUANTITY} onClick={() => onChange(value + 1)}><Icon name="plus" size={14} /></button></div>
}
export default function Bag() {
  const { cart, count, total, bagOpen, setBagOpen, setQuantity } = useStore()
  const [checkout, setCheckout] = useState(false)
  useEffect(() => { if (!bagOpen) setCheckout(false) }, [bagOpen])
  return <Modal open={bagOpen} onClose={() => setBagOpen(false)} title={checkout ? 'Your order preview' : `Your bag (${count})`} className="bag-modal">
    {cart.length === 0 ? <div className="empty-bag"><Icon name="bag" size={42} /><h3>A little room for possibility.</h3><p>Your bag is waiting for its first piece.</p><a className="button" href="#/collection" onClick={() => setBagOpen(false)}>Explore the collection <Icon name="arrow" /></a></div> : <>
      {checkout && <div className="checkout-notice"><Icon name="check" /><div><h3>A preview, just for you.</h3><p>This concept shop doesn’t take payments or place orders. Here’s what your selection looks like.</p></div></div>}
      <div className="bag-items">{cart.map(item => {
        const product = findProduct(item.id)!
        return <article className="bag-item" key={item.id}>
          <a href={`#/product/${item.id}`} onClick={() => setBagOpen(false)}><Photo name={product.image} alt={`${product.name}, ${product.color}`} /></a>
          <div className="bag-item-info"><div className="bag-item-title"><h3><a href={`#/product/${item.id}`} onClick={() => setBagOpen(false)}>{product.name}</a></h3><span>{money(product.price * item.quantity)}</span></div><p>{product.color} · Grained leather</p>
            {checkout ? <p>Quantity {item.quantity} × {money(product.price)}</p> : <div className="bag-item-controls"><Quantity value={item.quantity} name={product.name} onChange={value => setQuantity(product.id, value)} /><button className="text-button" onClick={() => setQuantity(product.id, 0)} aria-label={`Remove ${product.name} from bag`}>Remove</button></div>}
          </div>
        </article>
      })}</div>
      <div className="bag-summary"><div><span>Subtotal</span><strong>{money(total)}</strong></div><p>USD · Shipping and taxes are not calculated in this preview.</p>
        {checkout ? <><button className="button" onClick={() => setCheckout(false)}>Back to your bag <Icon name="arrow" /></button><button className="text-button continue-shopping" onClick={() => setBagOpen(false)}>Keep exploring</button></> : <><button className="button" onClick={() => setCheckout(true)}>Preview checkout <Icon name="arrow" /></button><button className="text-button continue-shopping" onClick={() => setBagOpen(false)}>Continue exploring</button></>}
      </div>
    </>}
  </Modal>
}
