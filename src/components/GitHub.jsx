import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'
import Section from './Section.jsx'
import { links } from '../data.js'
import { prefersReducedMotion } from '../hooks/motionPrefs.js'

const USER = 'El1teX'
const WEEKS = 26
const CACHE_KEY = 'gh-cache-v1'
const CACHE_TTL = 30 * 60 * 1000

// Публичный API GitHub (60 запросов в час без токена) + открытый сервис календаря вкладов.
// Кешируем в sessionStorage, чтобы не тратить лимит при каждом обновлении страницы.
let inflight = null
const loadGitHub = () => (inflight ??= fetchGitHub().catch((e) => ((inflight = null), Promise.reject(e))))

async function fetchGitHub() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY))
    if (cached && Date.now() - cached.at < CACHE_TTL) return cached.data
  } catch {
    // нет кеша — грузим заново
  }

  const json = (url) => fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
  const [user, repos, calendar] = await Promise.allSettled([
    json(`https://api.github.com/users/${USER}`),
    json(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=6`),
    json(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`),
  ])
  if (user.status !== 'fulfilled' && calendar.status !== 'fulfilled') throw new Error('github unavailable')

  // В событиях GitHub больше нет списка коммитов, поэтому берём по паре
  // последних коммитов из трёх недавно обновлённых репозиториев.
  const recent = (repos.value ?? []).filter((r) => r.name !== USER && !r.fork).slice(0, 3)
  const perRepo = await Promise.allSettled(
    recent.map((r) => json(`https://api.github.com/repos/${r.full_name}/commits?per_page=3`)),
  )
  const commits = perRepo
    .flatMap((res, i) =>
      res.status === 'fulfilled'
        ? res.value.map((c) => ({
            repo: recent[i].name,
            message: c.commit.message.split('\n')[0],
            sha: c.sha.slice(0, 7),
            url: c.html_url,
            date: c.commit.author.date,
          }))
        : [],
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)

  // Календарь начинаем с понедельника, чтобы столбцы были неделями.
  let days = (calendar.value?.contributions ?? []).slice(-WEEKS * 7)
  while (days.length && new Date(days[0].date + 'T12:00').getDay() !== 1) days = days.slice(1)
  const data = {
    repos: user.value?.public_repos ?? null,
    since: user.value?.created_at ?? null,
    total: calendar.value?.total?.lastYear ?? null,
    commits,
    days,
  }
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }))
  } catch {
    // приватный режим — работаем без кеша
  }
  return data
}

export default function GitHub({ t, lang }) {
  const g = t.github
  const [state, setState] = useState({ status: 'loading' })
  const gridRef = useRef(null)

  useEffect(() => {
    let alive = true
    loadGitHub()
      .then((data) => alive && setState({ status: 'ok', data }))
      .catch(() => alive && setState({ status: 'error' }))
    return () => {
      alive = false
    }
  }, [])

  // Клетки календаря «прорастают» волной слева направо, когда блок виден.
  useEffect(() => {
    const grid = gridRef.current
    if (state.status !== 'ok' || !grid) return
    // на узком экране сразу показываем последние недели
    grid.parentElement.scrollLeft = grid.parentElement.scrollWidth
    if (prefersReducedMotion()) return
    const cells = grid.querySelectorAll('.heat__cell')
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      animate(cells, {
        scale: [0, 1],
        opacity: [0, 1],
        duration: 500,
        // клетки идут по столбцам-неделям: задержка зависит от номера недели и дня
        delay: (_, i) => Math.floor(i / 7) * 28 + (i % 7) * 10,
        ease: 'outBack',
      })
    })
    io.observe(grid)
    return () => io.disconnect()
  }, [state.status])

  const locale = lang === 'ru' ? 'ru-RU' : 'en-US'
  const fmt = (d, opts) => new Date(d).toLocaleDateString(locale, opts)

  return (
    <Section id="activity" cmd="gh api" title={`users/${USER}/${g.title}`} lang={lang}>
      {state.status === 'loading' && <p className="muted">{g.loading}</p>}
      {state.status === 'error' && (
        <p className="muted">
          {g.error}{' '}
          <a href={links.github} target="_blank" rel="noreferrer" className="accent">
            github.com/{USER}
          </a>
        </p>
      )}
      {state.status === 'ok' && (
        <div className="gh">
          <div className="gh__stats" data-reveal>
            {state.data.total != null && (
              <div className="stat">
                <b>{state.data.total}</b>
                <span>{g.contributions}</span>
              </div>
            )}
            {state.data.repos != null && (
              <div className="stat">
                <b>{state.data.repos}</b>
                <span>{g.repos}</span>
              </div>
            )}
            {state.data.since && (
              <div className="stat">
                <b>{fmt(state.data.since, { year: 'numeric' })}</b>
                <span>{g.since}</span>
              </div>
            )}
          </div>

          {state.data.days.length > 0 && (
            <div className="heat" data-reveal>
              <div className="heat__grid" ref={gridRef}>
                {state.data.days.map((d) => (
                  <span
                    key={d.date}
                    className={`heat__cell heat__cell--${d.level}`}
                    title={`${fmt(d.date, { day: 'numeric', month: 'short' })}: ${d.count}`}
                  />
                ))}
              </div>
              <div className="heat__legend muted">
                {g.less}
                {[0, 1, 2, 3, 4].map((l) => (
                  <span key={l} className={`heat__cell heat__cell--${l}`} />
                ))}
                {g.more}
              </div>
            </div>
          )}

          {state.data.commits.length > 0 && (
            <div className="gh__log" data-reveal>
              <p className="muted">// {g.recent}</p>
              <ul>
                {state.data.commits.map((c) => (
                  <li key={c.sha + c.repo}>
                    <a href={c.url} target="_blank" rel="noreferrer" className="amber">
                      {c.sha}
                    </a>{' '}
                    <span className="accent">({c.repo})</span> {c.message}{' '}
                    <span className="muted">· {fmt(c.date, { day: 'numeric', month: 'short' })}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Section>
  )
}
