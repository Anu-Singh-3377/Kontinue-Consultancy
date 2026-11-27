import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button type="button" className="scroll-top" onClick={scrollToTop} aria-label="Scroll to top">
      <ChevronUp size={20} />
    </button>
  );
}
