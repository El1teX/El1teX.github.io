import { useEffect, useRef } from 'react'
import { animate } from 'animejs'

// Всплывающее сообщение снизу: выезжает, висит duration мс (по умолчанию 4 с) и уезжает.
export default function Toast({ text, onDone, duration = 4000 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    animate(el, { translateY: [40, 0], opacity: [0, 1], duration: 450, ease: 'outBack' })
    const timer = setTimeout(
      () => animate(el, { translateY: 40, opacity: 0, duration: 300, ease: 'inQuad', onComplete: onDone }),
      duration,
    )
    return () => clearTimeout(timer)
  }, [text, onDone, duration])
  return (
    <div className="toast" ref={ref} role="status">
      {text}
    </div>
  )
}
