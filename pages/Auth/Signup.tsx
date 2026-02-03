import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { mockSignup } from '../../slices/authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Mail, Lock, User, Phone, Camera, ArrowLeft, Eye, EyeOff } from 'lucide-react';

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState<string>('');
  const [errors, setErrors] = useState<any>({});

 
  const validateField = (name: string, value: string) => {
    let error = "";
    
    switch (name) {
      case 'name':
        if (value.trim().length > 0 && value.trim().length < 4) error = "Name must be at least 4 characters";
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.length > 0 && !emailRegex.test(value)) error = "Invalid email format";
        break;
      case 'phone':
        const phoneRegex = /^01[0125][0-9]{8}$/;
        if (value.length > 0 && !phoneRegex.test(value)) error = "Enter 10 digits starting with 1, 0, 2, or 5";
        break;
      case 'password':
        if (value.length > 0 && value.length < 8) error = "Password must be at least 8 characters";
        break;
      case 'confirmPassword':
        if (value.length > 0 && value !== formData.password) error = "Passwords do not match";
        break;
      default:
        break;
    }
    
    setErrors((prev: any) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value); 
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
   
    const hasErrors = Object.values(errors).some(err => err !== "");
    const hasEmptyFields = Object.values(formData).some(val => val === "");

    if (!hasErrors && !hasEmptyFields) {
      const userData = {
        ...formData,
        phone: `+20${formData.phone}`,
        avatar: avatar || `https://i.pravatar.cc/150?u=${formData.email}`,
      };
      localStorage.setItem('sakny_user', JSON.stringify(userData));
      dispatch(mockSignup(userData));
      navigate('/profile-setup');
    } else {
      alert("Please fix the errors before continuing.");
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 bg-gray-50">
      <div className="container-sm mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">Create your Sakny account</h1>
            <p className="text-gray-600">Join the community and find your next roommate.</p>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : <User size={40} className="text-gray-400 mt-5 mx-auto" />}
              </div>
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-full flex items-center justify-center cursor-pointer border-2 border-white">
                <Camera size={16} className="text-white" />
              </label>
              <input id="avatar-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Full name"
              name="name"
              type="text"
              icon={<User size={18} className="text-gray-400" />}
              placeholder="Ahmed Mohamed"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            {/* Mobile Number Section */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-black">Mobile number</label>
              <div className="flex gap-2">
                <div className="bg-gray-100 border border-gray-200 px-4 flex items-center justify-center rounded-xl font-bold text-gray-400">
                  +20
                </div>
                <div className="flex-1">
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="10 1234 5678"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    noLabel
                    required
                  />
                </div>
              </div>
            </div>

            <Input
              label="Email"
              name="email"
              type="email"
              icon={<Mail size={18} className="text-gray-400" />}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            {/* Password with Eye Toggle */}
            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                icon={<Lock size={18} className="text-gray-400" />}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-gray-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                icon={<Lock size={18} className="text-gray-400" />}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-[38px] text-gray-400">
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button type="submit" fullWidth variant="primary" size="lg">Continue</Button>
          </form>

          <div className="mt-6 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              Already have an account? <Link to="/login" className="font-semibold text-black hover:underline">Back to login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;