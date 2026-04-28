// src/pages/ProfessionalRegister.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import API from '../api/axiosConfig';

const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
};

export default function ProfessionalRegister() {
    const navigate = useNavigate();
    const { setRole, professionals, setProfessionals, syncUsers, serviceCategories } = useApp();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        contact: '',
        profession: 'Plumbing',
        rate: '',
        bio: '',
        location: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors(prev => ({ ...prev, [e.target.name]: null }));
    };

    const runValidation = () => {
        let currentErrors = {};
        
        if (formData.name.length < 3) {
            currentErrors.name = "Full Name must be at least 3 characters.";
        }
        
        if (!validateEmail(formData.email)) {
            currentErrors.email = "Invalid email format.";
        }
        
        if (formData.password.length < 6) {
            currentErrors.password = "Password must be at least 6 characters.";
        }
        
        if (formData.password !== formData.confirmPassword) {
            currentErrors.confirmPassword = "Passwords do not match.";
        }
        
        if (!formData.profession) {
            currentErrors.profession = "Please select a profession/category.";
        }
        
        const rate = parseFloat(formData.rate);
        if (formData.rate === '') {
            currentErrors.rate = "Hourly Rate is required.";
        } else if (isNaN(rate) || rate <= 0) {
            currentErrors.rate = "Rate must be a positive number.";
        }
        
        if (formData.bio.length < 20) {
            currentErrors.bio = `Bio must be at least 20 characters. (Current: ${formData.bio.length})`;
        }
        
        if (!formData.location || formData.location.length < 3) {
            currentErrors.location = "Location is required.";
        }

        if (!formData.contact || formData.contact.length < 10) {
            currentErrors.contact = "Valid Contact Number is required.";
        }
        
        setErrors(currentErrors);
        return Object.keys(currentErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!runValidation()) return;
        
        setIsLoading(true);
        
        try {
            // Prepare professional data for backend
            const professionalData = {
                professionalName: formData.name,
                professionalEmail: formData.email,
                professionalPassword: formData.password,
                professionalContact: formData.contact,
                professionalCategory: formData.profession,
                professionalExperience: `${formData.rate} per hr - ${formData.bio}`,
                professionalLocation: formData.location
            };

            // Call real backend API
            const response = await API.post('/professionalapi/registration', professionalData);
            
            if (response.data.message.includes("Successful")) {
                const backendProfessional = response.data; // Backend might return the saved entity or a success message
                
                // Still keep local registration for other components that might depend on it
                // and for state synchronization
                const maxId = Math.max(...professionals.map(p => p.id), 0);
                const newProfessionalId = backendProfessional.professionalId || (maxId + 1);

                const newProfessional = {
                    id: newProfessionalId,
                    name: formData.name,
                    category: formData.profession,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
                    rating: 5.0,
                    reviews: 0,
                    location: formData.location,
                    experience: 'New Professional',
                    price: `₹${formData.rate}/hr`,
                    bio: formData.bio,
                    services: [formData.profession],
                    available: true,
                    verified: false,
                    completedJobs: 0,
                    email: formData.email
                };

                // Add to professionals state
                setProfessionals([...professionals, newProfessional]);

                // Store in localStorage for persistence and auth logic
                const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
                const newUser = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'professional',
                    professionalId: newProfessionalId,
                    userId: Math.floor(Math.random() * 10000) + 1000
                };
                existingUsers.push(newUser);
                localStorage.setItem('users', JSON.stringify(existingUsers));

                // Auto-login locally
                localStorage.setItem('currentUser', JSON.stringify({
                    name: formData.name,
                    isLoggedIn: true,
                    email: formData.email,
                    role: 'professional',
                    professionalId: newProfessionalId,
                    userId: newUser.userId,
                    fullName: formData.name
                }));

                setRole('professional');
                setSuccessMessage(`✅ Welcome ${formData.name}! Your professional profile has been created. Redirecting...`);
                syncUsers();

                setTimeout(() => {
                    navigate('/professional');
                }, 1500);
            } else {
                setErrors({ form: response.data.message || 'Failed to register.' });
            }
        } catch (error) {
            console.error('Error registering professional:', error);
            const errorMsg = error.response?.data?.message || 'Failed to connect to server. Ensure backend is running on port 8082.';
            setErrors({ form: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    // Use dynamic categories from AppContext, fallback to default list if empty
    const professions = serviceCategories && serviceCategories.length > 0 
        ? serviceCategories.map(cat => cat.name)
        : ['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning', 
           'AC & Appliance', 'Pest Control', 'Water Purifier', 'Tutor', 
           'Music Teacher', 'Fitness Trainer', 'Photographer', 'Graphic Designer', 
           'Web Developer', 'Content Writer', 'Beautician', 'Accountant', 'Legal Consultant'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <div className="mb-8">
                        <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4">W</div>
                        <h1 className="text-3xl font-bold text-gray-900">Join WorkSphere</h1>
                        <p className="text-gray-500 mt-1">Register as a Professional</p>
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Full Name"
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

                        {/* Password */}
                        <div className="grid md:grid-cols-2 gap-4">
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
                        </div>

                        {/* Profession & Location */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Profession/Category</label>
                                <select
                                    name="profession"
                                    value={formData.profession}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 ${errors.profession ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                >
                                    {professions.map(prof => (
                                        <option key={prof} value={prof}>{prof}</option>
                                    ))}
                                </select>
                                {errors.profession && <p className="text-red-600 text-xs mt-1">{errors.profession}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="City, State"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 ${errors.location ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                />
                                {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location}</p>}
                            </div>
                        </div>

                        {/* Rate */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hourly Rate (₹)</label>
                            <input
                                type="number"
                                name="rate"
                                placeholder="500"
                                value={formData.rate}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 ${errors.rate ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                            />
                            {errors.rate && <p className="text-red-600 text-xs mt-1">{errors.rate}</p>}
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Professional Bio (Min 20 characters)</label>
                            <textarea
                                name="bio"
                                placeholder="Tell us about your experience, skills, and expertise..."
                                value={formData.bio}
                                onChange={handleChange}
                                rows="4"
                                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-500 resize-none ${errors.bio ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                            />
                            {errors.bio && <p className="text-red-600 text-xs mt-1">{errors.bio}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                        >
                            {isLoading ? (
                                <>
                                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Creating Profile...
                                </>
                            ) : (
                                'Create Professional Profile'
                            )}
                        </button>

                        {/* Already Professional */}
                        <p className="text-center text-sm text-gray-600 mt-4">
                            Already a professional?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-green-600 hover:text-green-700 font-semibold"
                            >
                                Sign In
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
