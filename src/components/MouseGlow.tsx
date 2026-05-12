import { useEffect, useRef } from 'react'

export default function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!glowRef.current) return
      glowRef.current.style.left = `${e.clientX}px`
      glowRef.current.style.top = `${e.clientY}px`
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed z-0"
      style={{
        width: '500px',
        height: '500px',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(124,106,247,0.07) 0%, rgba(79,195,247,0.03) 40%, transparent 70%)',
        borderRadius: '50%',
        transition: 'left 0.08s ease-out, top 0.08s ease-out',
      }}
    />
  )
}
