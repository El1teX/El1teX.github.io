import { useEffect, useRef } from 'react'
import { animate } from 'animejs'

// Всплывающее сообщение снизу: выезжает, висит 4 секунды и уезжает.
export default function Toast({ text, onDone }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    animate(el, { translateY: [40, 0], opacity: [0, 1], duration: 450, ease: 'outBack' })
    const timer = setTimeout(
      () => animate(el, { translateY: 40, opacity: 0, duration: 300, ease: 'inQuad', onComplete: onDone }),
      4000,
    )
    return () => clearTimeout(timer)
  }, [text, onDone])
  return (
    <div className="toast" ref={ref} role="status">
      {text}
    </div>
  )
}
