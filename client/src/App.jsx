import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ApproachPage from './pages/ApproachPage';
import InsightsPage from './pages/InsightsPage';
import ArticlePage from './pages/ArticlePage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import ContactPage from './pages/ContactPage';
import LegalPage from './pages/LegalPage';
import NotFoundPage from './pages/NotFoundPage';
import BookConsultationPage from './pages/BookConsultationPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { ForgotPasswordPage, ResetPasswordPage } from './pages/auth/PasswordPages';
import { workspaceRoutes } from './pages/WorkspaceRoutes';
import './styles/portal.css';

function AppLayout() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/approach" element={<ApproachPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/insights/:slug" element={<ArticlePage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<LegalPage slug="privacy-policy" />} />
          <Route path="/cookie-policy" element={<LegalPage slug="cookie-policy" />} />
          <Route path="/disclaimer" element={<LegalPage slug="disclaimer" />} />
          <Route path="/company-details" element={<LegalPage slug="company-details" />} />

          {/* Public: browsing and the booking page need no login; submitting does. */}
          <Route path="/book-consultation" element={<BookConsultationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Private: My Portfolio, Consultant and Admin, all inside this same Header/Footer. */}
          {workspaceRoutes}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTop />
      <CookieConsent />
    </>
  );
}

export default function App() {
  return <AppLayout />;
}
