import { useEffect, useRef } from 'react'
import { createAnimatable } from 'animejs'
import Section from './Section.jsx'
import { prefersReducedMotion } from '../hooks/motionPrefs.js'
import TypeText from './TypeText.jsx'

// Видео грузится и играет, только пока карточка на экране. При «уменьшить движение» — постер.
function ShotVideo({ src, poster, label }) {
  const ref = useRef(null)
  useEffect(() => {
    const video = ref.current
    if (prefersReducedMotion()) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? video.play().catch(() => {}) : video.pause()), {
      threshold: 0.4,
    })
    io.observe(video)
    return () => io.disconnect()
  }, [])
  return (
    <>
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" aria-label={label} />
      <span className="card__badge">● demo</span>
    </>
  )
}

function ProjectCard({ p, t, index }) {
  const ref = useRef(null)
  const anim = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    // createAnimatable — плавный 3D-наклон карточки за курсором.
    anim.current = createAnimatable(ref.current, { rotateX: 500, rotateY: 500, ease: 'out(3)' })
    return () => anim.current?.revert()
  }, [])

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.setProperty('--mx', `${(x + 0.5) * 100}%`)
    ref.current.style.setProperty('--my', `${(y + 0.5) * 100}%`)
    anim.current?.rotateY(x * 10)
    anim.current?.rotateX(-y * 10)
  }
  const onLeave = () => {
    anim.current?.rotateX(0)
    anim.current?.rotateY(0)
  }

  return (
    <article className="card" data-reveal ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
      <a className="card__shot" href={p.demo || p.repo} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true">
        {p.video ? (
          <ShotVideo src={p.video} poster={p.image} label={p.name} />
        ) : p.image ? (
          <img src={p.image} alt={p.name} loading="lazy" width="1280" height="800" />
        ) : (
          // Нет скриншота — показываем «экран терминала» с названием репозитория.
          <pre className="card__placeholder" aria-hidden="true">
            <span className="amber">$</span> git clone {p.repo.replace('https://github.com/', '')}
            {'\n'}
            <span className="muted">Cloning into &apos;{p.repo.split('/').pop()}&apos;…</span>
            {'\n'}
            <span className="accent">{p.tag}</span>
          </pre>
        )}
      </a>
      <div className="card__head">
        <span className="muted">{String(index + 1).padStart(2, '0')}</span>
        <span className="card__tag">{p.tag}</span>
      </div>
      <h3 className="card__name">{p.name}</h3>
      <TypeText className="card__desc" text={p.desc} />
      <ul className="card__stack">
        {p.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <div className="card__links">
        <a href={p.repo} target="_blank" rel="noreferrer">
          [{t.projects.code}]
        </a>
        {p.demo && (
          <a href={p.demo} target="_blank" rel="noreferrer">
            [{t.projects.demo} ↗]
          </a>
        )}
      </div>
    </article>
  )
}

export default function Projects({ t, lang }) {
  return (
    <Section id="projects" cmd="git log --oneline" title={t.projects.title} lang={lang}>
      <div className="projects">
        {t.projects.list.map((p, i) => (
          <ProjectCard key={p.id} p={p} t={t} index={i} />
        ))}
      </div>
    </Section>
  )
}
