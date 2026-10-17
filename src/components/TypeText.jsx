import { useEffect, useLayoutEffect, useRef } from 'react'
import { animate } from 'animejs'
import { prefersReducedMotion } from '../hooks/motionPrefs.js'

// Абзац «печатается», когда попадает в экран. Ненапечатанная часть уже стоит на месте,
// но невидима — поэтому вёрстка не прыгает. Скринридер сразу получает весь текст.
// Текст пишем в DOM напрямую (без setState на каждый символ) — так дешевле.
export default function TypeText({ text, as: Tag = 'p', className = '', msPerChar = 9, maxDuration = 1800, delay = 0 }) {
  const ref = useRef(null)

  // До первой отрисовки: весь текст в невидимой части.
  useLayoutEffect(() => {
    const el = ref.current
    const done = prefersReducedMotion()
    el.querySelector('.tt__typed').textContent = done ? text : ''
    el.querySelector('.tt__rest').textContent = done ? '' : text
    el.classList.toggle('is-done', done)
  }, [text])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = ref.current
    const typed = el.querySelector('.tt__typed')
    const rest = el.querySelector('.tt__rest')
    let anim = null
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        const state = { n: 0 }
        anim = animate(state, {
          n: text.length,
          duration: Math.min(maxDuration, text.length * msPerChar),
          delay,
          ease: 'linear',
          onBegin: () => el.classList.add('is-typing'),
          onUpdate: () => {
            const k = Math.round(state.n)
            typed.textContent = text.slice(0, k)
            rest.textContent = text.slice(k)
          },
          onComplete: () => {
            el.classList.remove('is-typing')
            el.classList.add('is-done')
          },
        })
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      anim?.pause()
    }
  }, [text, msPerChar, maxDuration, delay])

  return (
    <Tag ref={ref} className={`tt ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        <span className="tt__typed" />
        <span className="tt__caret" />
        <span className="tt__rest" />
      </span>
    </Tag>
  )
}
