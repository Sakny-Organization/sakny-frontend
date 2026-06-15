import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import apiService from './services/api';
import { loginSuccess, loginFailure } from './slices/authSlice';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WelcomeMessage from './components/common/WelcomeMessage';
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
import LandlordDashboard from './pages/landlord/LandlordDashboard';
import AddProperty from './pages/landlord/AddProperty';
import EditProperty from './pages/landlord/EditProperty';

import Properties from './pages/properties/Properties';
import PropertyDetails from './pages/properties/PropertyDetails';
import { hydrateUserRole, isLandlordUser } from './utils/userRole';

const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const LandlordRoute = () => {
  const { user } = useSelector((state) => state.auth);
  return isLandlordUser(user) ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

const CompletedProfileRoute = () => {
  const { user, profileCompleted } = useSelector((state) => state.auth);

  if (isLandlordUser(user) || profileCompleted) {
    return <Outlet />;
  }

  return <Navigate to="/profile-setup" replace />;
};

const DashboardEntry = () => {
  const { user, profileCompleted } = useSelector((state) => state.auth);

  if (isLandlordUser(user)) {
    return <Navigate to="/landlord/dashboard" replace />;
  }

  if (!profileCompleted) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <Dashboard />;
};

const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isLandlordPage = location.pathname.startsWith('/landlord');
  const isProfileSetupPage = location.pathname === '/profile-setup';
  // Landlord pages now use the shared Navbar — only auth pages hide it.
  // isFullWidthPage controls whether we add app-container padding on the <main>.
  // Landlord pages handle their own container inside DashboardLayout.
  const isFullWidthPage = location.pathname === '/' || isProfileSetupPage || isAuthPage || isLandlordPage;
  return (<div className="flex flex-col min-h-screen bg-background">
    <WelcomeMessage />
    {!isAuthPage && <Navbar />}
    <main className={`flex-grow ${!isFullWidthPage ? 'app-container py-6 md:py-8' : ''}`}>
      <AnimatePresence mode="wait">
        <Outlet />
      </AnimatePresence>
    </main>
    {!isAuthPage && !isLandlordPage && !isProfileSetupPage && <Footer />}
  </div>);
};
const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      const fetchUser = async () => {
        try {
          const user = await apiService.getCurrentUser();
          dispatch(loginSuccess(hydrateUserRole(user)));
        } catch (error) {
          console.error('Failed to auto-login:', error);
          localStorage.removeItem('token');
          dispatch(loginFailure());
        }
      };
      fetchUser();
    }
  }, [dispatch, isAuthenticated]);

  return (<HashRouter>
    <Routes>
      <Route element={<Layout />}>

        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardEntry />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />

          <Route element={<CompletedProfileRoute />}>
            <Route path="/search" element={<Search />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/match/:id" element={<MatchProfile />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/saved" element={<SavedProfiles />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          <Route element={<LandlordRoute />}>
            <Route path="/landlord/dashboard" element={<LandlordDashboard />} />

            <Route path="/landlord/properties/new" element={<AddProperty />} />
            <Route path="/landlord/properties/:id/edit" element={<EditProperty />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  </HashRouter>);
};
export default App;
