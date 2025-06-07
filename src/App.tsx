import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { BlogPosts } from './pages/BlogPosts';
import { BlogPost } from './pages/BlogPost';
import { useScrollToTop } from './hooks/useScrollToTop';

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
      </Router>
    </ThemeProvider>
  );
}

export default App;
