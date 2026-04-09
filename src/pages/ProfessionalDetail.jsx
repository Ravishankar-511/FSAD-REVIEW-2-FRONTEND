import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DashboardLayout from '../layouts/DashboardLayout';
import StarRating from '../components/StarRating';

export default function ProfessionalDetail() {
    const { id } = useParams();
    const { professionals, hireRequest } = useApp();
    const navigate = useNavigate();
    const pro = professionals.find(p => p.id === parseInt(id));
    const [selectedService, setSelectedService] = useState('');
    const [hired, setHired] = useState(false);
    const [isHiring, setIsHiring] = useState(false);

    if (!pro) {
        return (
            <DashboardLayout title="Professional Not Found">
                <div className="card text-center py-16">
                    <p className="text-5xl mb-4">🔍</p>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Professional not found</h2>
                    <button onClick={() => navigate(-1)} className="btn-primary mt-4">Go Back</button>
                </div>
            </DashboardLayout>
        );
    }

    const handleHire = async () => {
        if (!selectedService && pro.services.length > 0) {
            setSelectedService(pro.services[0]);
            return;
        }
        setIsHiring(true);
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            const userName = currentUser.name || currentUser.fullName || currentUser.userName || currentUser.email;
            if (!userName) {
                console.error('No logged in user name available for hire request.');
                setIsHiring(false);
                return;
            }
            await hireRequest(userName, pro.name, selectedService || pro.services[0] || pro.category);
            setHired(true);
        } catch (error) {
            console.error('Error hiring professional:', error);
            setIsHiring(false);
        }
    };

    return (
        <DashboardLayout title="Professional Profile">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to listings
            </button>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Main profile */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Profile Card */}
                    <div className="card">
                        <div className="flex items-start gap-5">
                            <img src={pro.avatar} alt={pro.name} className="w-24 h-24 rounded-2xl bg-gray-100 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap mb-1">
                                    <h1 className="text-2xl font-bold text-gray-900">{pro.name}</h1>
                                    {pro.verified && (
                                        <span className="badge-green font-semibold">✓ Verified Professional</span>
                                    )}
                                </div>
                                <p className="text-green-600 font-semibold">{pro.category}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <StarRating value={pro.rating} readonly size="md" />
                                    <span className="text-sm font-semibold text-gray-700">{pro.rating}</span>
                                    <span className="text-sm text-gray-400">({pro.reviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 flex-wrap">
                                    <span>📍 {pro.location}</span>
                                    <span>⏱ {pro.experience} experience</span>
                                    <span>✅ {pro.completedJobs} jobs done</span>
                                    <span className={`inline-flex items-center gap-1 font-medium ${pro.available ? 'text-green-600' : 'text-gray-400'}`}>
                                        <span className={`w-2 h-2 rounded-full ${pro.available ? 'bg-green-500' : 'bg-gray-400'}`} />
                                        {pro.available ? 'Available Now' : 'Busy'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About */}
                    <div className="card">
                        <h2 className="font-semibold text-gray-900 mb-3">About</h2>
                        <p className="text-gray-600 text-sm leading-relaxed">{pro.bio}</p>
                    </div>

                    {/* Services */}
                    <div className="card">
                        <h2 className="font-semibold text-gray-900 mb-4">Services Offered</h2>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {pro.services.map((srv, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedService(srv)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium text-left transition-all ${selectedService === srv ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 hover:border-green-200 hover:bg-green-50 text-gray-700'}`}
                                >
                                    <span className="text-green-500">🔧</span>
                                    {srv}
                                    {selectedService === srv && <span className="ml-auto text-green-600">✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Hire Card */}
                <div>
                    <div className="card sticky top-6">
                        <h2 className="font-semibold text-gray-900 mb-1">Book This Professional</h2>
                        <p className="text-3xl font-bold text-green-600 mt-2">{pro.price}</p>
                        <p className="text-xs text-gray-400 mb-5">Pricing may vary by service</p>

                        {!hired ? (
                            <>
                                {pro.services.length > 0 && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Service</label>
                                        <select
                                            value={selectedService}
                                            onChange={e => setSelectedService(e.target.value)}
                                            disabled={isHiring}
                                            className="input disabled:opacity-50"
                                        >
                                            <option value="">Choose a service...</option>
                                            {pro.services.map((s, i) => <option key={i} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                )}
                                <button
                                    onClick={handleHire}
                                    disabled={!pro.available || isHiring}
                                    className={`btn-primary w-full mb-3 ${!pro.available || isHiring ? 'opacity-50 cursor-not-allowed' : ''} flex items-center justify-center gap-2`}
                                >
                                    {isHiring ? (
                                        <>
                                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                            Sending Request...
                                        </>
                                    ) : (
                                        pro.available ? 'Hire Now' : 'Currently Unavailable'
                                    )}
                                </button>
                                <button 
                                    onClick={() => navigate(-1)}
                                    disabled={isHiring}
                                    className="btn-secondary w-full text-sm disabled:opacity-50"
                                >
                                    Back to Search
                                </button>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-4xl mb-3">🎉</p>
                                <p className="font-semibold text-green-600 mb-1">Hire Request Sent!</p>
                                <p className="text-sm text-gray-500 mb-4">Waiting for {pro.name} to accept your request.</p>
                                <button onClick={() => navigate('/user/requests')} className="btn-primary w-full text-sm">View My Requests</button>
                            </div>
                        )}

                        {/* Quick stats */}
                        <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-xl font-bold text-gray-900">{pro.completedJobs}+</p>
                                <p className="text-xs text-gray-500">Jobs Done</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900">{pro.rating}⭐</p>
                                <p className="text-xs text-gray-500">Rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}