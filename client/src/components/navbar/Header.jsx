import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogIn, LogOut, Menu, UserRound, X } from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { navLinks, secondaryNavLinks, serviceCatalog } from '../../data/siteData';
import Logo from '../common/Logo';

const ACCOUNT_LINKS = {
  admin: { to: '/admin', label: 'Admin Dashboard' },
  service: { to: '/service', label: 'Consultant Portal' },
};

export default function Header() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const accountLink = ACCOUNT_LINKS[role] || { to: '/my-portfolio', label: 'My Portfolio' };

  // Leave the private page first, so its login guard doesn't redirect to a login screen.
  const handleLogout = async () => {
    navigate('/', { replace: true });
    await signOut();
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const headerRef = useRef(null);
  const menuToggleRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    let frameId;
    let previousValue = false;
    const onScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const nextValue = window.scrollY > 24;
        if (nextValue !== previousValue) {
          previousValue = nextValue;
          setScrolled(nextValue);
        }
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen((isOpen) => {
          if (isOpen) menuToggleRef.current?.focus();
          return false;
        });
        setServicesOpen(false);
        setMobileServicesOpen(false);
      }
    };

    const closeOnOutsideClick = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setServicesOpen(false);
      }
    };

    window.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const menu = mobileMenuRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menu?.querySelector('a, button')?.focus();

    const trapFocus = (event) => {
      if (event.key !== 'Tab' || !menu) return;
      const focusable = [menuToggleRef.current, ...menu.querySelectorAll('a, button')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', trapFocus);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', trapFocus);
    };
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}
    >
        <div className="container navbar">
          <Link to="/" className="brand" aria-label="Kontinue home">
            <Logo height={26} />
          </Link>

          <nav className="nav-links" aria-label="Main navigation">
            {navLinks.map((item) => item.label === 'Services' ? (
              <div
                className={`nav-item nav-item--dropdown ${servicesOpen ? 'is-open' : ''}`}
                key={item.to}
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
                onFocus={() => setServicesOpen(true)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setServicesOpen(false);
                  }
                }}
              >
                <div className="nav-item__trigger">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    onClick={() => setServicesOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                  <button
                    type="button"
                    className="nav-dropdown-toggle"
                    aria-label="Open services menu"
                    aria-expanded={servicesOpen}
                    aria-controls="services-dropdown"
                    onClick={() => setServicesOpen(true)}
                  >
                    <ChevronDown size={15} aria-hidden="true" />
                  </button>
                </div>
                <div
                  id="services-dropdown"
                  className="nav-dropdown"
                  aria-hidden={!servicesOpen}
                  inert={!servicesOpen}
                >
                  {serviceCatalog.map((service) => (
                    <NavLink key={service.slug} to={`/services/${service.slug}`}>
                      {service.title}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            {user ? (
              <>
                <NavLink to={accountLink.to} className="header-account">
                  <UserRound size={16} aria-hidden="true" /> {accountLink.label}
                </NavLink>
                <button type="button" className="header-account" onClick={handleLogout}>
                  <LogOut size={16} aria-hidden="true" /> Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className="header-account">
                <LogIn size={16} aria-hidden="true" /> Login
              </NavLink>
            )}
            <Link to="/book-consultation" className="button button-outline-light button--sm header-cta">Book a Consultation</Link>
            <button
              ref={menuToggleRef}
              className="mobile-menu-toggle"
              type="button"
              onClick={() => setMenuOpen((isOpen) => !isOpen)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div
          id="mobile-navigation"
          ref={mobileMenuRef}
          className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
        >
          <div className="container mobile-menu__inner">
            <nav aria-label="Mobile navigation">
              {navLinks.map((item) => (
                item.label === 'Services' ? (
                  <div className="mobile-nav-group" key={item.to}>
                    <div className="mobile-nav-group__heading">
                      <NavLink to={item.to}>Services</NavLink>
                      <button
                        type="button"
                        aria-label="Toggle service links"
                        aria-expanded={mobileServicesOpen}
                        onClick={() => setMobileServicesOpen((isOpen) => !isOpen)}
                      >
                        <ChevronDown size={18} aria-hidden="true" />
                      </button>
                    </div>
                    <div className={`mobile-subnav ${mobileServicesOpen ? 'mobile-subnav--open' : ''}`}>
                      {serviceCatalog.map((service) => (
                        <NavLink key={service.slug} to={`/services/${service.slug}`}>
                          {service.title}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink key={item.to} to={item.to} end={item.to === '/'}>
                    {item.label}
                  </NavLink>
                )
              ))}
              <div className="mobile-menu__divider" aria-hidden="true" />
              {secondaryNavLinks.map((item) => (
                <NavLink key={item.to} to={item.to} end>
                  {item.label}
                </NavLink>
              ))}
              <div className="mobile-menu__divider" aria-hidden="true" />
              {user ? (
                <>
                  <NavLink to={accountLink.to}>{accountLink.label}</NavLink>
                  <button type="button" className="mobile-menu__logout" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <NavLink to="/login">Login</NavLink>
              )}
            </nav>
            <Link to="/book-consultation" className="button button-primary mobile-menu__cta">Book a Consultation</Link>
          </div>
        </div>
      </header>
  );
}
