import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { findProduct } from '../data/catalog'

const STORAGE_KEY = 'avela-bag'
const BagContext = createContext(null)

function readStoredLines() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(raw)) return []
    return raw
      .filter((line) => findProduct(line.id) && Number(line.qty) > 0)
      .map((line) => ({
        id: line.id,
        qty: Math.min(12, Math.max(1, Math.round(Number(line.qty)))),
      }))
  } catch {
    return []
  }
}

export function BagProvider({ children }) {
  const [lines, setLines] = useState(readStoredLines)
  const [open, setOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines])

  const detailed = useMemo(
    () =>
      lines.map((line) => {
        const product = findProduct(line.id)
        return {
          ...line,
          product,
          lineTotal: product.price * line.qty,
        }
      }),
    [lines],
  )

  const count = detailed.reduce((sum, line) => sum + line.qty, 0)
  const subtotal = detailed.reduce((sum, line) => sum + line.lineTotal, 0)

  function add(id, qty = 1) {
    const amount = Math.min(12, Math.max(1, qty))
    setLines((current) => {
      const existing = current.find((line) => line.id === id)
      if (!existing) return [...current, { id, qty: amount }]
      return current.map((line) =>
        line.id === id ? { ...line, qty: Math.min(12, line.qty + amount) } : line,
      )
    })
    setCheckoutOpen(false)
    setOpen(true)
  }

  function setQty(id, qty) {
    setLines((current) => {
      if (qty <= 0) return current.filter((line) => line.id !== id)
      return current.map((line) =>
        line.id === id ? { ...line, qty: Math.min(12, qty) } : line,
      )
    })
  }

  function remove(id) {
    setLines((current) => current.filter((line) => line.id !== id))
  }

  function clear() {
    setLines([])
    setCheckoutOpen(false)
  }

  const value = {
    lines: detailed,
    count,
    subtotal,
    open,
    setOpen,
    checkoutOpen,
    setCheckoutOpen,
    add,
    setQty,
    remove,
    clear,
  }

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>
}

export function useBag() {
  const value = useContext(BagContext)
  if (!value) throw new Error('useBag must be used within BagProvider')
  return value
}
