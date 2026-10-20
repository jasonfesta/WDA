export const MAX_QUANTITY = 10

export function sanitizeCart(value, allowedIds) {
  if (!Array.isArray(value)) return []
  const counts = new Map()
  for (const item of value) {
    if (!item || !allowedIds.includes(item.id) || !Number.isInteger(item.quantity) || item.quantity < 1) continue
    counts.set(item.id, Math.min(MAX_QUANTITY, (counts.get(item.id) || 0) + item.quantity))
  }
  return Array.from(counts, ([id, quantity]) => ({ id, quantity }))
}

export function updateCart(cart, id, quantity) {
  if (!Number.isFinite(quantity)) return cart
  const next = Math.max(0, Math.min(MAX_QUANTITY, Math.trunc(quantity)))
  if (next === 0) return cart.filter(item => item.id !== id)
  return cart.some(item => item.id === id)
    ? cart.map(item => item.id === id ? { ...item, quantity: next } : item)
    : [...cart, { id, quantity: next }]
}

export function cartTotal(cart, catalog) {
  return cart.reduce((sum, item) => sum + (catalog.find(product => product.id === item.id)?.price || 0) * item.quantity, 0)
}
