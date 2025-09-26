import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { login as apiLogin } from '../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await apiLogin(formData.email, formData.password);
            if (response.data) {
                // First update the auth context
                login(response.data);
                
                // Show success message
                toast.success('Login successful!');
                
                // Use a slight delay to ensure state is updated before navigation
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 100);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="p-6 text-center">
                        <div className="mx-auto h-16 w-16 rounded-full bg-[#1A237E] flex items-center justify-center mb-4">
                            <LogIn className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="text-gray-600 mt-2">Sign in to access your admin panel</p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="space-y-1">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    placeholder="example@jadeglobal.com"
                                    className={`w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A237E] bg-[#F6F8FE]`}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A237E] bg-[#F6F8FE]`}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1A237E] hover:bg-[#151B60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A237E] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="h-4 w-4 mr-2" />
                                        Sign in
                                    </>
                                )}
                            </button>
                        </div>


                    </div>
                </div>

                <div className="text-center mt-4 text-sm text-gray-600">
                    Need help? Contact <button onClick={() => window.location.href = 'mailto:support@example.com'} className="text-[#1A237E] hover:text-[#151B60] hover:underline">support@akisok.com</button>
                </div>
            </div>
        </div>
    );
}

export default Login;