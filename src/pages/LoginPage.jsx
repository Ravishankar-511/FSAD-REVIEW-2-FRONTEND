// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import API from '../api/axiosConfig';
import { DEMO_CREDENTIALS, initializeDemoUsers } from '../config/demoCredentials';

const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
};

export default function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setRole } = useApp();
    
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showDemoPanel, setShowDemoPanel] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        initializeDemoUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({});
    };

    const runValidation = () => {
        let currentErrors = {};
        if (!validateEmail(formData.email)) {
            currentErrors.email = 'Invalid email format.';
        }
        if (formData.password.length < 6) {
            currentErrors.password = 'Password must be at least 6 characters.';
        }
        setErrors(currentErrors);
        return Object.keys(currentErrors).length === 0;
    };

    const handleQuickLogin = (credential) => {
        setFormData({
            email: credential.email,
            password: credential.password
        });
        // Create a user-like object for demo credentials
        const demoUser = {
            name: credential.name,
            email: credential.email,
            password: credential.password,
            role: credential.role,
            professionalId: credential.role === 'professional' ? 1 : undefined
        };
        performLogin(credential.email, credential.password, credential.role, demoUser);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!runValidation()) return;
        
        setIsLoading(true);
        setErrors({});

        // Try to identify role based on email or try all roles if unknown
        // For this app, let's try to match with demo roles first to know which API to call, 
        // or just try common patterns.
        
        const loginData = {
            email: formData.email,
            password: formData.password
        };

        try {
            let response;
            let role = 'user'; // Default
            let payload = {};

            // Determine which API to call based on the user's intent or stored role
            // In a real app, you might have one login endpoint, but here we have 4.
            // We'll try to find if it's a demo user first to determine the role.
            const demoUser = Object.values(DEMO_CREDENTIALS).find(d => d.email === formData.email);
            const userRole = demoUser ? demoUser.role : (searchParams.get('role') || 'user');

            if (userRole === 'admin') {
                response = await API.post('/adminapi/login', { adminEmail: loginData.email, adminPassword: loginData.password });
                role = 'admin';
            } else if (userRole === 'professional') {
                response = await API.post('/professionalapi/login', { professionalEmail: loginData.email, professionalPassword: loginData.password });
                role = 'professional';
            } else if (userRole === 'support') {
                response = await API.post('/supportapi/login', { supportEmail: loginData.email, supportPassword: loginData.password });
                role = 'support';
            } else {
                response = await API.post('/userapi/login', { userEmail: loginData.email, userPassword: loginData.password });
                role = 'user';
            }

            if (response.data.message === "Login Successful") {
                performLogin(formData.email, formData.password, role, response.data);
            } else {
                setErrors({ form: response.data.message || 'Invalid credentials' });
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Login error:', error);
            
            // Fallback to local storage / demo logic if backend fails or user not found in backend
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const localUser = users.find(u => u.email === formData.email && u.password === formData.password);
            const demoUser = Object.values(DEMO_CREDENTIALS).find(d => d.email === formData.email && d.password === formData.password);

            if (localUser || demoUser) {
                const user = localUser || demoUser;
                performLogin(user.email, user.password, user.role || 'user', user);
            } else {
                const errorMsg = error.response?.data?.message || 'Invalid email or password. Ensure backend is running.';
                setErrors({ form: errorMsg });
                setIsLoading(false);
            }
        }
    };

    const performLogin = (email, password, role, user = null) => {
        setIsLoading(true);
        const currentUserData = {
            name: user?.userName || user?.professionalName || user?.adminName || user?.supportName || user?.name || email.split('@')[0].toUpperCase(),
            isLoggedIn: true,
            email: email,
            role: role,
            fullName: user?.userName || user?.professionalName || user?.name
        };

        // Assign IDs from backend payload if available
        if (user?.userId) currentUserData.userId = user.userId;
        if (user?.professionalId) currentUserData.professionalId = user.professionalId;
        if (user?.adminId) currentUserData.adminId = user.adminId;
        if (user?.supportId) currentUserData.supportId = user.supportId;

        // Fallback for professionalId if not provided by backend but role is professional
        if (role === 'professional' && !currentUserData.professionalId) {
            if (email === 'pro@demo.com') {
                currentUserData.professionalId = 1;
            } else {
                const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                currentUserData.professionalId = (hash % 10) + 1;
            }
        }
        
        localStorage.setItem('currentUser', JSON.stringify(currentUserData));
        setRole(role);
        setSuccessMessage(`✅ Welcome! Redirecting...`);
        
        setTimeout(() => {
            const redirectUrl = searchParams.get('redirect');
            if (redirectUrl) {
                navigate(redirectUrl);
            } else {
                const routes = {
                    admin: '/admin',
                    professional: '/professional',
                    user: '/user',
                    support: '/support'
                };
                navigate(routes[role] || '/user');
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left: Login Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-shadow duration-300">
                        <div className="mb-8">
                            <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mb-6 shadow-lg">W</div>
                            <h1 className="text-4xl font-bold text-slate-800">WorkSphere</h1>
                            <p className="text-slate-600 mt-2 text-lg">Sign in to your account</p>
                        </div>

                        {successMessage && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium shadow-sm">
                                {successMessage}
                            </div>
                        )}

                        {errors.form && (
                            <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                                {errors.form}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                />
                                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                />
                                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || Object.keys(errors).length > 0}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center border-t border-gray-200 pt-6">
                            <p className="text-sm text-gray-600 mb-3">👀 New to WorkSphere?</p>
                            <button
                                onClick={() => navigate('/register')}
                                className="text-sm font-semibold text-green-600 hover:text-green-700"
                            >
                                Create an account →
                            </button>
                        </div>
                    </div>

                    {/* Right: Demo Credentials Panel */}
                    <div className="lg:pt-8">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Demo Accounts</h2>
                                <button
                                    onClick={() => setShowDemoPanel(!showDemoPanel)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showDemoPanel ? '−' : '+'}
                                </button>
                            </div>

                            {showDemoPanel && (
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-600 mb-4">Click any to auto-fill and sign in:</p>

                                    {Object.entries(DEMO_CREDENTIALS).map(([key, cred]) => (
                                        <button
                                            key={key}
                                            onClick={() => handleQuickLogin(cred)}
                                            className="w-full p-4 border-2 border-gray-100 rounded-2xl hover:border-green-300 hover:bg-green-50 transition-all text-left group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-2xl">
                                                    {key === 'admin' && '🛡️'}
                                                    {key === 'professional' && '🔧'}
                                                    {key === 'user' && '👤'}
                                                    {key === 'support' && '🎧'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 capitalize">{key} Dashboard</p>
                                                    <p className="text-xs text-gray-500 truncate">{cred.email}</p>
                                                </div>
                                                <div className="hidden group-hover:block">
                                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded group-hover:bg-green-100 transition-colors">
                                                {cred.email} / {cred.password}
                                            </div>
                                        </button>
                                    ))}

                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            <strong>💡 Tip:</strong> Each demo account gives you access to a different dashboard with unique features. Try them all to explore the platform!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
