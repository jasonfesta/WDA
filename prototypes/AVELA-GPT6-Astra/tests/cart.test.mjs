import test from 'node:test'
import assert from 'node:assert/strict'
import { sanitizeCart, updateCart, cartTotal } from '../src/cart.mjs'

const catalog = [{ id: 'arc', price: 420 }, { id: 'fold', price: 380 }, { id: 'day', price: 480 }]
const ids = catalog.map(product => product.id)

test('two Arcs cost $840 and removing one restores the $420 subtotal', () => {
  let bag = updateCart([], 'arc', 2)
  assert.equal(cartTotal(bag, catalog), 840)
  bag = updateCart(bag, 'arc', 1)
  assert.equal(cartTotal(bag, catalog), 420)
})
test('different products retain independent quantities and totals', () => {
  const bag = updateCart(updateCart([], 'arc', 1), 'fold', 2)
  assert.equal(cartTotal(bag, catalog), 1180)
  assert.deepEqual(updateCart(bag, 'arc', 0), [{ id: 'fold', quantity: 2 }])
})
test('corrupted or obsolete stored data cannot introduce negative or unknown line items', () => {
  assert.deepEqual(sanitizeCart([
    null, { id: 'arc', quantity: -1 }, { id: 'arc', quantity: 1.5 },
    { id: 'unknown', quantity: 4 }, { id: 'fold', quantity: '2' },
    { id: 'day', quantity: 2 },
  ], ids), [{ id: 'day', quantity: 2 }])
  assert.deepEqual(sanitizeCart({ id: 'arc', quantity: 1 }, ids), [])
})
test('duplicate stored lines merge and quantities stay within the ten-piece limit', () => {
  const bag = sanitizeCart([{ id: 'arc', quantity: 7 }, { id: 'arc', quantity: 6 }], ids)
  assert.deepEqual(bag, [{ id: 'arc', quantity: 10 }])
  assert.equal(cartTotal(bag, catalog), 4200)
  assert.deepEqual(updateCart(bag, 'arc', Infinity), bag)
  assert.deepEqual(updateCart(bag, 'arc', 20), bag)
})
