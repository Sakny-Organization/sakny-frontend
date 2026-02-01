import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { mockLogin, loginSuccess } from '../../slices/authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Mail, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if user exists in localStorage
    const savedUserData = localStorage.getItem('sakny_user');

    if (savedUserData) {
      const userData = JSON.parse(savedUserData);

      // Validate credentials
      if (userData.email === email && userData.password === password) {
        // Login with saved user data
        dispatch(loginSuccess({
          id: 'user-' + Date.now(),
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
          profileCompletion: 75,
        }));
        navigate('/dashboard');
        return;
      } else if (userData.email === email) {
        setError('Incorrect password');
        return;
      }
    }

    // If no saved user or wrong email, use mock login
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    // Mock login for demo
    dispatch(mockLogin());
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 bg-gray-50">
      <div className="container-sm mx-auto">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">
              Welcome back to Sakny
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Login to continue finding your ideal Egyptian roommate based on your preferences
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Email or Egyptian phone"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Mail size={18} className="text-gray-400" />}
              placeholder="you@example.com or +20 1XX XXX XXXX"
            />

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="form-label">Password</label>
                <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Forgot password?
                </a>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<Lock size={18} className="text-gray-400" />}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" fullWidth variant="primary" size="lg">
                Login
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              New to Sakny?{' '}
              <Link to="/signup" className="font-semibold text-black hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Language Selector */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-2 text-sm text-gray-600">
            <button className="hover:text-black transition-colors font-medium">EN</button>
            <span>/</span>
            <button className="hover:text-black transition-colors">AR</button>
          </div>

          {/* Demo Note */}
          <div className="mt-6 text-center">
            <div className="inline-block bg-gray-50 rounded-lg px-4 py-2">
              <p className="text-xs text-gray-500">
                <strong>Demo:</strong> Just click "Login" to access the dashboard with mock data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
