import Reveal from '../ui/Reveal';

export default function CaseStudyCard({ study, delay = 0 }) {
  return (
    <Reveal as="article" className="case-card" delay={delay}>
      <div className="case-card__media">
        <img
          src={study.image}
          alt=""
          width="900"
          height="563"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="case-card__body">
        <span className="tag">{study.sector}</span>
        <h3>{study.title}</h3>
        <p>{study.summary}</p>
        <p className="case-card__result">{study.result}</p>
      </div>
    </Reveal>
  );
}
