import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { useApp } from '../context/AppContext';

export default function ProfessionalDashboard() {
    const location = useLocation();
    const { professionals, professionalProfile, updateProfile, addService, requests, updateRequestStatus, fetchProfessionalRequests, setProfessionalProfile } = useApp();
    const [activeTab, setActiveTab] = useState('overview');
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ name: professionalProfile.name, bio: professionalProfile.bio, location: professionalProfile.location, price: professionalProfile.price });
    const [newService, setNewService] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingService, setIsAddingService] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [serviceMessage, setServiceMessage] = useState('');

    // Load correct professional profile on mount
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const professionalName = currentUser.name || currentUser.fullName || currentUser.professionalName;
        if (currentUser.role === 'professional') {
            let professional = null;
            if (currentUser.professionalId) {
                professional = professionals.find(p => p.id === currentUser.professionalId);
            }
            if (!professional && professionalName) {
                professional = professionals.find(p => p.name === professionalName);
            }
            if (professional) {
                setProfessionalProfile(professional);
                setForm({ name: professional.name, bio: professional.bio, location: professional.location, price: professional.price });
            }
        }
    }, [professionals, setProfessionalProfile]);

    useEffect(() => {
        const loadProfessionalRequests = async () => {
            const professionalName = professionalProfile?.name || JSON.parse(localStorage.getItem('currentUser') || '{}').name;
            if (professionalName) {
                try {
                    await fetchProfessionalRequests(professionalName);
                } catch (error) {
                    console.error('Failed to load professional requests:', error);
                }
            }
        };
        loadProfessionalRequests();
    }, [professionalProfile, fetchProfessionalRequests]);

    // Update active tab based on URL path
    useEffect(() => {
        const pathname = location.pathname;
        if (pathname.includes('/profile')) {
            setActiveTab('profile');
        } else if (pathname.includes('/services')) {
            setActiveTab('services');
        } else if (pathname.includes('/requests')) {
            setActiveTab('requests');
        } else {
            setActiveTab('overview');
        }
    }, [location.pathname]);

    const myRequests = requests.filter(r => r.professionalName === professionalProfile.name);
    const pendingCount = myRequests.filter(r => r.status === 'pending').length;
    const acceptedCount = myRequests.filter(r => r.status === 'accepted').length;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise(res => setTimeout(res, 700));
            updateProfile(form);
            setEditMode(false);
            setSaveMessage('✅ Profile updated successfully!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            console.error('Error saving profile:', error);
            setSaveMessage('❌ Failed to save profile. Please try again.');
            setTimeout(() => setSaveMessage(''), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        if (!newService.trim()) return;
        setIsAddingService(true);
        try {
            // Simulate API call
            await new Promise(res => setTimeout(res, 500));
            addService(newService.trim());
            setNewService('');
            setServiceMessage(`✅ Service "${newService}" added successfully!`);
            setTimeout(() => setServiceMessage(''), 2500);
        } catch (error) {
            console.error('Error adding service:', error);
            setServiceMessage('❌ Failed to add service. Please try again.');
            setTimeout(() => setServiceMessage(''), 2500);
        } finally {
            setIsAddingService(false);
        }
    };

    const handleRequestAction = async (reqId, action) => {
        try {
            await updateRequestStatus(reqId, action);
        } catch (error) {
            console.error('Error updating request:', error);
        }
    };

    return (
        <DashboardLayout title="Professional Dashboard">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {['overview', 'profile', 'services', 'requests'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all relative ${activeTab === tab ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        {tab}
                        {tab === 'requests' && pendingCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{pendingCount}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
                <div className="animate-fade-in">
                    {/* Profile Summary Card */}
                    <div className="card flex items-center gap-5 mb-6">
                        <img src={professionalProfile.avatar} alt={professionalProfile.name} className="w-20 h-20 rounded-2xl bg-gray-100" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-xl font-bold text-gray-900">{professionalProfile.name}</h2>
                                {professionalProfile.verified && <span className="badge-green">✓ Verified</span>}
                            </div>
                            <p className="text-green-600 font-medium text-sm">{professionalProfile.category}</p>
                            <p className="text-gray-500 text-sm mt-1">{professionalProfile.location} · {professionalProfile.experience}</p>
                            <div className="flex items-center gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <span key={s} className={`text-lg ${s <= Math.round(professionalProfile.rating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                                ))}
                                <span className="text-sm text-gray-500 ml-1">{professionalProfile.rating} ({professionalProfile.reviews} reviews)</span>
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-2xl font-bold text-gray-900">{professionalProfile.price}</p>
                            <p className="text-xs text-gray-400">per hour</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid sm:grid-cols-3 gap-5 mb-6">
                        <div className="card text-center">
                            <p className="text-3xl font-bold text-gray-900">{professionalProfile.completedJobs}</p>
                            <p className="text-sm text-gray-500 mt-1">Completed Jobs</p>
                        </div>
                        <div className="card text-center">
                            <p className="text-3xl font-bold text-yellow-500">{pendingCount}</p>
                            <p className="text-sm text-gray-500 mt-1">Pending Requests</p>
                        </div>
                        <div className="card text-center">
                            <p className="text-3xl font-bold text-green-600">{acceptedCount}</p>
                            <p className="text-sm text-gray-500 mt-1">Accepted</p>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="card">
                        <h3 className="font-semibold text-gray-900 mb-2">About Me</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{professionalProfile.bio}</p>
                    </div>
                </div>
            )}

            {/* Profile Edit Tab */}
            {activeTab === 'profile' && (
                <div className="card animate-fade-in max-w-2xl">
                    {saveMessage && (
                        <div className={`mb-5 p-3 rounded-xl text-sm font-medium ${saveMessage.includes('❌') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                            {saveMessage}
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-900 text-lg">Edit Profile</h3>
                        {!editMode && (
                            <button 
                                onClick={() => setEditMode(true)}
                                disabled={isSaving}
                                className="btn-primary text-sm disabled:opacity-50"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: 'Full Name', key: 'name', type: 'text' },
                            { label: 'Location', key: 'location', type: 'text' },
                            { label: 'Rate (e.g. ₹299/hr)', key: 'price', type: 'text' },
                        ].map(field => (
                            <div key={field.key}>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                                {editMode ? (
                                    <input
                                        type={field.type}
                                        value={form[field.key]}
                                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                                        disabled={isSaving}
                                        className="input disabled:opacity-50"
                                    />
                                ) : (
                                    <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-700">{professionalProfile[field.key]}</div>
                                )}
                            </div>
                        ))}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                            {editMode ? (
                                <textarea
                                    rows={4}
                                    value={form.bio}
                                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                    disabled={isSaving}
                                    className="input resize-none disabled:opacity-50"
                                />
                            ) : (
                                <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-600 leading-relaxed">{professionalProfile.bio}</div>
                            )}
                        </div>
                        {editMode && (
                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                            Saving...
                                        </>
                                    ) : 'Save Changes'}
                                </button>
                                <button 
                                    onClick={() => { setEditMode(false); setForm({ name: professionalProfile.name, bio: professionalProfile.bio, location: professionalProfile.location, price: professionalProfile.price }); }}
                                    disabled={isSaving}
                                    className="btn-secondary disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
                <div className="animate-fade-in space-y-5">
                    {/* Add Service */}
                    <div className="card">
                        {serviceMessage && (
                            <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${serviceMessage.includes('❌') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                                {serviceMessage}
                            </div>
                        )}
                        <h3 className="font-semibold text-gray-900 mb-4">Add Service</h3>
                        <form onSubmit={handleAddService} className="flex gap-3">
                            <input
                                value={newService}
                                onChange={e => setNewService(e.target.value)}
                                placeholder="e.g. Hot Water Pipe Repair"
                                disabled={isAddingService}
                                className="input flex-1 disabled:opacity-50"
                            />
                            <button 
                                type="submit"
                                disabled={!newService.trim() || isAddingService}
                                className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 px-4"
                            >
                                {isAddingService ? (
                                    <>
                                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    </>
                                ) : '+ Add'}
                            </button>
                        </form>
                    </div>

                    {/* Services List */}
                    <div className="card">
                        <h3 className="font-semibold text-gray-900 mb-4">My Services ({professionalProfile.services?.length || 0})</h3>
                        {professionalProfile.services?.length ? (
                            <div className="grid sm:grid-cols-2 gap-3">
                                {professionalProfile.services.map((srv, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
                                        <span className="text-green-600 text-lg">🔧</span>
                                        <span className="text-sm font-medium text-gray-700 flex-1">{srv}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No services added yet.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
                <div className="animate-fade-in">
                    <h3 className="font-semibold text-gray-900 mb-5">Hire Requests ({myRequests.length})</h3>
                    {myRequests.length === 0 ? (
                        <div className="card text-center py-12 text-gray-400">
                            <p className="text-4xl mb-3">📭</p>
                            <p>No hire requests yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {myRequests.map(req => (
                                <div key={req.id} className="card flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900">{req.userName}</p>
                                        <p className="text-sm text-gray-500 mt-0.5">{req.service}</p>
                                        <p className="text-xs text-gray-400 mt-1">📍 {req.address} · 📅 {req.date}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {req.status === 'pending' ? (
                                            <>
                                                <button 
                                                    onClick={() => handleRequestAction(req.id, 'accepted')} 
                                                    className="btn-primary text-sm py-1.5 px-4 transition-all hover:shadow-md"
                                                >
                                                    Accept
                                                </button>
                                                <button 
                                                    onClick={() => handleRequestAction(req.id, 'rejected')} 
                                                    className="btn-danger text-sm py-1.5 px-4 transition-all hover:shadow-md"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        ) : (
                                            <span className={`badge ${req.status === 'accepted' ? 'badge-green' : 'badge-red'} text-sm px-3 py-1`}>{req.status}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
}
