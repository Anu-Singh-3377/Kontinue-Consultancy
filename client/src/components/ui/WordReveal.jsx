import { Fragment } from 'react';

// Headline whose words rise into view one after another on page load.
// The full text stays available to screen readers through aria-label.
export default function WordReveal({ as: Element = 'h1', text, className = '', startDelay = 0, step = 70 }) {
  const words = text.split(' ');
  return (
    <Element className={`word-reveal ${className}`.trim()} aria-label={text}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="word-reveal__mask" aria-hidden="true">
            <span className="word-reveal__word" style={{ animationDelay: `${startDelay + index * step}ms` }}>
              {word}
            </span>
          </span>
          {index < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Element>
  );
}
