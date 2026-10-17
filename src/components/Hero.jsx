import { useEffect, useRef } from 'react'
import { animate, createTimeline, stagger, splitText } from 'animejs'
import Typewriter from './Typewriter.jsx'
import DotGrid from './DotGrid.jsx'
import { links } from '../data.js'
import { prefersReducedMotion } from '../hooks/motionPrefs.js'

export default function Hero({ t, ready = true }) {
  const nameRef = useRef(null)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!ready || prefersReducedMotion()) return
    // Имя разбивается на буквы, и они «падают» по одной.
    const split = splitText(nameRef.current, { chars: true })
    const $ = (sel) => rootRef.current.querySelectorAll(sel)
    const tl = createTimeline({ defaults: { ease: 'outExpo' } })
      .add($('.term__bar, .term__line'), {
        opacity: [0, 1],
        translateX: [-12, 0],
        duration: 500,
        delay: stagger(90),
      })
      .add(
        split.chars,
        {
          opacity: [0, 1],
          translateY: ['-0.8em', 0],
          rotate: [() => (Math.random() - 0.5) * 40, 0],
          duration: 900,
          delay: stagger(35),
        },
        '-=200',
      )
      .add(
        $('.hero__lead, .hero__actions > *'),
        { opacity: [0, 1], translateY: [16, 0], duration: 700, delay: stagger(100) },
        '-=500',
      )
    return () => {
      tl.revert()
      split.revert()
    }
  }, [t.hero.name, ready])

  // «Магнитные» кнопки: тянутся за курсором и пружинят обратно.
  const magnet = (e) => {
    if (prefersReducedMotion()) return
    const r = e.currentTarget.getBoundingClientRect()
    animate(e.currentTarget, {
      translateX: (e.clientX - r.left - r.width / 2) * 0.25,
      translateY: (e.clientY - r.top - r.height / 2) * 0.35,
      duration: 300,
      ease: 'outQuad',
    })
  }
  const release = (e) =>
    animate(e.currentTarget, { translateX: 0, translateY: 0, duration: 800, ease: 'outElastic(1, .4)' })

  return (
    <section id="top" className="hero" ref={rootRef}>
      <div className="term">
        <div className="term__bar">
          <span className="term__dot" style={{ background: '#ff5f56' }} />
          <span className="term__dot" style={{ background: '#ffbd2e' }} />
          <span className="term__dot" style={{ background: '#27c93f' }} />
          <span className="term__name">maxim@dstu: ~</span>
        </div>
        <p className="term__line">
          <span className="prompt">$</span> {t.hero.prompt}
        </p>
        <h1 className="hero__name" ref={nameRef} key={t.hero.name}>
          {t.hero.name}
        </h1>
        <p className="term__line hero__role">
          <span className="prompt">&gt;</span> <Typewriter key={t.hero.name} words={t.hero.roles} />
        </p>
        <p className="hero__lead">{t.hero.lead}</p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#projects" onMouseMove={magnet} onMouseLeave={release}>
            {t.hero.cta} →
          </a>
          <a
            className="btn"
            href={links.telegram}
            target="_blank"
            rel="noreferrer"
            onMouseMove={magnet}
            onMouseLeave={release}
          >
            {t.hero.cta2}
          </a>
          <a className="btn btn--ghost" href={links.resume} download onMouseMove={magnet} onMouseLeave={release}>
            ↓ {t.hero.cv}
          </a>
        </div>
      </div>
      <DotGrid hint={t.hero.hint} ready={ready} />
    </section>
  )
}
