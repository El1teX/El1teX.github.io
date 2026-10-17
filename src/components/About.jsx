import Section from './Section.jsx'
import TypeText from './TypeText.jsx'

export default function About({ t, lang }) {
  const a = t.about
  return (
    <Section id="about" title={a.title} lang={lang}>
      <div className="about">
        <div className="about__text">
          {a.paragraphs.map((p, i) => (
            <TypeText key={i} text={p} />
          ))}
        </div>
        <dl className="about__facts" data-reveal>
          {a.facts.map(([k, v]) => (
            <div key={k} className="fact">
              <dt>{k}:</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
