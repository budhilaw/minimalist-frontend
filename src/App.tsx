import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { BlogPosts } from './pages/BlogPosts';
import { BlogPost } from './pages/BlogPost';
import { useScrollToTop } from './hooks/useScrollToTop';

// Admin components
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPosts } from './pages/admin/AdminPosts';
import { AdminPortfolio } from './pages/admin/AdminPortfolio';
import { AdminServices } from './pages/admin/AdminServices';

import { AdminComments } from './pages/admin/AdminComments';
import { AdminProfile } from './pages/admin/AdminProfile';
import { AdminPostForm } from './pages/admin/AdminPostForm';
import { AdminPortfolioForm } from './pages/admin/AdminPortfolioForm';
import { AdminServiceForm } from './pages/admin/AdminServiceForm';

// Component to handle scroll to top functionality
const ScrollToTopHandler: React.FC = () => {
  useScrollToTop();
  return null;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTopHandler />
        <Routes>
          {/* Public Routes */}
          <Route path="/*" element={
            <div className="min-h-screen w-full bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/blog" element={<BlogPosts />} />
                  <Route path="/blog/:id" element={<BlogPost />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
          
          {/* Admin Login Route (No Layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="posts/new" element={<AdminPostForm />} />
            <Route path="posts/:id/edit" element={<AdminPostForm />} />
            <Route path="portfolio" element={<AdminPortfolio />} />
            <Route path="portfolio/new" element={<AdminPortfolioForm />} />
            <Route path="portfolio/:id/edit" element={<AdminPortfolioForm />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="services/new" element={<AdminServiceForm />} />
            <Route path="services/edit/:id" element={<AdminServiceForm />} />
            
                          <Route path="comments" element={<AdminComments />} />
              <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
