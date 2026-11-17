import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { navLinks } from '../data/siteData';
import LanguageToggle from './LanguageToggle';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
        <div className="container navbar">
          <Link to="/" className="brand" aria-label="Kontinue home">
            <span className="brand__mark">K</span>
            <span>Kontinue</span>
          </Link>

          <nav className="nav-links" aria-label="Main navigation">
            {navLinks.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <LanguageToggle />
            <Link to="/contact" className="button button-primary">Schedule a Consultation</Link>
            <button className="mobile-menu-toggle" type="button" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle navigation menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          <div className="container">
            <nav>
              {navLinks.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
