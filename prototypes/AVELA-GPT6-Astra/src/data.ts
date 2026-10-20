export type ProductId = 'arc' | 'fold' | 'day'
export type Product = {
  id: ProductId
  name: string
  color: string
  hex: string
  price: number
  description: string
  note: string
  image: string
  gallery: string[]
  dimensions: string
}

export const products: Product[] = [
  {
    id: 'arc', name: 'Arc', color: 'Burgundy', hex: '#702d37', price: 420,
    description: 'A gathered silhouette with space for the things you reach for.',
    note: 'Soft curves. An open day.',
    image: 'arc-card',
    gallery: ['arc', 'hardware', 'leather', 'carry', 'interior'],
    dimensions: '30 × 22 × 10 cm',
  },
  {
    id: 'fold', name: 'Fold', color: 'Saddle', hex: '#b67b46', price: 380,
    description: 'A considered envelope shape, with a little structure for your everyday.',
    note: 'A little order. A lot of possibility.',
    image: 'fold',
    gallery: ['fold', 'fold-worn', 'fold-campaign', 'materials'],
    dimensions: 'Dimensions available at launch',
  },
  {
    id: 'day', name: 'Day', color: 'Olive', hex: '#5d6041', price: 480,
    description: 'An easy, generous tote for a book, a market stop, and whatever comes next.',
    note: 'Make room for the unexpected.',
    image: 'day',
    gallery: ['day', 'day-worn', 'collection', 'materials'],
    dimensions: 'Dimensions available at launch',
  },
]

export const money = (amount: number) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0,
}).format(amount)
export const findProduct = (id: string) => products.find(product => product.id === id)
export const navigation = [
  { label: 'Home', href: '#/' },
  { label: 'Collection', href: '#/collection' },
  { label: 'Arc', href: '#/product/arc' },
  { label: 'Our story', href: '#/story' },
  { label: 'Care', href: '#/care' },
]

export const usefulAnswers = [
  { title: 'What fits inside Arc?', body: 'At 30 × 22 × 10 cm, Arc has room for your phone, a small wallet, keys, and a pocket notebook. Leave a little room so the gathered opening keeps its shape.' },
  { title: 'How do I care for the leather?', body: 'Lift loose dust with a soft, dry cloth. Keep your bag away from prolonged heat and direct moisture, and let damp leather dry naturally. Store it in a breathable cloth bag.' },
  { title: 'Delivery & returns', body: 'This is an Avela concept shop. Orders and payments are not enabled. Delivery regions, timings, and a complete returns policy will be confirmed before a live launch.' },
  { title: 'Repairs & client care', body: 'A useful repair enquiry includes the product name, a photograph of the area, and a short description. The care page includes a local draft form to help you prepare these details.' },
]
