import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

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
    <button type="button" className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Scroll to top">
      <ChevronUp size={20} />
    </button>
  );
}
