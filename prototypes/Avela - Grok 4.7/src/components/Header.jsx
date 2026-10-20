import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useBag } from '../context/BagContext'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/collection', label: 'Collection' },
  { to: '/arc', label: 'Arc' },
  { to: '/story', label: 'Our Story' },
  { to: '/care', label: 'Care' },
]

export default function Header() {
  const { count, setOpen } = useBag()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const home = pathname === '/'
  const solid = !home || scrolled || menuOpen

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-lock', menuOpen)
    return () => document.body.classList.remove('menu-lock')
  }, [menuOpen])

  return (
    <header className={solid ? 'site-header solid' : 'site-header overlay'}>
      <div className="header-bar">
        <NavLink to="/" className="logo" end>
          Avela
        </NavLink>
        <nav className="nav-desktop" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="nav-link">
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <button
            type="button"
            className="bag-button"
            onClick={() => {
              setMenuOpen(false)
              setOpen(true)
            }}
          >
            Bag
            <span className="bag-count">{count}</span>
          </button>
          <button
            type="button"
            className="menu-button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
      <nav
        id="mobile-nav"
        className={menuOpen ? 'nav-mobile open' : 'nav-mobile'}
        aria-label="Mobile"
        hidden={!menuOpen}
      >
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className="mobile-link">
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
