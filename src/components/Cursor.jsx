import { useEffect, useRef } from 'react'
import { createAnimatable } from 'animejs'
import { prefersReducedMotion } from '../hooks/motionPrefs.js'

const INTERACTIVE = 'a, button, [role="option"], .chip, .dotgrid__grid, .shell'

// Курсор-блок «▋» как в терминале. Плавно догоняет мышь (createAnimatable),
// над ссылками и кнопками превращается в рамку, над полями ввода прячется.
// Только для мыши: на тач-экранах и при «уменьшить движение» его нет.
export default function Cursor() {
  const ref = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine || prefersReducedMotion()) return
    const el = ref.current
    const root = document.documentElement
    root.classList.add('has-cursor')
    const pos = createAnimatable(el, { x: 140, y: 140, ease: 'out(3)' })
    let shown = false

    const onMove = (e) => {
      pos.x(e.clientX)
      pos.y(e.clientY)
      if (!shown) {
        shown = true
        el.classList.add('is-visible')
      }
      const target = e.target instanceof Element ? e.target : null
      const field = target?.closest('input, textarea')
      const hit = !field && target?.closest(INTERACTIVE)
      el.classList.toggle('is-hidden', !!field)
      el.classList.toggle('is-link', !!hit && !hit.matches('.shell, .dotgrid__grid'))
      el.classList.toggle('is-text', !!hit && hit.matches('.shell'))
    }
    const onDown = () => el.classList.add('is-down')
    const onUp = () => el.classList.remove('is-down')
    const onLeave = () => {
      shown = false
      el.classList.remove('is-visible')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('pointerleave', onLeave)
    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
      pos.revert()
    }
  }, [])

  return (
    <div className="cursor" ref={ref} aria-hidden="true">
      <span className="cursor__shape" />
    </div>
  )
}
