import Section from './Section.jsx'
import { links } from '../data.js'
import TypeText from './TypeText.jsx'

export default function Contact({ t, lang }) {
  return (
    <Section id="contact" cmd="./" title={t.contact.title + '.sh'} lang={lang}>
      <TypeText className="contact__lead" text={t.contact.lead} msPerChar={16} />
      <pre className="contact__cmd" data-reveal>
        <span className="prompt">$</span> {t.contact.cmd}
      </pre>
      <div className="contact__links" data-reveal>
        <a className="btn btn--primary" href={links.telegram} target="_blank" rel="noreferrer">
          telegram: @exex37
        </a>
        <a className="btn" href={links.github} target="_blank" rel="noreferrer">
          github: El1teX
        </a>
        <a className="btn" href={links.resume} download>
          ↓ {t.hero.cv}
        </a>
      </div>
    </Section>
  )
}
