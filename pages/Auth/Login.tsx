import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { mockLogin, loginSuccess } from '../../slices/authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [errors, setErrors] = useState<any>({}); 
  const [submitError, setSubmitError] = useState(''); 

  
  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^01[0125][0-9]{8}$/;
      if (value.length > 0 && !emailRegex.test(value) && !phoneRegex.test(value)) {
        error = "Enter a valid email or Egyptian phone number";
      }
    }
    if (name === 'password') {
      if (value.length > 0 && value.length < 8) {
        error = "Password must be at least 8 characters";
      }
    }
    setErrors((prev: any) => ({ ...prev, [name]: error }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    validateField('email', val);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    validateField('password', val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

   
    if (errors.email || errors.password || !email || !password) {
      setSubmitError('Please fix errors or fill all fields');
      return;
    }

    const savedUserData = localStorage.getItem('sakny_user');

    if (savedUserData) {
      const userData = JSON.parse(savedUserData);

      if (userData.email === email && userData.password === password) {
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
        setSubmitError('Incorrect password');
        return;
      }
    }

    dispatch(mockLogin());
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Panel - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black flex-col justify-between p-12 lg:p-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Modern Interior"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity w-fit">
            <div className="bg-white text-black p-1.5 rounded-lg">
              <span className="font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight">Sakny</span>
          </Link>

          <div className="max-w-xl">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Elevated Living Starts With The Right Match.
            </h1>
            
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span>© 2026 Sakny Inc.</span>
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

    
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 md:px-12 xl:px-24 py-12 bg-white relative">
    
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors">
            <ArrowLeft size={16} className="mr-2" />
Back to Home          </Link>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-3">Welcome back to Sakny</h2>
            <p className="text-gray-500">Login to continue finding your ideal Egyptian roommate based on your preferences</p>
          </div>


          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-900">Email or Egyptian phone</label>
              <Input
                name="email"
                type="text"
                value={email}
                onChange={handleEmailChange}
                error={errors.email}
                required
                placeholder="hello@gmail.com or 01000000000"
                className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-12"
                noLabel 
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-900">Password</label>
                <a href="#" className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  error={errors.password}
                  required
                  placeholder="••••••••"
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-12"
                  noLabel
                />
                <button
                  type="button"
                  className="absolute right-4 top-[14px] text-gray-400 hover:text-black transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {submitError}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="stay-logged-in"
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
              />
              <label htmlFor="stay-logged-in" className="text-sm text-gray-600 cursor-pointer select-none">
                Stay logged in
              </label>
            </div>

            <Button type="submit" fullWidth variant="primary" size="lg" className="h-12 bg-black hover:bg-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
              Login to Sakny
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-black hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;