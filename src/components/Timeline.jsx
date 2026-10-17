import { useEffect, useRef } from 'react'
import { animate, onScroll, svg } from 'animejs'
import Section from './Section.jsx'
import { prefersReducedMotion } from '../hooks/motionPrefs.js'
import TypeText from './TypeText.jsx'

export default function Timeline({ t, lang }) {
  const tl = t.timeline
  const listRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const list = listRef.current
    // Подгоняем viewBox под реальную высоту, чтобы длина линии считалась в пикселях.
    const h = list.offsetHeight - 12
    list.querySelector('.tl__line').setAttribute('viewBox', `0 0 4 ${h}`)
    list.querySelectorAll('.tl__line line').forEach((l) => l.setAttribute('y2', h))
    // Линия «прорисовывается» синхронно с прокруткой (createDrawable + onScroll sync).
    const line = animate(svg.createDrawable(list.querySelector('.tl__path')), {
      draw: ['0 0', '0 1'],
      ease: 'linear',
      autoplay: onScroll({
        target: list,
        enter: { target: 'top', container: 'center' },
        leave: { target: 'bottom', container: 'center' },
        sync: 0.4,
      }),
    })
    // Точки зажигаются, когда до них доходит центр экрана. Цвет и свечение — через класс
    // (CSS-переменные темы), anime.js даёт «щелчок» масштаба.
    const observers = [...list.querySelectorAll('.tl__item')].map((item) => {
      const dot = item.querySelector('.tl__dot')
      const light = (on) => {
        dot.classList.toggle('is-lit', on)
        if (on) animate(dot, { scale: [0.5, 1.2, 1], duration: 500, ease: 'outBack' })
      }
      return onScroll({
        target: item,
        enter: { target: 'top', container: 'center' },
        leave: { target: 'top', container: 'top' },
        repeat: true,
        onEnterForward: () => light(true),
        onEnterBackward: () => light(true),
        onLeaveBackward: () => light(false),
      })
    })
    return () => {
      line.revert()
      observers.forEach((o) => o.revert())
    }
  }, [lang])

  return (
    <Section id="history" cmd="history |" title="tail" lang={lang}>
      <ol className="tl" ref={listRef}>
        <svg className="tl__line" preserveAspectRatio="none" viewBox="0 0 4 100" aria-hidden="true">
          <line x1="2" y1="0" x2="2" y2="100" className="tl__track" />
          <line x1="2" y1="0" x2="2" y2="100" className="tl__path" />
        </svg>
        {tl.items.map((it, i) => (
          <li key={i} className="tl__item" data-reveal>
            <span className="tl__dot" />
            <span className="tl__year amber">{it.year}</span>
            <h3>{it.title}</h3>
            <TypeText text={it.text} msPerChar={14} />
          </li>
        ))}
        <li className="tl__item tl__item--next" data-reveal>
          <span className="tl__dot tl__dot--pulse" />
          <span className="tl__year accent">{tl.now} ▸</span>
          <ul className="tl__next">
            {tl.next.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </li>
      </ol>
    </Section>
  )
}
