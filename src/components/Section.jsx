import { useReveal } from '../hooks/useReveal.js'

// Секция в виде команды терминала: «$ cat <title>» и содержимое.
export default function Section({ id, cmd = 'cat', title, lang, children }) {
  const ref = useReveal([lang])
  return (
    <section id={id} ref={ref} className="section">
      <h2 className="section__title">
        <span className="prompt">$</span> {cmd}
        {cmd.endsWith('/') ? '' : ' '}
        <span key={title + lang} data-scramble className="accent">
          {title}
        </span>
      </h2>
      {children}
    </section>
  )
}
