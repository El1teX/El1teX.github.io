import { useEffect, useRef } from 'react'
import { animate, stagger, scrambleText } from 'animejs'
import { prefersReducedMotion } from './motionPrefs.js'

// Когда секция попадает в экран: заголовок «расшифровывается» (scrambleText),
// а элементы с data-reveal выезжают по очереди (stagger).
export function useReveal(deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const items = root.querySelectorAll('[data-reveal]')
    const title = root.querySelector('[data-scramble]')

    if (prefersReducedMotion()) {
      items.forEach((el) => (el.style.opacity = 1))
      return
    }

    items.forEach((el) => {
      el.style.opacity = 0
    })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        if (title) {
          animate(title, {
            innerHTML: scrambleText({ chars: '01<>/{}[]#_' }),
            duration: 900,
          })
        }
        animate(items, {
          opacity: [0, 1],
          translateY: [24, 0],
          duration: 700,
          delay: stagger(70, { start: 150 }),
          ease: 'outExpo',
        })
      },
      { threshold: 0.15 },
    )
    observer.observe(root)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}
