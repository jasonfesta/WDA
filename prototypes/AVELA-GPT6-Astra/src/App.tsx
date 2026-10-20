import { useEffect, useRef, useState } from 'react'
import { Header, Community, Footer } from './components/Layout'
import Bag from './components/Bag'
import { Icon } from './components/ui'
import { findProduct } from './data'
import { useStore } from './store'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Product from './pages/Product'
import Story from './pages/Story'
import Care from './pages/Care'

function location() {
  return new URL(window.location.hash.slice(1) || '/', 'https://avela.local')
}
export default function App() {
  const [route, setRoute] = useState(location)
  const main = useRef<HTMLElement>(null)
  const { notice } = useStore()
  const path = route.pathname.replace(/\/+$/, '') || '/'
  useEffect(() => {
    const onChange = () => {
      setRoute(location())
      window.scrollTo({ top: 0, behavior: 'instant' })
      window.requestAnimationFrame(() => main.current?.focus({ preventScroll: true }))
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  const product = path.startsWith('/product/') ? findProduct(path.split('/')[2]) : undefined
  const title = product?.name || ({ '/': 'A curve for the unplanned day', '/collection': 'The collection', '/story': 'Our story', '/care': 'Care & guidance' }[path] ?? 'Page not found')
  useEffect(() => {
    document.title = `Avela — ${title}`
    const section = route.searchParams.get('section')
    if (section) requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView())
  }, [route, title])
  let page
  if (path === '/') page = <Home />
  else if (path === '/collection') page = <Collection />
  else if (product) page = <Product key={product.id} product={product} />
  else if (path === '/story') page = <Story />
  else if (path === '/care') page = <Care />
  else page = <section className="not-found page-intro"><p className="eyebrow">A little off the usual path</p><h1>This page wandered off.</h1><p>Let’s find your way back to something considered.</p><a className="button" href="#/collection">Explore the collection <Icon name="arrow" /></a></section>
  return <>
    <a className="skip-link" href="#main" onClick={e => { e.preventDefault(); main.current?.focus(); main.current?.scrollIntoView() }}>Skip to content</a>
    <Header path={path} />
    <main id="main" ref={main} tabIndex={-1} key={path}>{page}<Community /></main>
    <Footer />
    <Bag />
    <div className={`toast ${notice ? 'visible' : ''}`} role="status">{notice}</div>
  </>
}
