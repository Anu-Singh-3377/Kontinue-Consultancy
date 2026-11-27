import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo height={26} className="footer-logo" />
            <p className="footer-brand__descriptor">Financial &amp; Accounting Consultancy</p>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/about">About Us</Link>
              <Link to="/services">Services</Link>
              <Link to="/approach">Our Approach</Link>
              <Link to="/insights">Insights</Link>
              <Link to="/case-studies">Case Studies</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          <div className="footer-column">
            <h4>Our Services</h4>
            <div className="footer-links">
              <Link to="/services/bookkeeping-accounting">Bookkeeping</Link>
              <Link to="/services/annual-accounts">Annual Accounts</Link>
              <Link to="/services/tax-advisory">Tax Consultancy</Link>
              <Link to="/services/financial-management">Financial Management</Link>
            </div>
          </div>

          <div className="footer-column">
            <h4>Contact</h4>
            <div className="footer-contact">
              <span>The Hague, Netherlands</span>
              <a href="mailto:hello@kontinu-consultancy.nl">Email</a>
              <a href="tel:+310700000000">Telephone</a>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/cookie-policy">Cookie Policy</Link>
              <Link to="/disclaimer">Disclaimer</Link>
              <Link to="/company-details">Company Details</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">© 2026 Kontinue Consultancy B.V. All Rights Reserved.</div>
      </div>
    </footer>
  );
}
