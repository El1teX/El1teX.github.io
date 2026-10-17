// Отдельная страница /uses. Делит с главной стили, шрифт, тему, язык и анимации.
import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/700.css'
import '@fontsource/jetbrains-mono/800.css'
import './styles.css'
import { uses } from './uses-data.js'
import Section from './components/Section.jsx'
import TypeText from './components/TypeText.jsx'
import Cursor from './components/Cursor.jsx'

const read = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

function UsesPage() {
  const [lang, setLang] = useState(() => read('lang', 'ru'))
  const u = uses[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dataset.theme = read('theme', 'green')
    document.title = lang === 'ru' ? 'Максим Середа — uses' : 'Maxim Sereda — uses'
    try {
      localStorage.setItem('lang', lang)
    } catch {
      // приватный режим — не страшно
    }
  }, [lang])

  return (
    <>
      <header className="nav">
        <a href="../" className="nav__logo">
          <span className="accent">~/</span>el1tex
        </a>
        <a href="../" className="nav__btn uses__back">
          ← {u.back}
        </a>
        <div className="nav__lang" role="group" aria-label="Language">
          {['ru', 'en'].map((l) => (
            <button key={l} className={l === lang ? 'is-active' : ''} onClick={() => setLang(l)}>
              {l}
            </button>
          ))}
        </div>
      </header>
      <main>
        <Section id="uses" title="uses.md" lang={lang}>
          <h1 className="sr-only">{u.title}</h1>
          <TypeText className="uses__lead" text={u.lead} />
          <div className="uses">
            {u.groups.map((g) => (
              <section key={g.name} className="uses__group" data-reveal>
                <h2>
                  <span className="muted">drwxr-xr-x</span> {g.name}/
                </h2>
                <dl>
                  {g.items.map(([name, note]) => (
                    <div key={name} className="uses__item">
                      <dt className="accent">{name}</dt>
                      <dd>{note}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </Section>
      </main>
      <footer className="footer">
        <a href="../" className="muted">
          ← {u.back}
        </a>
        <span className="muted">© {new Date().getFullYear()} Maxim Sereda</span>
      </footer>
      <Cursor />
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UsesPage />
  </StrictMode>,
)
