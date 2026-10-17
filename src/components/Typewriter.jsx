import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../hooks/motionPrefs.js'

// Печатная машинка на Motion: печатает строку, держит паузу,
// стирает и печатает следующую — по мотивам примера motion.dev «Typewriter: change content».
// Motion грузится отдельным чанком после первой отрисовки, до этого видна первая строка целиком.
export default function Typewriter({ words, typeSpeed = 0.06, deleteSpeed = 0.035, hold = 1.6 }) {
  const [text, setText] = useState(words[0])
  const cursorRef = useRef(null)

  useEffect(() => {
    setText(words[0])
    if (prefersReducedMotion()) return
    let cancelled = false
    let current = null
    let blink = null
    let timer = null

    const wait = (s) => new Promise((r) => (timer = setTimeout(r, s * 1000)))

    import('motion').then(({ animate }) => {
      if (cancelled) return
      blink = animate(
        cursorRef.current,
        { opacity: [1, 1, 0, 0] },
        { duration: 1, repeat: Infinity, ease: 'linear', times: [0, 0.5, 0.5, 1] },
      )

      // Анимируем число символов от from до to и показываем срез слова.
      const run = (word, from, to, speed) =>
        new Promise((resolve) => {
          current = animate(from, to, {
            duration: Math.abs(to - from) * speed,
            ease: 'linear',
            onUpdate: (v) => !cancelled && setText(word.slice(0, Math.round(v))),
            onComplete: resolve,
          })
        })

      ;(async () => {
        // первая строка уже напечатана — начинаем с паузы и стирания
        for (let i = 0; !cancelled; i++) {
          const word = words[i % words.length]
          if (i > 0) await run(word, 0, word.length, typeSpeed)
          if (cancelled) break
          await wait(hold)
          if (cancelled) break
          await run(word, word.length, 0, deleteSpeed)
          await wait(0.25)
        }
      })()
    })

    return () => {
      cancelled = true
      current?.stop()
      blink?.stop()
      clearTimeout(timer)
    }
  }, [words, typeSpeed, deleteSpeed, hold])

  return (
    <span className="typewriter">
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden="true">{text}</span>
      <span ref={cursorRef} className="typewriter__cursor" aria-hidden="true">▋</span>
    </span>
  )
}
