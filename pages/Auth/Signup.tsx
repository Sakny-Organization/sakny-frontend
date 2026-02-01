import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { mockSignup } from '../../slices/authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Mail, Lock, User, Phone, Camera } from 'lucide-react';

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [avatar, setAvatar] = useState<string>('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });

    // Simple password validation
    if (newPassword.length > 0 && newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Save user data to localStorage
    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      avatar: avatar || `https://i.pravatar.cc/150?u=${formData.email}`,
      password: formData.password, // في real app، هتتشفر
    };

    localStorage.setItem('sakny_user', JSON.stringify(userData));

    // Dispatch signup action
    dispatch(mockSignup({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      avatar: userData.avatar,
    }));

    // Navigate to profile setup
    navigate('/profile-setup');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 bg-gray-50">
      <div className="container-sm mx-auto">
        {/* Progress Indicator */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 font-medium">Step 1 of 8</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 max-w-md mx-auto">
            <div className="bg-black h-1.5 rounded-full" style={{ width: '12.5%' }}></div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">
              Create your Sakny account
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Use your Egyptian mobile number to make it easier to connect with roommates
            </p>
          </div>

          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={40} className="text-gray-400" />
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors border-2 border-white"
              >
                <Camera size={16} className="text-white" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Upload your profile photo (optional)</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Full name"
              type="text"
              icon={<User size={18} className="text-gray-400" />}
              placeholder="Ahmed Mohamed"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="Mobile number"
              type="tel"
              icon={<Phone size={18} className="text-gray-400" />}
              placeholder="1XX XXX XXXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              helperText="We'll use this to verify your account"
            />

            <Input
              label="Email"
              type="email"
              icon={<Mail size={18} className="text-gray-400" />}
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div>
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={handlePasswordChange}
                icon={<Lock size={18} className="text-gray-400" />}
                placeholder="••••••••"
                required
                error={passwordError}
              />
            </div>

            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              icon={<Lock size={18} className="text-gray-400" />}
              placeholder="••••••••"
              required
            />

            <div className="pt-2">
              <Button type="submit" fullWidth variant="primary" size="lg">
                Continue
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-black hover:underline">
                Back to login
              </Link>
            </p>
          </div>

          {/* Language Selector */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-2 text-sm text-gray-600">
            <button className="hover:text-black transition-colors font-medium">EN</button>
            <span>/</span>
            <button className="hover:text-black transition-colors">AR</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
