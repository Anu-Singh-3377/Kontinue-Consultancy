import { Routes, Route } from 'react-router-dom';
import SiteLayout from './layouts/SiteLayout';
import HomePage from './pages/public/Home/HomePage';
import AboutPage from './pages/public/About/AboutPage';
import ServicesPage from './pages/public/Services/ServicesPage';
import ServiceDetailPage from './pages/public/Services/ServiceDetailPage';
import ApproachPage from './pages/public/Approach/ApproachPage';
import InsightsPage from './pages/public/Insights/InsightsPage';
import ArticlePage from './pages/public/Insights/ArticlePage';
import CaseStudiesPage from './pages/public/CaseStudies/CaseStudiesPage';
import ContactPage from './pages/public/Contact/ContactPage';
import LegalPage from './pages/public/Legal/LegalPage';
import NotFoundPage from './pages/public/NotFound/NotFoundPage';
import BookConsultationPage from './pages/client/BookConsultation/BookConsultationPage';
import LoginPage from './pages/auth/Login/LoginPage';
import RegisterPage from './pages/auth/Register/RegisterPage';
import { ForgotPasswordPage, ResetPasswordPage } from './pages/auth/Password/PasswordPages';
import { workspaceRoutes } from './routes/WorkspaceRoutes';
import './styles/portal.css';

export default function App() {
  return (
    <Routes>
      {/* Every page shares the same Header and Footer (see layouts/SiteLayout.jsx). */}
      <Route element={<SiteLayout />}>
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
      </Route>
    </Routes>
  );
}
