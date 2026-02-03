import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { RootState } from './store';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import ProfileSetup from './pages/ProfileSetup';
import MatchProfile from './pages/MatchProfile';
import MyProfile from './pages/MyProfile';
import SavedProfiles from './pages/SavedProfiles';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';

// Protected Route Wrapper
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Layout Wrapper
const Layout: React.FC = () => {
  const location = useLocation();
  const isFullWidthPage = location.pathname === '/' || location.pathname === '/profile-setup';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className={`flex-grow ${!isFullWidthPage ? 'app-container py-8' : ''}`}>
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/match/:id" element={<MatchProfile />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/saved" element={<SavedProfiles />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;

