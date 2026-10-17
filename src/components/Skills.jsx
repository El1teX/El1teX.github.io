import { animate, scrambleText } from 'animejs'
import Section from './Section.jsx'
import { prefersReducedMotion } from '../hooks/motionPrefs.js'

// По наведению название навыка «перешифровывается».
const scramble = (e) => {
  if (prefersReducedMotion()) return
  animate(e.currentTarget.querySelector('.chip__label'), {
    innerHTML: scrambleText({ chars: 'blocks' }),
    duration: 450,
  })
}

export default function Skills({ t, lang }) {
  return (
    <Section id="skills" cmd="ls -la" title={t.skills.title + '/'} lang={lang}>
      <div className="skills">
        {t.skills.groups.map((g) => (
          <div key={g.name} className="skills__group" data-reveal>
            <h3>
              <span className="muted">drwxr-xr-x</span> {g.name}/
            </h3>
            <ul>
              {g.items.map((s) => (
                <li key={s} className="chip" onMouseEnter={scramble}>
                  <span className="chip__label">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
