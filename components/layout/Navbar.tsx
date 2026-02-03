import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../slices/authSlice';
import Button from '../common/Button';
import { Menu, X, Bell, User as UserIcon, LogOut, Home, Search as SearchIcon, MessageCircle, Bookmark } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { saved } = useSelector((state: RootState) => state.roommates);
  const { unreadNotifications, unreadMessages } = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);

    if (path.includes('#')) {
      const [route, hash] = path.split('#');
      if (location.pathname === '/' || route === '') {
        // Already on landing page, just scroll
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 0);
      } else {
        // Need to navigate to landing page first
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      navigate(path);
    }
  };

  const publicNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/#features' },
    { name: 'How it works', path: '/#how-it-works' },
    { name: 'Testimonials', path: '/#testimonials' },
  ];

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
    { name: 'Find Roommates', path: '/search', icon: <SearchIcon size={18} /> },
    { name: 'Messages', path: '/messages', icon: <MessageCircle size={18} /> },
    { name: 'Saved', path: '/saved', icon: <Bookmark size={18} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 py-4 w-full pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
        <div
          className="bg-white/80 backdrop-blur-md border border-gray-200/60 rounded-2xl px-6 py-3 flex items-center justify-between shadow-sm transition-all duration-300 hover:shadow-md supports-[backdrop-filter]:bg-white/60"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="size-9 bg-black text-white rounded-xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105 group-hover:rotate-3 duration-300">
                <span className="text-xl font-bold">∞</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">Sakny</h2>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated ? (
              <>
                {navLinks.map((link) => {
                  const counts: { [key: string]: number } = {
                    '/messages': unreadMessages,
                    '/saved': saved.length,
                  };
                  const count = counts[link.path] || 0;

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 relative px-3 py-1.5 rounded-lg hover:bg-gray-100/50 ${isActive(link.path)
                        ? 'text-black bg-gray-50'
                        : 'text-gray-500 hover:text-black'
                        }`}
                    >
                      {link.icon}
                      {link.name}
                      {count > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                          {count > 9 ? '9+' : count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </>
            ) : (
              <div className="flex items-center gap-6">
                {publicNavLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex gap-4 items-center">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/notifications" className="relative p-2 text-gray-500 hover:text-black transition-colors hover:bg-gray-100 rounded-full">
                  <Bell size={20} />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </Link>

                <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

                <Link to="/profile" className="flex items-center gap-3 pl-1">
                  <div className="relative">
                    <img
                      src={user?.avatar || "https://ui-avatars.com/api/?name=" + (user?.name || "User") + "&background=random"}
                      alt="Profile"
                      className="h-9 w-9 rounded-full border border-gray-200 object-cover shadow-sm transition-transform hover:scale-105"
                    />
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium hidden sm:inline text-gray-700">{user?.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="hidden sm:inline-block">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors">
                    Log In
                  </button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm" className="shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-all">Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-black p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white/90 backdrop-blur-md border border-gray-200/60 rounded-2xl shadow-xl p-2 space-y-1">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 mb-1 hover:bg-gray-50 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <img
                    src={user?.avatar || "https://ui-avatars.com/api/?name=" + (user?.name || "User")}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border border-gray-200"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'User'}</p>
                  </div>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
                <Link
                  to="/notifications"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Bell size={18} />
                  Notifications
                  {unreadNotifications > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all text-left mt-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <div className="p-2 space-y-1">
                {publicNavLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-all"
                  >
                    {link.name}
                  </button>
                ))}
                <div className="pt-2 mt-2 border-t border-gray-100 grid grid-cols-2 gap-2">
                  <Link to="/login" className="w-full">
                    <button className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      Log In
                    </button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <button className="w-full px-4 py-2.5 text-sm font-bold text-white bg-black rounded-xl shadow-lg hover:bg-gray-800 transition-all">
                      Sign Up
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
