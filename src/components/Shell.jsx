import { useEffect, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'
import Section from './Section.jsx'
import { links } from '../data.js'
import { prefersReducedMotion, setMotion } from '../hooks/motionPrefs.js'
import TypeText from './TypeText.jsx'

const SECTIONS = ['about', 'skills', 'projects', 'history', 'activity', 'contact']
const COMMANDS = ['help', 'whoami', 'about', 'skills', 'projects', 'open', 'roadmap', 'contact', 'resume', 'cd', 'lang', 'motion', 'matrix', 'clear', 'sudo', 'ls', 'date', 'echo']

const QUICK = ['help', 'whoami', 'projects', 'contact', 'resume', 'sudo hire maxim', 'matrix', 'clear']

let nextId = 0
const line = (content, kind = 'out') => ({ id: nextId++, kind, content })

export default function Shell({ t, lang, setLang, onMatrix }) {
  const s = t.shell
  const [lines, setLines] = useState(() => [line(s.welcome, 'muted')])
  const [value, setValue] = useState('')
  const history = useRef([])
  const histPos = useRef(0)
  const inputRef = useRef(null)
  const screenRef = useRef(null)
  const lastSeen = useRef(0)

  // Новые строки выезжают слева по очереди.
  useEffect(() => {
    const screen = screenRef.current
    screen.scrollTop = screen.scrollHeight
    const fresh = [...screen.querySelectorAll('.shell__line')].filter(
      (el) => Number(el.dataset.id) >= lastSeen.current,
    )
    lastSeen.current = nextId
    if (!fresh.length || prefersReducedMotion()) return
    animate(fresh, {
      opacity: [0, 1],
      translateX: [-8, 0],
      duration: 300,
      delay: stagger(40),
      ease: 'outQuad',
    })
  }, [lines])

  const run = (raw) => {
    const input = raw.trim()
    const [cmd = '', ...args] = input.split(/\s+/)
    const arg = args.join(' ')
    const out = []
    const say = (c, kind) => out.push(line(c, kind))

    switch (cmd.toLowerCase()) {
      case '':
        break
      case 'help':
        s.help.forEach(([c, d]) =>
          say(
            <>
              <span className="accent shell__cmd">{c}</span>
              <span className="muted">{d}</span>
            </>,
          ),
        )
        break
      case 'whoami':
        say(s.whoami)
        break
      case 'about':
        say(s.about)
        break
      case 'skills':
        t.skills.groups.forEach((g) =>
          say(
            <>
              <span className="amber">{g.name}/</span> {g.items.join(' · ')}
            </>,
          ),
        )
        break
      case 'ls':
        say(SECTIONS.map((x) => x + '/').join('  '))
        break
      case 'projects':
        t.projects.list.forEach((p, i) =>
          say(
            <>
              <span className="amber">[{i + 1}]</span> <b>{p.name}</b> <span className="muted">— {p.tag}</span>
            </>,
          ),
        )
        say(lang === 'ru' ? 'подробнее: open 1' : 'details: open 1', 'muted')
        break
      case 'open': {
        const p = t.projects.list[Number(arg) - 1]
        if (!p) {
          say(`open: 1-${t.projects.list.length}`, 'err')
          break
        }
        say(s.opening(p.name))
        window.open(p.demo || p.repo, '_blank', 'noopener')
        break
      }
      case 'roadmap':
        t.timeline.next.forEach((x) => say(<>→ {x}</>))
        break
      case 'contact':
        say(
          <>
            telegram: <a href={links.telegram} target="_blank" rel="noreferrer">@exex37</a>
          </>,
        )
        say(
          <>
            github: <a href={links.github} target="_blank" rel="noreferrer">El1teX</a>
          </>,
        )
        break
      case 'resume':
      case 'cv': {
        say(s.opening(t.hero.cv))
        const a = document.createElement('a')
        a.href = links.resume
        a.download = ''
        a.click()
        break
      }
      case 'cd': {
        const target = arg.replace(/^\.?\/?|\/$/g, '')
        if (!target || target === '~') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
          break
        }
        if (!SECTIONS.includes(target)) {
          say(s.cdUnknown(target), 'err')
          break
        }
        say(s.cd(target), 'muted')
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
        break
      }
      case 'motion':
        if (arg === 'on' || arg === 'off') {
          say(arg === 'on' ? t.ui.motionOn : t.ui.motionOff, 'ok')
          setTimeout(() => setMotion(arg === 'on'), 400)
        } else say('motion on | motion off', 'err')
        break
      case 'lang':
        if (arg === 'ru' || arg === 'en') {
          setLang(arg)
          say(s.lang, 'muted')
        } else say('lang ru | lang en', 'err')
        break
      case 'date':
        say(new Date().toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US'))
        break
      case 'echo':
        say(arg)
        break
      case 'sudo':
        if (/^hire\s+maxim$/i.test(arg)) s.sudo.forEach((x, i) => say(x, i === 1 ? 'ok' : 'out'))
        else say(s.sudoNo, 'err')
        break
      case 'matrix':
        say(s.matrix, 'ok')
        onMatrix()
        break
      case 'clear':
        setLines([])
        return
      default:
        say(s.notFound(cmd), 'err')
    }
    setLines((prev) => [...prev, line(input, 'in'), ...out].slice(-80))
  }

  const onKeyDown = (e) => {
    const h = history.current
    if (e.key === 'Enter') {
      if (value.trim()) h.push(value)
      histPos.current = h.length
      run(value)
      setValue('')
    } else if (e.key === 'ArrowUp' && h.length) {
      e.preventDefault()
      histPos.current = Math.max(0, histPos.current - 1)
      setValue(h[histPos.current])
    } else if (e.key === 'ArrowDown' && h.length) {
      e.preventDefault()
      histPos.current = Math.min(h.length, histPos.current + 1)
      setValue(h[histPos.current] ?? '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const match = COMMANDS.filter((c) => c.startsWith(value.trim()))
      if (value.trim() && match.length === 1) setValue(match[0] + ' ')
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <Section id="shell" cmd="./" title={s.title} lang={lang}>
      <TypeText className="muted shell__hint" text={s.hint} />
      <div className="shell__quick" data-reveal role="group" aria-label={t.ui.quick}>
        {QUICK.map((c) => (
          <button key={c} className="chip" onClick={() => run(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="shell" data-reveal onClick={() => inputRef.current?.focus({ preventScroll: true })}>
        <div className="shell__screen" ref={screenRef} aria-live="polite">
          {lines.map((l) => (
            <div key={l.id} data-id={l.id} className={`shell__line shell__line--${l.kind}`}>
              {l.kind === 'in' && <span className="shell__ps1">guest@el1tex:~$</span>}
              {l.content}
            </div>
          ))}
          <label className="shell__input">
            <span className="shell__ps1">guest@el1tex:~$</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={s.placeholder}
              spellCheck="false"
              autoComplete="off"
              autoCapitalize="off"
              aria-label={s.placeholder}
            />
          </label>
        </div>
      </div>
    </Section>
  )
}
