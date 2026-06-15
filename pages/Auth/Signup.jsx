import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../../slices/authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, Building2, Users } from 'lucide-react';
import { getPostAuthPath, USER_ROLES } from '../../utils/userRole';

const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, profileCompleted, loading, error } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
      role: USER_ROLES.ROOMMATE,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    // Handle redirect based on auth state and profile completion
    useEffect(() => {
        if (isAuthenticated) {
        navigate(getPostAuthPath({ user: { housingRole: formData.role }, profileCompleted }));
        }
    }, [formData.role, isAuthenticated, navigate, profileCompleted]);

    // Sync Redux error with local state
    useEffect(() => {
        if (error) {
            if (error.toLowerCase().includes('already taken')) {
                setSubmitError('هذا الإيميل مستخدم من قبل! هل تريد تسجيل دخول؟');
            } else {
                setSubmitError(error);
            }
        }
    }, [error]);
    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case 'name':
                if (value.trim().length > 0 && value.trim().length < 4)
                    error = "Name must be at least 4 characters";
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value.length > 0 && !emailRegex.test(value))
                    error = "Invalid email format";
                break;
            case 'phone':
                const phoneRegex = /^01[0125][0-9]{8}$/;
                if (value.length > 0 && !phoneRegex.test(value))
                    error = "Enter 10 digits starting with 1, 0, 2, or 5";
                break;
            case 'password':
                if (value.length > 0 && value.length < 8)
                    error = "Password must be at least 8 characters";
                break;
            case 'confirmPassword':
                if (value.length > 0 && value !== formData.password)
                    error = "Passwords do not match";
                break;
            default:
                break;
        }
        setErrors((prev) => ({ ...prev, [name]: error }));
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hasErrors = Object.values(errors).some(err => err !== "");
        const hasEmptyFields = Object.values(formData).some(val => val === "");
        if (!hasErrors && !hasEmptyFields) {
            setSubmitError('');
            dispatch(clearError());
            
            const phone = formData.phone.startsWith('+20') 
                ? formData.phone 
                : `+20${formData.phone}`;
            
            dispatch(registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
              phone: phone,
              role: formData.role,
            }));
        }
        else {
            alert("Please fix the errors before continuing.");
        }
    };
    return (<div className="min-h-[80vh] flex flex-col justify-center py-12 bg-gray-50">
      <div className="container-sm mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2"/>
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">Create your Sakny account</h1>
            <p className="text-gray-600">Join the community and find your next roommate.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input label="Full name" name="name" type="text" icon={<User size={18} className="text-gray-400"/>} placeholder="Ahmed Mohamed" value={formData.name} onChange={handleChange} error={errors.name} required/>

            {/* Mobile Number Section */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-black">Mobile number</label>
              <div className="flex gap-2">
                <div className="bg-gray-100 border border-gray-200 px-4 flex items-center justify-center rounded-xl font-bold text-gray-400">
                  +20
                </div>
                <div className="flex-1">
                  <Input name="phone" type="tel" placeholder="10 1234 5678" value={formData.phone} onChange={handleChange} error={errors.phone} noLabel required/>
                </div>
              </div>
            </div>

            <Input label="Email" name="email" type="email" icon={<Mail size={18} className="text-gray-400"/>} placeholder="you@example.com" value={formData.email} onChange={handleChange} error={errors.email} required/>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-black">I am</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`rounded-xl border p-4 text-left transition-all ${formData.role === USER_ROLES.ROOMMATE ? 'border-black bg-black text-white shadow-lg' : 'border-gray-200 bg-white text-black hover:border-gray-400 hover:shadow-md'}`}
                  onClick={() => setFormData((current) => ({ ...current, role: USER_ROLES.ROOMMATE }))}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`rounded-xl p-2 ${formData.role === USER_ROLES.ROOMMATE ? 'bg-white/15' : 'bg-gray-100'}`}>
                      <Users size={18} />
                    </div>
                    <strong>Looking for roommate</strong>
                  </div>
                  <p className={`text-sm ${formData.role === USER_ROLES.ROOMMATE ? 'text-white/75' : 'text-gray-600'}`}>
                    Create a personal profile, browse compatible people, and find your next shared home.
                  </p>
                </button>

                <button
                  type="button"
                  className={`rounded-xl border p-4 text-left transition-all ${formData.role === USER_ROLES.LANDLORD ? 'border-black bg-black text-white shadow-lg' : 'border-gray-200 bg-white text-black hover:border-gray-400 hover:shadow-md'}`}
                  onClick={() => setFormData((current) => ({ ...current, role: USER_ROLES.LANDLORD }))}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`rounded-xl p-2 ${formData.role === USER_ROLES.LANDLORD ? 'bg-white/15' : 'bg-gray-100'}`}>
                      <Building2 size={18} />
                    </div>
                    <strong>Offering a place</strong>
                  </div>
                  <p className={`text-sm ${formData.role === USER_ROLES.LANDLORD ? 'text-white/75' : 'text-gray-600'}`}>
                    Manage listings, respond to interested renters, and publish premium property pages.
                  </p>
                </button>
              </div>
            </div>

            {/* Password with Eye Toggle */}
            <div className="relative">
              <Input label="Password" name="password" type={showPassword ? "text" : "password"} icon={<Lock size={18} className="text-gray-400"/>} placeholder="••••••••" value={formData.password} onChange={handleChange} error={errors.password} required/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-gray-400">
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>

            <div className="relative">
              <Input label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} icon={<Lock size={18} className="text-gray-400"/>} placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required/>
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-[38px] text-gray-400">
                {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>

            {/* Submit Error Display */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {submitError}
              </div>
            )}

            <Button type="submit" fullWidth variant="primary" size="lg" disabled={loading}>
              {loading ? 'Creating account...' : 'Continue'}
            </Button>
          </form>

          <div className="mt-6 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              Already have an account? <Link to="/login" className="font-semibold text-black hover:underline">Back to login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>);
};
export default Signup;
