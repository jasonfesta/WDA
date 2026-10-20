import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import BagDrawer from './BagDrawer'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="site">
      <Header />
      <main className={pathname === '/' ? 'site-main home' : 'site-main'} id="main">
        <Outlet />
      </main>
      <Footer />
      <BagDrawer />
    </div>
  )
}
