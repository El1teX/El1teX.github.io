import ScrollProgress from './ScrollProgress.jsx'

export default function Nav({ t, lang, setLang, theme, onTheme, onPalette }) {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
  return (
    <header className="nav">
      <a href="#top" className="nav__logo">
        <span className="accent">~/</span>el1tex
      </a>
      <ScrollProgress />
      <nav className="nav__links">
        {Object.entries(t.nav).map(([id, label]) => (
          <a key={id} href={`#${id}`}>
            ./{label}
          </a>
        ))}
      </nav>
      <button className="nav__btn nav__k" onClick={onPalette} aria-label={t.ui.palette}>
        <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
        <kbd>K</kbd>
      </button>
      <button className="nav__btn nav__menu" onClick={onPalette}>
        ☰ {t.ui.menu}
      </button>
      <button
        className="nav__btn"
        onClick={onTheme}
        title={theme === 'green' ? t.ui.themeAmber : t.ui.themeGreen}
        aria-label={t.ui.theme}
      >
        <span className="nav__swatch" />
      </button>
      <div className="nav__lang" role="group" aria-label="Language">
        {['ru', 'en'].map((l) => (
          <button key={l} className={l === lang ? 'is-active' : ''} onClick={() => setLang(l)}>
            {l}
          </button>
        ))}
      </div>
    </header>
  )
}
