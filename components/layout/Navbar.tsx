import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../slices/authSlice';
import Button from '../common/Button';
import { Menu, X, Bell, User as UserIcon, LogOut, Home, Search as SearchIcon, MessageCircle, Bookmark } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const publicNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'How it works', path: '/#how-it-works' },
    { name: 'For Students', path: '/#students' },
    { name: 'For Professionals', path: '/#professionals' },
  ];

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={18} /> },
    { name: 'Find Roommates', path: '/search', icon: <SearchIcon size={18} /> },
    { name: 'Messages', path: '/messages', icon: <MessageCircle size={18} /> },
    { name: 'Saved', path: '/saved', icon: <Bookmark size={18} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="font-bold text-2xl text-black tracking-tight">Sakny</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <div className="flex space-x-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.path)
                        ? 'text-black bg-gray-100'
                        : 'text-gray-600 hover:text-black hover:bg-gray-50'
                        }`}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                <div className="flex items-center gap-4">
                  <Link to="/notifications" className="text-gray-500 hover:text-gray-700 relative">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-white"></span>
                  </Link>

                  <div className="flex items-center gap-3 pl-2">
                    <Link to="/profile" className="flex items-center gap-2">
                      <img
                        src={user?.avatar}
                        alt="Profile"
                        className="h-8 w-8 rounded-full border border-gray-200 object-cover"
                      />
                      <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex space-x-6">
                  {publicNavLinks.map((link) => (
                    <a
                      key={link.path}
                      href={link.path}
                      className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary">Sign Up</Button>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center gap-3 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 text-left"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2 p-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" fullWidth>Log In</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" fullWidth>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
