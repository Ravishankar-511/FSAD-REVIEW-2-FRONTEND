// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import API from '../api/axiosConfig';
import { DEMO_CREDENTIALS } from '../config/demoCredentials';

const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
};

export default function RegisterPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setRole } = useApp();
    
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', contact: '', address: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({});
    };

    const runValidation = () => {
        let currentErrors = {};
        
        if (formData.name.length < 3) {
            currentErrors.name = 'Full Name must be at least 3 characters.';
        }
        if (!validateEmail(formData.email)) {
            currentErrors.email = 'Invalid email format.';
        }
        if (formData.password.length < 6) {
            currentErrors.password = 'Password must be at least 6 characters.';
        }
        if (formData.password !== formData.confirmPassword) {
            currentErrors.confirmPassword = 'Passwords do not match.';
        }
        if (!formData.contact || formData.contact.length < 10) {
            currentErrors.contact = 'Valid Contact Number is required.';
        }
        if (!formData.address) {
            currentErrors.address = 'Address is required.';
        }

        setErrors(currentErrors);
        return Object.keys(currentErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!runValidation()) return;

        setIsLoading(true);
        
        try {
            // Prepare user data for backend
            const userData = {
                userName: formData.name,
                userEmail: formData.email,
                userPassword: formData.password,
                userContact: formData.contact,
                userAddress: formData.address
            };

            // Call real backend API
            const response = await API.post('/userapi/registration', userData);
            
            if (response.data.message.includes("Successful")) {
                const backendUser = response.data;
                const newUserId = backendUser.userId || (Math.floor(Math.random() * 10000) + 1000);

                // Still keep local storage logic for compatibility
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const newUser = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'user',
                    userId: newUserId
                };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                localStorage.setItem('currentUser', JSON.stringify({
                    name: formData.name,
                    isLoggedIn: true,
                    email: formData.email,
                    role: 'user',
                    userId: newUserId,
                    fullName: formData.name
                }));

                setSuccessMessage(`✅ Account created! Welcome ${formData.name}! Redirecting...`);
                setRole('user');

                setTimeout(() => {
                    const redirectUrl = searchParams.get('redirect');
                    if (redirectUrl) {
                        navigate(redirectUrl);
                    } else {
                        navigate('/user');
                    }
                }, 1000);
            } else {
                setErrors({ form: response.data.message || 'Failed to register.' });
            }
        } catch (error) {
            console.error('Error registering user:', error);
            const errorMsg = error.response?.data?.message || 'Failed to connect to server. Ensure backend is running on port 8082.';
            setErrors({ form: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto">W</div>
                        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-gray-500 mt-1">Join WorkSphere today</p>
                    </div>

                    {successMessage && (
                        <div className="mb-5 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
                            {successMessage}
                        </div>
                    )}

                    {errors.form && (
                        <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                            {errors.form}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                            />
                            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
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

                        {/* Contact */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Number</label>
                            <input
                                type="tel"
                                name="contact"
                                placeholder="Your 10-digit number"
                                value={formData.contact}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 ${errors.contact ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                            />
                            {errors.contact && <p className="text-red-600 text-xs mt-1">{errors.contact}</p>}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Your Address"
                                value={formData.address}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 ${errors.address ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                            />
                            {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                        </div>

                        {/* Password */}
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
                            <p className="text-gray-500 text-xs mt-1">Minimum 6 characters</p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                            />
                            {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || Object.keys(errors).length > 0}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center border-t border-gray-200 pt-6">
                        <p className="text-sm text-gray-600 mb-3">Already have an account?</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm font-semibold text-green-600 hover:text-green-700"
                        >
                            Sign in instead →
                        </button>
                    </div>

                    {/* Demo Credentials Info */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-600 mb-3 uppercase">Quick Demo Access</p>
                        <div className="space-y-2">
                            {Object.entries(DEMO_CREDENTIALS).map(([key, cred]) => (
                                <div key={key} className="text-xs bg-gray-50 p-2 rounded">
                                    <p className="font-semibold text-gray-700">{cred.role.toUpperCase()}: {cred.email}</p>
                                    <p className="text-gray-600">Pass: {cred.password}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="text-center mt-8">
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
