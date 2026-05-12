import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MouseGlow from './components/MouseGlow'
import ScrollToTop from './components/ScrollToTop'
import ReadingProgress from './components/ReadingProgress'
import Home from './pages/Home'
import HomeLight from './pages/HomeLight'
import Examples from './pages/Examples'
import About from './pages/About'
import DocsLayout from './pages/DocsLayout'
import Introduction from './pages/docs/Introduction'
import Installation from './pages/docs/Installation'
import QuickStart from './pages/docs/QuickStart'
import Variables from './pages/docs/Variables'
import Functions from './pages/docs/Functions'
import ControlFlow from './pages/docs/ControlFlow'
import Loops from './pages/docs/Loops'
import Arrays from './pages/docs/Arrays'
import Maps from './pages/docs/Maps'
import Structs from './pages/docs/Structs'
import Enums from './pages/docs/Enums'
import PatternMatching from './pages/docs/PatternMatching'
import ErrorHandling from './pages/docs/ErrorHandling'
import AsyncAwait from './pages/docs/AsyncAwait'
import Imports from './pages/docs/Imports'
import Web from './pages/docs/Web'
import Stdlib from './pages/docs/Stdlib'
import Cli from './pages/docs/Cli'
import Playground from './pages/Playground'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-black text-[#e8e8f0]">
        <ReadingProgress />
        <MouseGlow />
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home-light" element={<HomeLight />} />
            <Route path="/examples" element={<Examples />} />
            <Route path="/about" element={<About />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/docs" element={<DocsLayout />}>
              <Route index element={<Navigate to="/docs/introduction" replace />} />
              <Route path="introduction" element={<Introduction />} />
              <Route path="installation" element={<Installation />} />
              <Route path="quick-start" element={<QuickStart />} />
              <Route path="variables" element={<Variables />} />
              <Route path="functions" element={<Functions />} />
              <Route path="control-flow" element={<ControlFlow />} />
              <Route path="loops" element={<Loops />} />
              <Route path="arrays" element={<Arrays />} />
              <Route path="maps" element={<Maps />} />
              <Route path="structs" element={<Structs />} />
              <Route path="enums" element={<Enums />} />
              <Route path="pattern-matching" element={<PatternMatching />} />
              <Route path="error-handling" element={<ErrorHandling />} />
              <Route path="async-await" element={<AsyncAwait />} />
              <Route path="imports" element={<Imports />} />
              <Route path="web" element={<Web />} />
              <Route path="stdlib" element={<Stdlib />} />
              <Route path="cli" element={<Cli />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
