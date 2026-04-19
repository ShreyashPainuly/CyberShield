import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ScanPage from './pages/ScanPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px',
            border: '3px solid #e5e7eb', borderTopColor: '#059669',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite'
          }} />
          <span style={{ color: '#6b7280', fontSize: '0.8125rem' }}>Loading...</span>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/scan" replace /> : children;
};

const AppContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  return (
    <>
      {!isDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scan" element={<ProtectedRoute><ScanPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#111827',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '0.8125rem',
              fontWeight: 500,
              padding: '10px 14px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
            },
            success: { iconTheme: { primary: '#059669', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' }, duration: 4000 }
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
