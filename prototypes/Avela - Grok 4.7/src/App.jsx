import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Product from './pages/Product'
import Story from './pages/Story'
import Care from './pages/Care'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="collection" element={<Collection />} />
        <Route path="arc" element={<Product slug="arc" />} />
        <Route path="fold" element={<Product slug="fold" />} />
        <Route path="day" element={<Product slug="day" />} />
        <Route path="story" element={<Story />} />
        <Route path="care" element={<Care />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
