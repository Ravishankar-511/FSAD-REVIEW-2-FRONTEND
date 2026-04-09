import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import ProfessionalCard from '../components/ProfessionalCard';
import { useApp } from '../context/AppContext';
import StarRating from '../components/StarRating';
import ratingService from '../api/ratingService';

export default function UserDashboard() {
    const { professionals, hireRequest, requests, serviceCategories, updateRequestStatus, submitProfessionalRating, supportRequests, submitSupportRequest, fetchUserRequests } = useApp();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('find');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [hireModal, setHireModal] = useState(null); // { professional, services[] }
    const [selectedService, setSelectedService] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [ratingPro, setRatingPro] = useState(null);
    const [myRating, setMyRating] = useState(0);
    const [ratingSuccess, setRatingSuccess] = useState('');
    const [isHiring, setIsHiring] = useState(false);
    const [isRating, setIsRating] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    // Support request form state
    const [supportForm, setSupportForm] = useState({ subject: '', category: 'Booking', description: '', priority: 'medium' });
    const [supportMsg, setSupportMsg] = useState('');
    const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);

    // Get current logged-in user
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        setCurrentUser(user);
    }, []);

    useEffect(() => {
        const loadRequests = async () => {
            const currentUserName = currentUser?.name || currentUser?.fullName || currentUser?.userName || currentUser?.email;
            if (currentUserName) {
                try {
                    await fetchUserRequests(currentUserName);
                } catch (error) {
                    console.error('Failed to load user requests:', error);
                }
            }
        };
        loadRequests();
    }, [currentUser, fetchUserRequests]);

    // Auto-apply filters from URL params
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cat = params.get('category');
        const search = params.get('search');
        if (cat) { setSelectedCategory(cat); setActiveTab('find'); }
        if (search) { setSearchQuery(search); setActiveTab('find'); }
    }, [location.search]);

    // Update active tab based on URL path
    useEffect(() => {
        const pathname = location.pathname;
        if (pathname.includes('/requests')) {
            setActiveTab('requests');
        } else if (pathname.includes('/find')) {
            setActiveTab('find');
        } else if (pathname.includes('/support')) {
            setActiveTab('support');
        } else {
            setActiveTab('overview');
        }
    }, [location.pathname]);

    const currentUserName = currentUser?.name || currentUser?.fullName || currentUser?.userName || currentUser?.email || 'You';
    const myRequests = requests.filter(r => r.userId === currentUser?.userId || r.userName === currentUserName || r.userName === 'You');
    const mySupportTickets = supportRequests.filter(r => r.userId === currentUser?.userId || r.userName === currentUserName || r.userName === 'You');

    const filtered = professionals.filter(p => {
        const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()) || p.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchCat && matchSearch;
    });

    const handleHire = (professional) => {
        setHireModal(professional);
        setSelectedService(professional.services[0] || '');
    };

    const confirmHire = async () => {
        const userName = currentUser?.name || currentUser?.fullName || currentUser?.userName || currentUser?.email;
        if (!selectedService || !userName || !hireModal) return;
        setIsHiring(true);
        try {
            await hireRequest(userName, hireModal.name, selectedService);
            setHireModal(null);
            setSuccessMsg(`✅ Hired ${hireModal.name} for "${selectedService}"! Request sent.`);
            setTimeout(() => setSuccessMsg(''), 4000);
            setActiveTab('requests');
        } catch (error) {
            console.error('Error hiring professional:', error);
            setSuccessMsg('❌ Failed to send hire request. Please try again.');
            setTimeout(() => setSuccessMsg(''), 4000);
        } finally {
            setIsHiring(false);
        }
    };

    const submitRating = async () => {
        if (myRating === 0) return;
        setIsRating(true);
        try {
            const userName = currentUser?.name || currentUser?.fullName || currentUser?.userName || currentUser?.email;
            if (!userName || !ratingPro?.professionalName) {
                setRatingSuccess('❌ Unable to submit rating. Missing user or professional information.');
                setTimeout(() => setRatingSuccess(''), 3000);
                setIsRating(false);
                return;
            }
            
            // Call backend API
            await ratingService.submitRating({
                userName,
                professionalName: ratingPro.professionalName,
                rating: myRating,
            });
            
            setRatingSuccess(`⭐ Rating submitted for ${ratingPro.professionalName}! Thank you 🎉`);
            setRatingPro(null);
            setMyRating(0);
            setTimeout(() => setRatingSuccess(''), 3000);
        } catch (error) {
            console.error('Error submitting rating:', error);
            setRatingSuccess('❌ Failed to submit rating. Please try again.');
            setTimeout(() => setRatingSuccess(''), 3000);
        } finally {
            setIsRating(false);
        }
    };

    const handleSupportSubmit = async (e) => {
        e.preventDefault();
        if (!supportForm.subject.trim() || !supportForm.description.trim()) return;
        setIsSubmittingSupport(true);
        try {
            await new Promise(res => setTimeout(res, 700));
            await submitSupportRequest(supportForm);
            setSupportForm({ subject: '', category: 'Booking', description: '', priority: 'medium' });
            setSupportMsg('✅ Your support request has been submitted! Our team will respond shortly.');
            setTimeout(() => setSupportMsg(''), 5000);
        } catch (err) {
            setSupportMsg('❌ Failed to submit request. Please try again.');
            setTimeout(() => setSupportMsg(''), 4000);
        } finally {
            setIsSubmittingSupport(false);
        }
    };

    return (
        <DashboardLayout title="User Dashboard">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {['find', 'requests', 'support'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        {tab === 'find' ? '🔍 Find Professionals' : tab === 'requests' ? `📋 My Requests (${myRequests.length})` : `🎫 Support (${mySupportTickets.length})`}
                    </button>
                ))}
            </div>

            {successMsg && (
                <div className="mb-5 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium animate-fade-in">
                    {successMsg}
                </div>
            )}
            {ratingSuccess && (
                <div className="mb-5 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm font-medium animate-fade-in">
                    {ratingSuccess}
                </div>
            )}

            {/* Find Professionals Tab */}
            {activeTab === 'find' && (
                <div className="animate-fade-in">
                    {/* Filters */}
                    <div className="card mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search by name, category, or service..."
                                    className="input pl-9"
                                />
                            </div>
                            <select
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value)}
                                className="input w-auto min-w-[180px]"
                            >
                                <option value="All">All Categories</option>
                                {serviceCategories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Category Quick Filters */}
                    <div className="flex gap-2 flex-wrap mb-5">
                        {['All', ...serviceCategories.map(c => c.name)].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Results */}
                    <div className="mb-3">
                        <p className="text-sm text-gray-500">{filtered.length} professional{filtered.length !== 1 ? 's' : ''} found</p>
                    </div>
                    {filtered.length === 0 ? (
                        <div className="card text-center py-12">
                            <p className="text-4xl mb-3">🔍</p>
                            <p className="text-gray-500">No professionals found. Try different filters.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map(p => (
                                <ProfessionalCard
                                    key={p.id}
                                    professional={p}
                                    showHire={p.available}
                                    onHire={() => handleHire(p)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* My Requests Tab */}
            {activeTab === 'requests' && (
                <div className="animate-fade-in">
                    <h3 className="font-semibold text-gray-900 mb-5">My Hire Requests</h3>
                    {myRequests.length === 0 ? (
                        <div className="card text-center py-12">
                            <p className="text-4xl mb-3">📭</p>
                            <p className="text-gray-500">No requests yet. Find a professional and hire them!</p>
                            <button onClick={() => setActiveTab('find')} className="btn-primary mt-4 text-sm">Find Professionals</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {myRequests.map(req => (
                                <div key={req.id} className="card flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900">{req.professionalName}</p>
                                        <p className="text-sm text-gray-500 mt-0.5">{req.service}</p>
                                        <p className="text-xs text-gray-400 mt-1">📅 {req.date} · 📍 {req.address}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`badge text-sm px-3 py-1 ${req.status === 'accepted' ? 'badge-green' : req.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>
                                            {req.status}
                                        </span>
                                        {req.status === 'accepted' && (
                                            <button
                                                onClick={() => { setRatingPro(req); setMyRating(0); }}
                                                className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
                                            >
                                                Rate
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Support Tab */}
            {activeTab === 'support' && (
                <div className="animate-fade-in">
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Submit Form */}
                        <div>
                            <div className="card">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xl">🎫</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Submit a Support Request</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">Our support team typically responds within 24 hours</p>
                                    </div>
                                </div>
                                {supportMsg && (
                                    <div className={`mb-5 p-4 rounded-xl text-sm font-medium ${supportMsg.includes('❌') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                                        {supportMsg}
                                    </div>
                                )}
                                <form onSubmit={handleSupportSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject <span className="text-red-400">*</span></label>
                                        <input
                                            type="text"
                                            value={supportForm.subject}
                                            onChange={e => setSupportForm(p => ({ ...p, subject: e.target.value }))}
                                            placeholder="Briefly describe your issue"
                                            className="input"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                                            <select
                                                value={supportForm.category}
                                                onChange={e => setSupportForm(p => ({ ...p, category: e.target.value }))}
                                                className="input"
                                            >
                                                {['Booking', 'Payment', 'Quality', 'Professional', 'Refund', 'App Issue', 'Other'].map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                                            <select
                                                value={supportForm.priority}
                                                onChange={e => setSupportForm(p => ({ ...p, priority: e.target.value }))}
                                                className="input"
                                            >
                                                <option value="low">🟢 Low</option>
                                                <option value="medium">🟡 Medium</option>
                                                <option value="high">🔴 High</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-red-400">*</span></label>
                                        <textarea
                                            value={supportForm.description}
                                            onChange={e => setSupportForm(p => ({ ...p, description: e.target.value }))}
                                            placeholder="Please provide full details about your issue..."
                                            rows={4}
                                            className="input resize-none"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingSupport || !supportForm.subject.trim() || !supportForm.description.trim()}
                                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmittingSupport ? (
                                            <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>Submitting...</>
                                        ) : '📨 Submit Request'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* My Support Tickets */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">My Support Tickets ({mySupportTickets.length})</h3>
                            {mySupportTickets.length === 0 ? (
                                <div className="card text-center py-10">
                                    <p className="text-3xl mb-3">🎫</p>
                                    <p className="text-gray-500 text-sm">No support requests yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {mySupportTickets.map(ticket => (
                                        <div key={ticket.id} className="card animate-fade-in">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <p className="font-semibold text-gray-900 text-sm">{ticket.subject}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mb-2 leading-relaxed">{ticket.description}</p>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="badge badge-blue text-xs">{ticket.category}</span>
                                                        <span className={`badge text-xs ${ ticket.priority === 'high' ? 'badge-red' : ticket.priority === 'medium' ? 'badge-yellow' : 'badge-green'}`}>{ticket.priority}</span>
                                                        <span className="text-xs text-gray-400">📅 {ticket.date}</span>
                                                    </div>
                                                </div>
                                                <span className={`badge text-xs px-2 py-1 flex-shrink-0 ${ticket.status === 'open' ? 'badge-red' : 'badge-green'}`}>
                                                    {ticket.status === 'open' ? '🔴 Open' : '✅ Resolved'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Hire Modal */}
            {hireModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 animate-slide-up">
                        <div className="flex items-center gap-4 mb-5">
                            <img src={hireModal.avatar} alt={hireModal.name} className="w-14 h-14 rounded-2xl bg-gray-100" />
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{hireModal.name}</h3>
                                <p className="text-green-600 text-sm">{hireModal.category} · {hireModal.price}</p>
                            </div>
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Service</label>
                            <select
                                value={selectedService}
                                onChange={e => setSelectedService(e.target.value)}
                                disabled={isHiring}
                                className="input disabled:opacity-50"
                            >
                                {hireModal.services.map((s, i) => <option key={i} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={confirmHire} 
                                disabled={!selectedService || isHiring}
                                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isHiring ? (
                                    <>
                                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Confirming...
                                    </>
                                ) : 'Confirm Hire'}
                            </button>
                            <button 
                                onClick={() => setHireModal(null)} 
                                disabled={isHiring}
                                className="btn-secondary flex-1 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rating Modal */}
            {ratingPro && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 animate-slide-up text-center">
                        <p className="text-3xl mb-3">⭐</p>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">Rate Your Experience</h3>
                        <p className="text-gray-500 text-sm mb-5">with {ratingPro.professionalName}</p>
                        <div className="flex justify-center mb-5">
                            <StarRating value={myRating} onChange={setMyRating} size="lg" />
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={submitRating} 
                                disabled={myRating === 0 || isRating}
                                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isRating ? (
                                    <>
                                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Submitting...
                                    </>
                                ) : 'Submit Rating'}
                            </button>
                            <button 
                                onClick={() => setRatingPro(null)} 
                                disabled={isRating}
                                className="btn-secondary flex-1 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
