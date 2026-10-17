import { useEffect, useMemo, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'
import { prefersReducedMotion } from '../hooks/motionPrefs.js'

// Командная палитра (Ctrl+K / ⌘K): быстрый переход по сайту и действия.
export default function Palette({ actions, placeholder, empty, onClose }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const boxRef = useRef(null)
  const listRef = useRef(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? actions.filter((a) => (a.label + ' ' + (a.keywords || '')).toLowerCase().includes(q)) : actions
  }, [actions, query])

  useEffect(() => setActive(0), [query])

  useEffect(() => {
    if (prefersReducedMotion()) return
    animate(boxRef.current, { opacity: [0, 1], scale: [0.96, 1], translateY: [-10, 0], duration: 260, ease: 'outQuad' })
  }, [])

  useEffect(() => {
    if (prefersReducedMotion() || !listRef.current) return
    animate(listRef.current.children, {
      opacity: [0, 1],
      translateX: [-6, 0],
      duration: 220,
      delay: stagger(18),
      ease: 'outQuad',
    })
  }, [filtered.length])

  const run = (a) => {
    onClose()
    // даём палитре закрыться, чтобы прокрутка не дёргалась
    requestAnimationFrame(() => a.run())
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(filtered.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter' && filtered[active]) run(filtered[active])
  }

  return (
    <div className="palette" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="palette__box" ref={boxRef} role="dialog" aria-modal="true" aria-label="Command palette">
        <label className="palette__input">
          <span className="prompt">&gt;</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            spellCheck="false"
            aria-controls="palette-list"
            aria-activedescendant={filtered[active] ? `pal-${filtered[active].id}` : undefined}
          />
          <kbd>esc</kbd>
        </label>
        <ul className="palette__list" id="palette-list" role="listbox" ref={listRef}>
          {filtered.map((a, i) => (
            <li
              key={a.id}
              id={`pal-${a.id}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? 'is-active' : ''}
              onMouseEnter={() => setActive(i)}
              onClick={() => run(a)}
            >
              <span className="palette__group muted">{a.group}</span>
              {a.label}
            </li>
          ))}
          {!filtered.length && <li className="muted">{empty}</li>}
        </ul>
      </div>
    </div>
  )
}
