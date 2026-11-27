import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function TestimonialCarousel({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];

  const showPrevious = () => {
    setActiveIndex((index) => (index - 1 + items.length) % items.length);
  };

  const showNext = () => {
    setActiveIndex((index) => (index + 1) % items.length);
  };

  if (!items.length) return null;

  return (
    <div className="testimonial-carousel" role="region" aria-label="Client testimonials">
      <article
        className="testimonial testimonial-carousel__slide"
        aria-roledescription="slide"
        aria-label={`${activeIndex + 1} of ${items.length}`}
        key={activeIndex}
      >
        <p>&ldquo;{activeItem.quote}&rdquo;</p>
        <strong>{activeItem.name}</strong>
      </article>
      <div className="testimonial-carousel__controls">
        <button type="button" onClick={showPrevious} aria-label="Previous testimonial">
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <span aria-live="polite">{activeIndex + 1} / {items.length}</span>
        <button type="button" onClick={showNext} aria-label="Next testimonial">
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
