import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfessionalRegister from './pages/ProfessionalRegister';
import AdminDashboard from './pages/AdminDashboard';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import UserDashboard from './pages/UserDashboard';
import SupportDashboard from './pages/SupportDashboard';
import ProfessionalDetail from './pages/ProfessionalDetail';

function ProtectedRoute({ children, allowedRole }) {
  const { role } = useApp();
  
  // If no role, redirect to login
  if (!role) return <Navigate to="/login" replace />;
  
  // If role doesn't match, redirect to appropriate dashboard
  if (role !== allowedRole) {
    const routes = { admin: '/admin', professional: '/professional', user: '/user', support: '/support' };
    return <Navigate to={routes[role] || '/'} replace />;
  }
  
  return children;
}

export default function App() {
  const { role } = useApp();
  const [isInitialized, setIsInitialized] = useState(false);

  // Wait for the role to be initialized from localStorage
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Show nothing while initializing to avoid flashing login page
  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen app-bg text-slate-800">
      <Routes>
      <Route path="/" element={role ? <Navigate to={`/${role}`} replace /> : <LandingPage />} />
      <Route path="/login" element={role ? <Navigate to={`/${role}`} replace /> : <LoginPage />} />
      <Route path="/register" element={role ? <Navigate to={`/${role}`} replace /> : <RegisterPage />} />
      <Route path="/join-professional" element={role ? <Navigate to={`/${role}`} replace /> : <ProfessionalRegister />} />

      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Professional Routes */}
      <Route path="/professional/*" element={
        <ProtectedRoute allowedRole="professional">
          <ProfessionalDashboard />
        </ProtectedRoute>
      } />

      {/* User Routes */}
      <Route path="/user" element={
        <ProtectedRoute allowedRole="user">
          <UserDashboard />
        </ProtectedRoute>
      } />
      <Route path="/user/find" element={
        <ProtectedRoute allowedRole="user">
          <UserDashboard />
        </ProtectedRoute>
      } />
      <Route path="/user/requests" element={
        <ProtectedRoute allowedRole="user">
          <UserDashboard />
        </ProtectedRoute>
      } />
      <Route path="/user/professional/:id" element={
        <ProtectedRoute allowedRole="user">
          <ProfessionalDetail />
        </ProtectedRoute>
      } />
      <Route path="/user/support" element={
        <ProtectedRoute allowedRole="user">
          <UserDashboard />
        </ProtectedRoute>
      } />

      {/* Support Routes */}
      <Route path="/support/*" element={
        <ProtectedRoute allowedRole="support">
          <SupportDashboard />
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </div>
  );
}
