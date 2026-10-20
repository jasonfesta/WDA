export function money(cents) {
  return `$${cents.toLocaleString('en-US')}`
}

export const products = [
  {
    id: 'arc',
    name: 'Arc',
    path: '/arc',
    price: 420,
    color: 'Burgundy',
    swatch: '#6B2E30',
    dimensions: '30 × 22 × 10 cm',
    opening: 'Wide crescent',
    carry: 'Single top handle',
    fit: 'A phone, cards, keys, and a small notebook',
    leather: 'Ruched calf with a soft, unlined body',
    summary: 'A crescent that opens along the curve and sits close to the body.',
    card: '/images/card-arc.jpg',
    cardAlt: 'Burgundy Arc crescent bag on a stone ledge',
    mini: '/images/mini-arc.jpg',
    gallery: [
      { src: '/images/arc-hero.jpg', alt: 'Arc, a burgundy crescent bag, on sunlit stone' },
      { src: '/images/arc-stone.jpg', alt: 'Side view of Arc on a warm stone block' },
      { src: '/images/arc-open.jpg', alt: 'Arc held open, with a phone and card sleeve inside' },
      { src: '/images/detail-clasp.jpg', alt: 'Gold-toned clasp where the Arc handle meets the body' },
      { src: '/images/detail-zip.jpg', alt: 'Zipper running along the Arc opening' },
      { src: '/images/arc-carry.jpg', alt: 'Arc carried at the hip above a coastal path' },
    ],
  },
  {
    id: 'fold',
    name: 'Fold',
    path: '/fold',
    price: 390,
    color: 'Camel',
    swatch: '#C4894F',
    dimensions: '26 × 18 × 8 cm',
    opening: 'Flap with a hidden magnet',
    carry: 'Structured top handle',
    fit: 'Cards, a phone, and a lipstick',
    leather: 'Smooth calf, shaped over a folded flap',
    summary: 'A compact flap that closes flat and keeps its line.',
    card: '/images/card-fold.jpg',
    cardAlt: 'Camel Fold flap bag on a stone ledge',
    mini: '/images/mini-fold.jpg',
    gallery: [
      { src: '/images/card-fold.jpg', alt: 'Fold, a camel flap bag, standing on stone' },
      { src: '/images/way-fold.jpg', alt: 'Fold carried over the shoulder of a navy coat' },
      { src: '/images/quote-foldback.jpg', alt: 'Fold seen from behind, camel leather against a terracotta wall' },
      { src: '/images/detail-zip.jpg', alt: 'A close view of the leather edge and stitching' },
    ],
  },
  {
    id: 'day',
    name: 'Day',
    path: '/day',
    price: 360,
    color: 'Olive',
    swatch: '#4F5A38',
    dimensions: '34 × 30 × 16 cm',
    opening: 'Open top',
    carry: 'Two short handles',
    fit: 'A book, a scarf, and whatever the day asks for',
    leather: 'Smooth calf, structured and open',
    summary: 'An open tote with a quiet base and room for the afternoon.',
    card: '/images/card-day.jpg',
    cardAlt: 'Olive Day tote on a stone ledge',
    mini: '/images/mini-day.jpg',
    gallery: [
      { src: '/images/card-day.jpg', alt: 'Day, an olive tote, standing on stone' },
      { src: '/images/day-sea.jpg', alt: 'Day tote set on a wall above the sea' },
      { src: '/images/way-day.jpg', alt: 'Day carried on the shoulder in olive leather' },
      { src: '/images/ig-olive.jpg', alt: 'Olive Day bag among garden leaves' },
    ],
  },
]

export function findProduct(id) {
  return products.find((product) => product.id === id) || null
}
