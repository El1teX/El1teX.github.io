import { useEffect, useRef } from 'react'
import { animate, createTimer, createTimeline, stagger } from 'animejs'

// Пакеты-«навыки», которые якобы ставятся при загрузке.
const PACKAGES = [
  ['react', '19.1.0'],
  ['typescript', '5.x'],
  ['vite', '7.1.0'],
  ['animejs', '4.5.0'],
  ['motion', '12.x'],
  ['node', '22.x'],
  ['postgresql', '17'],
  ['figma-skills', 'beta'],
  ['coffee', '∞'],
]
const SPINNER = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
const BAR = 24

// Экран загрузки в виде `npm install` поверх сайта. Показывается один раз за сессию,
// пропускается кликом или клавишей. onReveal — сайт начинает свою анимацию
// (экран ещё тает поверх), onDone — экран можно убрать.
export default function Boot({ onReveal, onDone }) {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    const $ = (sel) => root.querySelector(sel)
    const spinner = $('.boot__spinner')
    const status = $('.boot__status')
    const bar = $('.boot__bar')
    const pct = $('.boot__pct')
    const lines = root.querySelectorAll('.boot__pkg')
    document.documentElement.style.overflow = 'hidden'

    // Спиннер крутится всё время, пока виден экран.
    let frame = 0
    const spin = createTimer({
      frameRate: 12,
      onUpdate: () => (spinner.textContent = SPINNER[frame++ % SPINNER.length]),
    })

    const progress = { p: 0 }
    const render = () => {
      const filled = Math.round((progress.p / 100) * BAR)
      bar.textContent = '█'.repeat(filled) + '░'.repeat(BAR - filled)
      pct.textContent = String(Math.round(progress.p)).padStart(3, ' ') + '%'
    }
    render()

    const tl = createTimeline({ onComplete: onDone })
      .add($('.boot__cmd'), { opacity: [0, 1], duration: 1 })
      .call(() => (status.textContent = 'resolving dependencies…'), 200)
      .add(progress, { p: 100, duration: 1400, ease: 'inOutSine', onUpdate: render }, 300)
      .add(
        lines,
        {
          opacity: [0, 1],
          translateX: [-8, 0],
          duration: 200,
          delay: stagger(135),
          onBegin: () => (status.textContent = 'fetching skills…'),
        },
        350,
      )
      .call(() => {
        status.textContent = 'done'
        spin.pause()
        spinner.textContent = '✔'
      }, 1750)
      .add(root.querySelectorAll('.boot__summary'), { opacity: [0, 1], duration: 1, delay: stagger(140) }, 1780)
      .call(onReveal, '+=220')
      .add(root, { opacity: 0, scale: [1, 1.04], filter: ['blur(0px)', 'blur(6px)'], duration: 450, ease: 'inQuad' })

    const skip = () => {
      onReveal()
      onDone()
    }
    window.addEventListener('keydown', skip)
    root.addEventListener('click', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      document.documentElement.style.overflow = ''
      spin.revert()
      tl.revert()
    }
  }, [onReveal, onDone])

  return (
    <div className="boot" ref={ref} role="status" aria-label="loading">
      <div className="boot__inner">
        <p className="boot__cmd">
          <span className="prompt">guest@el1tex:~$</span> npm install <span className="accent">maxim-sereda</span>
        </p>
        <p className="boot__line">
          <span className="boot__spinner accent">⠋</span> <span className="boot__status muted" />
        </p>
        <ul className="boot__pkgs">
          {PACKAGES.map(([name, ver]) => (
            <li key={name} className="boot__pkg">
              <span className="accent">+</span> {name}
              <span className="muted">@{ver}</span>
            </li>
          ))}
        </ul>
        <p className="boot__progress">
          <span className="boot__bar accent" />
          <span className="boot__pct" />
        </p>
        <p className="boot__summary">
          added {PACKAGES.length} packages from 1 developer in 1.8s
        </p>
        <p className="boot__summary">
          found <span className="accent">0</span> vulnerabilities
        </p>
        <p className="boot__skip muted">press any key / tap to skip</p>
      </div>
    </div>
  )
}
