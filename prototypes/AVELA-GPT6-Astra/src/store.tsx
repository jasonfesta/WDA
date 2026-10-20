import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { products, type ProductId } from './data'
import { sanitizeCart, updateCart, cartTotal } from './cart.mjs'

export type CartItem = { id: ProductId; quantity: number }
type Store = {
  cart: CartItem[]
  count: number
  total: number
  add: (id: ProductId, quantity?: number) => void
  setQuantity: (id: ProductId, quantity: number) => void
  bagOpen: boolean
  setBagOpen: (open: boolean) => void
  saved: ProductId[]
  toggleSaved: (id: ProductId) => void
  notice: string
}
const Context = createContext<Store | null>(null)
const key = 'avela-bag-v1'

function read(keyName: string): unknown {
  try { return JSON.parse(localStorage.getItem(keyName) || 'null') } catch { return null }
}
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => sanitizeCart(read(key), products.map(p => p.id)) as CartItem[])
  const [saved, setSaved] = useState<ProductId[]>(() => {
    const value = read('avela-saved-v1')
    return Array.isArray(value) ? value.filter(id => products.some(p => p.id === id)) : []
  })
  const [bagOpen, setBagOpen] = useState(false)
  const [notice, setNotice] = useState('')
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(cart)) } catch { /* In-memory bag remains usable. */ }
  }, [cart])
  useEffect(() => {
    try { localStorage.setItem('avela-saved-v1', JSON.stringify(saved)) } catch { /* In-memory favorites remain usable. */ }
  }, [saved])
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === key) setCart(sanitizeCart(read(key), products.map(p => p.id)) as CartItem[])
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 3000)
    return () => window.clearTimeout(timer)
  }, [notice])
  const add = (id: ProductId, quantity = 1) => {
    setCart(current => updateCart(current, id, (current.find(item => item.id === id)?.quantity || 0) + quantity) as CartItem[])
    setBagOpen(true)
  }
  const toggleSaved = (id: ProductId) => {
    const exists = saved.includes(id)
    setSaved(current => exists ? current.filter(item => item !== id) : [...current, id])
    setNotice(`${products.find(product => product.id === id)?.name} ${exists ? 'removed from' : 'added to'} your saved pieces.`)
  }
  return <Context.Provider value={{
    cart, count: cart.reduce((sum, item) => sum + item.quantity, 0),
    total: cartTotal(cart, products), add,
    setQuantity: (id, quantity) => setCart(current => updateCart(current, id, quantity) as CartItem[]),
    bagOpen, setBagOpen, saved, toggleSaved, notice,
  }}>{children}</Context.Provider>
}
export function useStore() {
  const value = useContext(Context)
  if (!value) throw new Error('StoreProvider is required')
  return value
}
