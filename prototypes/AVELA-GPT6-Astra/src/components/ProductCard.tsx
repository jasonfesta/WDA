import type { Product } from '../data'
import { money } from '../data'
import { useStore } from '../store'
import { Icon, Photo } from './ui'

export default function ProductCard({ product }: { product: Product }) {
  const { add, saved, toggleSaved } = useStore()
  const isSaved = saved.includes(product.id)
  return <article className="product-card">
    <div className="product-card-image"><a href={`#/product/${product.id}`}><Photo name={product.image} alt={`${product.name} bag in ${product.color} leather`} /></a><button className={`save-button ${isSaved ? 'saved' : ''}`} aria-label={`${isSaved ? 'Unsave' : 'Save'} ${product.name}`} aria-pressed={isSaved} onClick={() => toggleSaved(product.id)}><Icon name="heart" size={18} /></button></div>
    <div className="product-card-meta"><div><a href={`#/product/${product.id}`}><h3>{product.name}</h3></a><p><span className="swatch" style={{ background: product.hex }} />{product.color}</p></div><span>{money(product.price)}</span></div>
    <button className="button card-add" onClick={() => add(product.id)}>Add to bag <Icon name="plus" size={15} /></button>
  </article>
}
