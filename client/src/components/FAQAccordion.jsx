import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className={`faq-item ${isOpen ? 'open' : ''}`}>
            <button
              type="button"
              className="faq-question"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <ChevronDown className={`faq-chevron ${isOpen ? 'faq-chevron--open' : ''}`} size={18} />
            </button>
            <div className="faq-answer">{item.answer}</div>
          </div>
        );
      })}
    </div>
  );
}
