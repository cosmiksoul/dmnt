import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Generator from './pages/Generator.jsx'
import UrlBuilder from './pages/UrlBuilder.jsx'
import Validator from './pages/Validator.jsx'
import Methodology from './pages/Methodology.jsx'
import Reference from './pages/Reference.jsx'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Generator />} />
          <Route path="url" element={<UrlBuilder />} />
          <Route path="validator" element={<Validator />} />
          <Route path="reference" element={<Reference />} />
          <Route path="methodology" element={<Methodology />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
