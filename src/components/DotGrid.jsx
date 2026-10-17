import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { prefersReducedMotion } from '../hooks/motionPrefs.js'

const COLS = 17
const ROWS = 11

// Классика anime.js: сетка точек, по клику волна расходится от выбранной точки.
// Один обработчик на всю сетку: индекс точки считаем по координатам клика.
export default function DotGrid({ hint, ready }) {
  const gridRef = useRef(null)

  const wave = (from) => {
    if (prefersReducedMotion()) return
    animate(gridRef.current.children, {
      scale: [
        { to: [1, 2.2], ease: 'outSine', duration: 260 },
        { to: 1, ease: 'inOutQuad', duration: 900 },
      ],
      translateY: [
        { to: -10, ease: 'outSine', duration: 260 },
        { to: 0, ease: 'inOutQuad', duration: 900 },
      ],
      // цвет берётся из CSS-переменной темы, анимируем только яркость
      opacity: [
        { to: 1, duration: 260 },
        { to: 0.25, duration: 900 },
      ],
      delay: stagger(45, { grid: [COLS, ROWS], from }),
    })
  }

  const onClick = (e) => {
    const r = gridRef.current.getBoundingClientRect()
    const col = Math.min(COLS - 1, Math.floor(((e.clientX - r.left) / r.width) * COLS))
    const row = Math.min(ROWS - 1, Math.floor(((e.clientY - r.top) / r.height) * ROWS))
    wave(row * COLS + col)
  }

  useEffect(() => {
    if (!ready || prefersReducedMotion()) return
    animate(gridRef.current.children, {
      opacity: [0, 0.25],
      scale: [0, 1],
      delay: stagger(18, { grid: [COLS, ROWS], from: 'center' }),
      duration: 500,
      ease: 'outBack',
      onComplete: () => wave('center'),
    })
  }, [ready])

  return (
    <div className="dotgrid" aria-hidden="true">
      <div
        ref={gridRef}
        className="dotgrid__grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
        onClick={onClick}
      >
        {Array.from({ length: COLS * ROWS }, (_, i) => (
          <span key={i} className="dot" />
        ))}
      </div>
      <p className="dotgrid__hint">// {hint}</p>
    </div>
  )
}
