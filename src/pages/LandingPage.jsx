import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { serviceCategories, professionals, reviews } from '../data/mockData';
import StarRating from '../components/StarRating';

const roles = [
    { value: 'admin', label: 'Admin', icon: '🛡️', desc: 'Manage the platform' },
    { value: 'professional', label: 'Professional', icon: '🔧', desc: 'Offer your services' },
    { value: 'user', label: 'User', icon: '👤', desc: 'Find professionals' },
    { value: 'support', label: 'Customer Support', icon: '🎧', desc: 'Handle tickets' },
];

export default function LandingPage() {
    const { role } = useApp();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [city, setCity] = useState('Your City');

    const handleRoleSelect = (roleValue) => {
        const routes = { admin: '/admin', professional: '/professional', user: '/user', support: '/support' };
        navigate(routes[roleValue] || '/');
    };

    const handleCategoryClick = (cat) => {
        if (!role) {
            // Not logged in - redirect to login with return URL
            navigate(`/login?redirect=${encodeURIComponent(`/user/find?category=${encodeURIComponent(cat.name)}`)}`);
        } else {
            // Already logged in - navigate to service
            navigate(`/user/find?category=${encodeURIComponent(cat.name)}`);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!role) {
            // Not logged in - redirect to login with return URL
            navigate(`/login?redirect=${encodeURIComponent(`/user/find?search=${encodeURIComponent(searchQuery)}`)}`);
        } else {
            // Already logged in - navigate to search
            navigate(`/user/find?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const topPros = professionals.filter(p => p.available).slice(0, 3);

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Topbar */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    {/* Logo + City */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">W</div>
                            <span className="font-bold text-gray-900 text-lg hidden sm:block">WorkSphere</span>
                        </div>
                        <div className="hidden md:flex items-center gap-1 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer hover:border-gray-300 transition-colors">
                            <span>📍</span>
                            <select
                                value={city}
                                onChange={e => setCity(e.target.value)}
                                className="bg-transparent text-sm text-gray-700 outline-none cursor-pointer"
                            >
                                {['Your City', 'Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden sm:flex">
                        <div className="flex w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for services..."
                                className="flex-1 px-4 py-2.5 text-sm outline-none text-gray-700"
                            />
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    {/* Login button */}
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-md hover:shadow-lg flex-shrink-0"
                    >
                        Login
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10 lg:pt-14 lg:pb-16">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    {/* Left: Text Content */}
                    <div className="animate-slide-up">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                            Home services at<br />your doorstep
                        </h1>

                        {/* Search bar (mobile) */}
                        <form onSubmit={handleSearch} className="sm:hidden flex mb-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="What are you looking for?"
                                className="flex-1 px-4 py-3 text-sm outline-none text-gray-700"
                            />
                            <button type="submit" className="bg-green-600 text-white px-4">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>

                        {/* Desktop search pills */}
                        <div className="hidden sm:flex mb-6">
                            <div className="relative flex-1 max-w-md">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="What are you looking for?"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                                />
                            </div>
                        </div>

                        {/* Service Category quick buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            {serviceCategories.slice(0, 4).map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryClick(cat)}
                                    className="text-left px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-green-400 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group"
                                >
                                    <span className="group-hover:scale-110 inline-block transition-transform">{cat.icon}</span>
                                    {' '}{cat.name === 'Cleaning' ? 'Bathroom & Kitchen Cleaning' : cat.name === 'Plumbing' ? 'Plumbers & Electricians' : cat.name === 'AC & Appliance' ? 'AC & Appliance Repair' : cat.name === 'Water Purifier' ? 'Water Purifier Service' : cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-8 mt-8 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-2.5">
                                <span className="text-2xl text-yellow-400">☆</span>
                                <div>
                                    <p className="text-xl font-bold text-gray-900">4.8</p>
                                    <p className="text-xs text-gray-500">Service Rating*</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className="text-2xl text-gray-500">👥</span>
                                <div>
                                    <p className="text-xl font-bold text-gray-900">12M+</p>
                                    <p className="text-xs text-gray-500">Customers Globally*</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className="text-2xl text-gray-500">🔧</span>
                                <div>
                                    <p className="text-xl font-bold text-gray-900">50K+</p>
                                    <p className="text-xs text-gray-500">Professionals*</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Image grid */}
                    <div className="hidden lg:grid grid-cols-2 gap-3">
                        <div className="rounded-2xl overflow-hidden h-52 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <img src="https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop" alt="Cleaning service" className="w-full h-full object-cover" />
                        </div>
                        <div className="rounded-2xl overflow-hidden h-52 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                            <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop" alt="Electrical service" className="w-full h-full object-cover" />
                        </div>
                        <div className="rounded-2xl overflow-hidden h-52 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop" alt="Plumbing service" className="w-full h-full object-cover" />
                        </div>
                        <div className="rounded-2xl overflow-hidden h-52 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                            <img src="https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=400&h=300&fit=crop" alt="Carpentry service" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* All Service Categories */}
            <section className="bg-gray-50 py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Our Services</h2>
                            <p className="text-gray-500 text-sm mt-1">Trusted professionals for every home need</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {serviceCategories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat)}
                                className="bg-white rounded-2xl p-5 text-left border border-gray-100 hover:border-green-300 hover:shadow-md transition-all duration-200 group"
                            >
                                <span className="text-3xl group-hover:scale-110 inline-block transition-transform">{cat.icon}</span>
                                <h3 className="font-semibold text-gray-900 text-sm mt-3">{cat.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">{cat.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">How It Works</h2>
                <p className="text-gray-500 text-center text-sm mb-10">3 simple steps to get started</p>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { step: '01', icon: '🔍', title: 'Search', desc: 'Find the right professional for your specific service need.' },
                        { step: '02', icon: '📅', title: 'Book', desc: 'Choose your preferred time and book with a single click.' },
                        { step: '03', icon: '✅', title: 'Get it Done', desc: 'Sit back while the expert handles everything for you.' },
                    ].map(item => (
                        <div key={item.step} className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                                {item.icon}
                            </div>
                            <span className="text-xs font-bold text-green-600 tracking-widest">{item.step}</span>
                            <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Top Professionals */}
            <section className="bg-gray-50 py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Rated Professionals</h2>
                    <p className="text-gray-500 text-sm mb-8">Verified experts with proven track records</p>
                    <div className="grid md:grid-cols-3 gap-5">
                        {topPros.map(pro => (
                            <div key={pro.id} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <img src={pro.avatar} alt={pro.name} className="w-12 h-12 rounded-xl bg-gray-100" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-sm">{pro.name}</h3>
                                        <p className="text-xs text-green-600">{pro.category}</p>
                                    </div>
                                    {pro.verified && <span className="ml-auto badge-green text-[10px]">✓ Verified</span>}
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <StarRating value={pro.rating} readonly size="sm" />
                                    <span className="text-xs text-gray-500">{pro.rating} ({pro.reviews})</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                    <span>📍 {pro.location}</span>
                                    <span className="font-medium text-gray-700">{pro.price}</span>
                                </div>
                                <button
                                    onClick={() => { setRole('user'); navigate(`/user/professional/${pro.id}`); }}
                                    className="btn-primary w-full text-sm py-2"
                                >
                                    View Profile
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">What Our Customers Say</h2>
                <p className="text-gray-500 text-center text-sm mb-10">Real reviews from real customers</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {reviews.map(r => (
                        <div key={r.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full bg-gray-100" />
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                                    <p className="text-xs text-gray-500">{r.city}</p>
                                </div>
                            </div>
                            <StarRating value={r.rating} readonly size="sm" />
                            <p className="text-sm text-gray-600 mt-3 leading-relaxed">"{r.text}"</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Banner */}
            <section className="bg-gradient-to-r from-green-600 to-green-700 py-14">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
                    <p className="text-green-100 mb-8">Join thousands of happy customers. Book a service in minutes.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-white text-green-700 font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-lg"
                        >
                            Book a Service
                        </button>
                        <button
                            onClick={() => navigate('/join-professional')}
                            className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            Join as Professional
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400">
                {/* Main footer columns */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
                    {/* Logo row */}
                    <div className="flex items-center gap-2 mb-10">
                        <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">W</div>
                        <span className="font-bold text-white text-lg leading-tight">Service<br />Connect</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                        {/* Company */}
                        <div>
                            <h4 className="text-white font-semibold text-sm mb-5">Company</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">About us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Investor Relations</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms &amp; conditions</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Anti-discrimination policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            </ul>
                        </div>

                        {/* For customers */}
                        <div>
                            <h4 className="text-white font-semibold text-sm mb-5">For customers</h4>
                            <ul className="space-y-3 text-sm">
                                <li><a href="#" className="text-green-400 hover:text-green-300 transition-colors">SC reviews</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Categories near you</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact us</a></li>
                            </ul>
                        </div>

                        {/* For professionals */}
                        <div>
                            <h4 className="text-white font-semibold text-sm mb-5">For professionals</h4>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <button
                                        onClick={() => handleRoleSelect('professional')}
                                        className="hover:text-white transition-colors text-left"
                                    >
                                        Register as a professional
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Social links */}
                        <div>
                            <h4 className="text-white font-semibold text-sm mb-5">Social links</h4>
                            {/* Social icons */}
                            <div className="flex items-center gap-3 mb-6">
                                {/* Twitter/X */}
                                <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-gray-400 hover:text-white transition-colors">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.254 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                                {/* Facebook */}
                                <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-gray-400 hover:text-white transition-colors">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                {/* Instagram */}
                                <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-gray-400 hover:text-white transition-colors">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                    </svg>
                                </a>
                                {/* LinkedIn */}
                                <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-gray-400 hover:text-white transition-colors">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                            </div>

                            {/* App Store badge */}
                            <a href="#" className="flex items-center gap-2 bg-black border border-gray-600 rounded-lg px-4 py-2.5 mb-3 w-44 hover:border-gray-400 transition-colors">
                                <svg className="w-6 h-6 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.19 1.31-2.17 3.91.03 3.1 2.73 4.15 2.75 4.16l-.04.05zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                                <div>
                                    <p className="text-gray-400 text-[9px] leading-none mb-0.5">Download on the</p>
                                    <p className="text-white text-sm font-semibold leading-none">App Store</p>
                                </div>
                            </a>

                            {/* Google Play badge */}
                            <a href="#" className="flex items-center gap-2 bg-black border border-gray-600 rounded-lg px-4 py-2.5 w-44 hover:border-gray-400 transition-colors">
                                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                                    <path d="M3.18 0C2.53.35 2.1 1.04 2.1 1.92v20.16c0 .88.43 1.57 1.08 1.92L13.5 12 3.18 0z" fill="#EA4335" />
                                    <path d="M17.96 8.18L5.32.3 14.73 9.7l3.23-1.52z" fill="#FBBC04" />
                                    <path d="M17.96 15.82l-3.23-1.52L5.32 23.7l12.64-7.88z" fill="#34A853" />
                                    <path d="M21.9 12c0-.96-.47-1.8-1.18-2.27l-2.76-1.55-3.23 3.82 3.23 3.82 2.73-1.52c.73-.48 1.21-1.34 1.21-2.3z" fill="#4285F4" />
                                </svg>
                                <div>
                                    <p className="text-gray-400 text-[9px] leading-none mb-0.5">GET IT ON</p>
                                    <p className="text-white text-sm font-semibold leading-none">Google Play</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700" />

                {/* Bottom copyright bar */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-xs text-gray-500 mb-1">* As on December 31, 2024</p>
                    <p className="text-xs text-gray-500">
                        © Copyright {new Date().getFullYear()} WorkSphere (formerly known as ProFinder Technologies India Limited){' '}
                        <span className="text-green-400">All rights reserved.</span>
                        {' '}| CIN: L74140DL2014PLC274413
                    </p>
                </div>
            </footer>

            {/* Role Modal */}
            {showRoleModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-slide-up">
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">🔐</div>
                            <h2 className="text-2xl font-bold text-gray-900">Select Your Role</h2>
                            <p className="text-gray-500 text-sm mt-1">Choose how you want to use WorkSphere</p>
                        </div>
                        <div className="space-y-3">
                            {roles.map(r => (
                                <button
                                    key={r.value}
                                    onClick={() => handleRoleSelect(r.value)}
                                    className="w-full flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-green-400 hover:bg-green-50 transition-all text-left group"
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{r.icon}</span>
                                    <div>
                                        <p className="font-semibold text-gray-900">{r.label}</p>
                                        <p className="text-xs text-gray-500">{r.desc}</p>
                                    </div>
                                    <svg className="ml-auto w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setShowRoleModal(false)} className="w-full mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors py-2">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
