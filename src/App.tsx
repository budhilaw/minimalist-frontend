import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useScrollToTop } from './hooks/useScrollToTop';
import { LoadingSpinner } from './components/LoadingSpinner';
import { FeatureRoute } from './components/FeatureRoute';

// Immediate loading for critical components
import { Home } from './pages/Home';

// Lazy load all pages
const About = React.lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Portfolio = React.lazy(() => import('./pages/Portfolio').then(module => ({ default: module.Portfolio })));
const PortfolioDetail = React.lazy(() => import('./pages/PortfolioDetail').then(module => ({ default: module.PortfolioDetail })));
const Services = React.lazy(() => import('./pages/Services').then(module => ({ default: module.Services })));
const Contact = React.lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const BlogPosts = React.lazy(() => import('./pages/BlogPosts').then(module => ({ default: module.BlogPosts })));
const BlogPost = React.lazy(() => import('./pages/BlogPost').then(module => ({ default: module.BlogPost })));
const NotFound = React.lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })));

// Lazy load admin components
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin').then(module => ({ default: module.AdminLogin })));
const ProtectedRoute = React.lazy(() => import('./components/admin/ProtectedRoute').then(module => ({ default: module.ProtectedRoute })));
const AdminLayout = React.lazy(() => import('./components/admin/AdminLayout').then(module => ({ default: module.AdminLayout })));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const AdminPosts = React.lazy(() => import('./pages/admin/AdminPosts').then(module => ({ default: module.AdminPosts })));
const AdminPortfolio = React.lazy(() => import('./pages/admin/AdminPortfolio').then(module => ({ default: module.AdminPortfolio })));
const AdminServices = React.lazy(() => import('./pages/admin/AdminServices').then(module => ({ default: module.AdminServices })));
const AdminComments = React.lazy(() => import('./pages/admin/AdminComments').then(module => ({ default: module.AdminComments })));


const AdminProfile = React.lazy(() => import('./pages/admin/AdminProfile').then(module => ({ default: module.AdminProfile })));
const AdminPostForm = React.lazy(() => import('./pages/admin/AdminPostForm').then(module => ({ default: module.AdminPostForm })));
const AdminPortfolioForm = React.lazy(() => import('./pages/admin/AdminPortfolioForm').then(module => ({ default: module.AdminPortfolioForm })));
const AdminServiceForm = React.lazy(() => import('./pages/admin/AdminServiceForm').then(module => ({ default: module.AdminServiceForm })));
const AdminAuditLogs = React.lazy(() => import('./pages/admin/AdminAuditLogs').then(module => ({ default: module.default })));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings').then(module => ({ default: module.default })));

// Component to handle scroll to top functionality
const ScrollToTopHandler: React.FC = () => {
  useScrollToTop();
  return null;
};

// Loading fallback component for better UX
const PageLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner />
  </div>
);

// Admin loading fallback with admin-style layout
const AdminLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-[rgb(var(--color-background))]">
    <div className="text-center">
      <LoadingSpinner />
      <p className="mt-4 text-[rgb(var(--color-muted-foreground))] text-sm">Loading admin panel...</p>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <SiteSettingsProvider>
          <Router>
          <ScrollToTopHandler />
          <Routes>
            {/* Public Routes */}
            <Route path="/*" element={
              <div className="min-h-screen w-full bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
                <Header />
                <main>
                  <Suspense fallback={<PageLoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/portfolio" element={
                        <FeatureRoute feature="portfolio_enabled">
                          <Portfolio />
                        </FeatureRoute>
                      } />
                      <Route path="/portfolio/:slug" element={
                        <FeatureRoute feature="portfolio_enabled">
                          <PortfolioDetail />
                        </FeatureRoute>
                      } />
                      <Route path="/services" element={
                        <FeatureRoute feature="services_enabled">
                          <Services />
                        </FeatureRoute>
                      } />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/blog" element={
                        <FeatureRoute feature="blog_enabled">
                          <BlogPosts />
                        </FeatureRoute>
                      } />
                      <Route path="/blog/:slug" element={
                        <FeatureRoute feature="blog_enabled">
                          <BlogPost />
                        </FeatureRoute>
                      } />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            } />
            
            {/* Admin Login Route (No Layout) */}
            <Route path="/admin/login" element={
              <Suspense fallback={<AdminLoadingFallback />}>
                <AdminLogin />
              </Suspense>
            } />
            
            {/* Protected Admin Routes */}
            <Route path="/admin/*" element={
              <Suspense fallback={<AdminLoadingFallback />}>
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              </Suspense>
            }>
              <Route index element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminDashboard />
                </Suspense>
              } />
              <Route path="posts" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminPosts />
                </Suspense>
              } />
              <Route path="posts/new" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminPostForm />
                </Suspense>
              } />
              <Route path="posts/:id/edit" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminPostForm />
                </Suspense>
              } />
              <Route path="portfolio" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminPortfolio />
                </Suspense>
              } />
              <Route path="portfolio/new" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminPortfolioForm />
                </Suspense>
              } />
              <Route path="portfolio/:id/edit" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminPortfolioForm />
                </Suspense>
              } />
              <Route path="services" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminServices />
                </Suspense>
              } />
              <Route path="services/new" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminServiceForm />
                </Suspense>
              } />
              <Route path="services/:id/edit" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminServiceForm />
                </Suspense>
              } />
              <Route path="comments" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminComments />
                </Suspense>
              } />


              <Route path="audit-logs" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminAuditLogs />
                </Suspense>
              } />
              <Route path="settings" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminSettings />
                </Suspense>
              } />
              <Route path="profile" element={
                <Suspense fallback={<PageLoadingFallback />}>
                  <AdminProfile />
                </Suspense>
              } />
            </Route>
          </Routes>
        </Router>
        </SiteSettingsProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
