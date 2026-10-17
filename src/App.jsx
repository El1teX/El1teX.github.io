import { useCallback, useEffect, useMemo, useState } from 'react'
import { animate, stagger } from 'animejs'
import { content, links } from './data.js'
import Boot from './components/Boot.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Shell from './components/Shell.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Timeline from './components/Timeline.jsx'
import GitHub from './components/GitHub.jsx'
import Contact from './components/Contact.jsx'
import Matrix from './components/Matrix.jsx'
import Palette from './components/Palette.jsx'
import Toast from './components/Toast.jsx'
import Cursor from './components/Cursor.jsx'
import { prefersReducedMotion, setMotion, getMotionOverride, systemReducesMotion } from './hooks/motionPrefs.js'

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

const storage = {
  get(store, key) {
    try {
      return window[store].getItem(key)
    } catch {
      return null
    }
  },
  set(store, key, value) {
    try {
      window[store].setItem(key, value)
    } catch {
      // приватный режим — не страшно
    }
  },
}

const scrollTo = (id) =>
  id === 'top'
    ? window.scrollTo({ top: 0, behavior: 'smooth' })
    : document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const downloadResume = () => {
  const a = document.createElement('a')
  a.href = links.resume
  a.download = ''
  a.click()
}

// Пасхалка Konami: заголовки «глючат», страница трясётся.
function glitch() {
  if (prefersReducedMotion()) return
  animate('.section__title, .hero__name', {
    translateX: [0, -6, 5, -3, 2, 0],
    skewX: [0, 12, -8, 4, 0],
    duration: 700,
    delay: stagger(40),
    ease: 'inOutSine',
  })
}

export default function App() {
  const [lang, setLang] = useState(() => storage.get('localStorage', 'lang') || 'ru')
  const [theme, setTheme] = useState(() => storage.get('localStorage', 'theme') || 'green')
  // Экран загрузки — один раз за сессию и не для тех, кто просил меньше движения.
  const [booted, setBooted] = useState(
    () => prefersReducedMotion() || storage.get('sessionStorage', 'booted') === '1',
  )
  const [bootShown, setBootShown] = useState(!booted)
  const [matrix, setMatrix] = useState(false)
  const [palette, setPalette] = useState(false)
  // Если анимации выключены системой и посетитель ещё не выбирал сам — подсказываем, как включить.
  const [toast, setToast] = useState(() =>
    systemReducesMotion() && !getMotionOverride() && storage.get('sessionStorage', 'motionHint') !== '1'
      ? content[lang].ui.motionHint
      : null,
  )
  const t = content[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    storage.set('localStorage', 'lang', lang)
  }, [lang])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    storage.set('localStorage', 'theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => setTheme((v) => (v === 'green' ? 'amber' : 'green')), [])

  // Горячие клавиши: Ctrl+K / ⌘K — палитра, Konami-код — пасхалка.
  useEffect(() => {
    // Последние нажатия: код засчитывается, если ими заканчивается буфер,
    // поэтому лишние клавиши перед кодом не мешают.
    let recent = []
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyK') {
        e.preventDefault()
        setPalette((v) => !v)
        return
      }
      // по e.code, чтобы B и A работали и в русской раскладке
      const key = e.code === 'KeyB' ? 'b' : e.code === 'KeyA' ? 'a' : e.key
      if (e.repeat) return // зажатая клавиша не считается повторными нажатиями
      recent = [...recent, key].slice(-KONAMI.length)
      if (recent.join() === KONAMI.join()) {
        recent = []
        glitch()
        setTheme((v) => (v === 'green' ? 'amber' : 'green'))
        setToast(content[lang].ui.konami)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lang])

  const actions = useMemo(() => {
    const ui = t.ui
    const sections = Object.entries(ui.sections).map(([id, label]) => ({
      id: 'go-' + id,
      group: ui.go,
      label,
      keywords: id,
      run: () => scrollTo(id),
    }))
    const projects = t.projects.list.map((p) => ({
      id: 'p-' + p.id,
      group: ui.project,
      label: p.name,
      keywords: p.tag + ' ' + p.stack.join(' '),
      run: () => window.open(p.demo || p.repo, '_blank', 'noopener'),
    }))
    const misc = [
      { id: 'uses', label: ui.uses, keywords: 'uses setup tools инструменты', run: () => (location.href = 'uses/') },
      { id: 'cv', label: ui.download, keywords: 'resume cv pdf резюме', run: downloadResume },
      { id: 'tg', label: ui.telegram, keywords: 'contact telegram', run: () => window.open(links.telegram, '_blank', 'noopener') },
      { id: 'gh', label: ui.github, keywords: 'github code', run: () => window.open(links.github, '_blank', 'noopener') },
      { id: 'lang', label: ui.lang, keywords: 'language язык ru en', run: () => setLang((l) => (l === 'ru' ? 'en' : 'ru')) },
      { id: 'theme', label: ui.theme, keywords: 'theme тема amber green', run: toggleTheme },
      {
        id: 'motion',
        label: prefersReducedMotion() ? ui.motionOn : ui.motionOff,
        keywords: 'motion animation анимации',
        run: () => setMotion(prefersReducedMotion()),
      },
      { id: 'matrix', label: ui.matrix, keywords: 'matrix neo', run: () => setMatrix(true) },
    ].map((a) => ({ ...a, group: ui.action }))
    return [...sections, ...projects, ...misc]
  }, [t, toggleTheme])

  const revealSite = useCallback(() => {
    storage.set('sessionStorage', 'booted', '1')
    setBooted(true)
  }, [])
  const hideBoot = useCallback(() => setBootShown(false), [])
  const closeMatrix = useCallback(() => setMatrix(false), [])
  const closePalette = useCallback(() => setPalette(false), [])
  const closeToast = useCallback(() => {
    storage.set('sessionStorage', 'motionHint', '1') // подсказку показываем раз за сессию
    setToast(null)
  }, [])

  return (
    <>
      <Nav
        t={t}
        lang={lang}
        setLang={setLang}
        theme={theme}
        onTheme={toggleTheme}
        onPalette={() => setPalette(true)}
      />
      <main>
        <Hero t={t} ready={booted} />
        <Shell t={t} lang={lang} setLang={setLang} onMatrix={() => setMatrix(true)} />
        <About t={t} lang={lang} />
        <Skills t={t} lang={lang} />
        <Projects t={t} lang={lang} />
        <Timeline t={t} lang={lang} />
        <GitHub t={t} lang={lang} />
        <Contact t={t} lang={lang} />
      </main>
      <footer className="footer">
        <span className="muted">
          // {t.footer} · <a href="uses/">uses</a>
        </span>
        <span className="muted">© {new Date().getFullYear()} Maxim Sereda</span>
      </footer>
      {palette && (
        <Palette actions={actions} placeholder={t.ui.palette} empty={t.ui.paletteEmpty} onClose={closePalette} />
      )}
      {matrix && <Matrix onClose={closeMatrix} />}
      {toast && <Toast text={toast} onDone={closeToast} duration={toast === t.ui.motionHint ? 9000 : 4000} />}
      <Cursor />
      {/* Boot поверх уже загружающегося сайта: шрифты и картинки грузятся параллельно */}
      {bootShown && <Boot onReveal={revealSite} onDone={hideBoot} />}
    </>
  )
}
