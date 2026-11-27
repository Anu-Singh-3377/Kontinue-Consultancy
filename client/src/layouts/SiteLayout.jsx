import { Outlet } from 'react-router-dom';
import Header from '../components/navbar/Header';
import Footer from '../components/footer/Footer';
import ScrollToTop from '../components/layout/ScrollToTop';
import CookieConsent from '../components/layout/CookieConsent';

// The one Kontinue page shell: every page (public, auth, client, consultant,
// admin) renders between the same Header and Footer.
export default function SiteLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <CookieConsent />
    </>
  );
}
