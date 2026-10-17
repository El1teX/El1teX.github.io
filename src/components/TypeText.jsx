import { useEffect, useLayoutEffect, useRef } from 'react'
import { animate, onScroll } from 'animejs'
import { prefersReducedMotion } from '../hooks/motionPrefs.js'

// Абзац печатается в такт прокрутке (anime.js onScroll с sync): начинает набираться,
// когда показывается снизу экрана, и допечатывается к моменту, когда его конец доходит
// до середины экрана. При прокрутке назад текст «стирается».
// Ненапечатанная часть уже стоит на месте, но невидима — вёрстка не прыгает.
// Скринридер сразу получает весь текст. Текст пишем в DOM напрямую, без setState.
export default function TypeText({ text, as: Tag = 'p', className = '' }) {
  const ref = useRef(null)

  // До первой отрисовки: весь текст в невидимой части.
  useLayoutEffect(() => {
    const el = ref.current
    const done = prefersReducedMotion()
    el.querySelector('.tt__typed').textContent = done ? text : ''
    el.querySelector('.tt__rest').textContent = done ? '' : text
  }, [text])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = ref.current
    const typed = el.querySelector('.tt__typed')
    const rest = el.querySelector('.tt__rest')
    const state = { n: 0 }
    let shown = -1

    const anim = animate(state, {
      n: text.length,
      ease: 'linear',
      onUpdate: () => {
        const k = Math.round(state.n)
        if (k === shown) return
        shown = k
        typed.textContent = text.slice(0, k)
        rest.textContent = text.slice(k)
        // курсор виден, пока абзац напечатан не до конца
        el.classList.toggle('is-typing', k > 0 && k < text.length)
      },
      autoplay: onScroll({
        target: el,
        enter: { target: 'top', container: 'bottom' },
        // Обычно допечатываем, когда конец абзаца дошёл до середины экрана. Абзацы у самого
        // низа страницы туда не доезжают — для них финиш сдвигается к концу прокрутки.
        leave: () => {
          const h = window.innerHeight
          const bottom = el.getBoundingClientRect().bottom + window.scrollY
          const maxScroll = document.documentElement.scrollHeight - h
          return { target: 'bottom', container: Math.min(h, Math.max(h / 2, bottom - maxScroll)) }
        },
        sync: 0.3, // небольшое сглаживание, чтобы набор не дёргался от колеса мыши
      }),
    })
    return () => anim.revert()
  }, [text])

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
