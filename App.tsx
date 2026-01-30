
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { TeamSection } from './components/TeamSection';
import { ProjectsSection } from './components/ProjectsSection';
import { OpportunitiesSection } from './components/OpportunitiesSection';
import { ContactsSection } from './components/ContactsSection';
import { SupportSection } from './components/SupportSection';
import { AboutSection } from './components/AboutSection';
import { DocumentsSection } from './components/DocumentsSection';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Route Component using AuthContext
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Layout for Public Pages (With Navbar and Footer)
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-white dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

const App = () => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Admin Routes (No Navbar/Footer) */}
              <Route path="/login" element={<AdminLogin />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Public Routes */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><AboutSection /></PublicLayout>} />
              <Route path="/team" element={<PublicLayout><TeamSection /></PublicLayout>} />
              <Route path="/projects" element={<PublicLayout><ProjectsSection /></PublicLayout>} />
              <Route path="/opportunities" element={<PublicLayout><OpportunitiesSection /></PublicLayout>} />
              <Route path="/documents" element={<PublicLayout><DocumentsSection /></PublicLayout>} />
              <Route path="/contacts" element={<PublicLayout><ContactsSection /></PublicLayout>} />
              <Route path="/support" element={<PublicLayout><SupportSection /></PublicLayout>} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
