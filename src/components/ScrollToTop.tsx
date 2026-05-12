import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-xl bg-[#7c6af7] hover:bg-[#6a58e5] text-white shadow-lg shadow-[#7c6af7]/30 transition-all hover:scale-110"
      title="Scroll to top"
    >
      <ArrowUp size={18} />
    </button>
  )
}
