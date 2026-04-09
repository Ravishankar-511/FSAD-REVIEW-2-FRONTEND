import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import StatsCard from '../components/StatsCard';
import { useApp } from '../context/AppContext';
import categoryService from '../api/categoryService';

export default function AdminDashboard() {
    const location = useLocation();
    const { professionals, requests, users, syncUsers } = useApp();
    const [activeTab, setActiveTab] = useState('overview');
    const [categories, setCategories] = useState([]);
    const [newCatName, setNewCatName] = useState('');
    const [newCatIcon, setNewCatIcon] = useState('🔧');
    const [newCatDesc, setNewCatDesc] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [categoryMessage, setCategoryMessage] = useState('');
    const [removingId, setRemovingId] = useState(null);

    // Update active tab based on URL path
    useEffect(() => {
        const pathname = location.pathname;
        if (pathname.includes('/users')) {
            setActiveTab('users');
        } else if (pathname.includes('/professionals')) {
            setActiveTab('professionals');
        } else if (pathname.includes('/categories')) {
            setActiveTab('categories');
        } else {
            setActiveTab('overview');
        }
    }, [location.pathname]);

    // Sync users on component mount to get newly registered users
    useEffect(() => {
        syncUsers();
    }, []);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await categoryService.getCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                setCategoryMessage('❌ Failed to load categories. Please refresh the page.');
                setTimeout(() => setCategoryMessage(''), 5000);
            }
        };
        fetchCategories();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCatName.trim()) return;
        setIsAddingCategory(true);
        try {
            const categoryData = {
                name: newCatName,
                icon: newCatIcon,
                description: newCatDesc
            };
            const newCategory = await categoryService.addCategory(categoryData);
            setCategories(prev => [...prev, newCategory]);
            setNewCatName('');
            setNewCatIcon('🔧');
            setNewCatDesc('');
            setCategoryMessage(`✅ Category "${newCatName}" added successfully!`);
            setTimeout(() => setCategoryMessage(''), 3000);
        } catch (error) {
            console.error('Error adding category:', error);
            setCategoryMessage('❌ Failed to add category. Please try again.');
            setTimeout(() => setCategoryMessage(''), 3000);
        } finally {
            setIsAddingCategory(false);
        }
    };

    const handleRemoveCategory = async (id) => {
        setRemovingId(id);
        try {
            await categoryService.deleteCategory(id);
            setCategories(prev => prev.filter(cat => cat.id !== id));
            setCategoryMessage('✅ Category removed successfully!');
            setTimeout(() => setCategoryMessage(''), 2500);
        } catch (error) {
            console.error('Error removing category:', error);
            setCategoryMessage('❌ Failed to remove category. Please try again.');
            setTimeout(() => setCategoryMessage(''), 2500);
        } finally {
            setRemovingId(null);
        }
    };

    const tabs = ['overview', 'users', 'professionals', 'categories'];

    return (
        <DashboardLayout title="Admin Dashboard">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
                <div className="animate-fade-in">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        <StatsCard title="Total Users" value={users.length} icon="👥" color="blue" sub="Active accounts" />
                        <StatsCard title="Professionals" value={professionals.length} icon="🛠️" color="green" sub="Registered pros" />
                        <StatsCard title="Service Categories" value={categories.length} icon="🗂️" color="purple" sub="Active services" />
                        <StatsCard title="Total Requests" value={requests.length} icon="📋" color="orange" sub="Hire requests" />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Recent Requests */}
                        <div className="card">
                            <h3 className="font-semibold text-gray-900 mb-4">Recent Requests</h3>
                            <div className="space-y-3">
                                {requests.slice(0, 5).map(req => (
                                    <div key={req.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{req.userName}</p>
                                            <p className="text-xs text-gray-500">{req.service} · {req.professionalName}</p>
                                        </div>
                                        <span className={`badge ${req.status === 'accepted' ? 'badge-green' : req.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Service Distribution */}
                        <div className="card">
                            <h3 className="font-semibold text-gray-900 mb-4">Service Categories</h3>
                            <div className="space-y-2">
                                {categories.slice(0, 6).map(cat => (
                                    <div key={cat.id} className="flex items-center gap-3">
                                        <span className="text-xl">{cat.icon}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm font-medium text-gray-700">{cat.name}</p>
                                                <p className="text-xs text-gray-400">{professionals.filter(p => p.category === cat.name).length} pros</p>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-purple-500 rounded-full"
                                                    style={{ width: `${Math.max(10, professionals.filter(p => p.category === cat.name).length * 30)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="card animate-fade-in">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-gray-900">All Users ({users.length})</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Name</th>
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Email</th>
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Joined</th>
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Requests</th>
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-2 font-medium text-gray-900">{user.name}</td>
                                        <td className="py-3 px-2 text-gray-500">{user.email}</td>
                                        <td className="py-3 px-2 text-gray-500">{user.joinedDate}</td>
                                        <td className="py-3 px-2 text-gray-700">{user.requests}</td>
                                        <td className="py-3 px-2"><span className="badge-green">Active</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Professionals Tab */}
            {activeTab === 'professionals' && (
                <div className="card animate-fade-in">
                    <h3 className="font-semibold text-gray-900 mb-5">All Professionals ({professionals.length})</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Name</th>
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Category</th>
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Location</th>
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Rating</th>
                                    <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {professionals.map(pro => (
                                    <tr key={pro.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-2">
                                            <div className="flex items-center gap-2">
                                                <img src={pro.avatar} alt={pro.name} className="w-7 h-7 rounded-lg bg-gray-100" />
                                                <span className="font-medium text-gray-900">{pro.name}</span>
                                                {pro.verified && <span className="badge-green text-[10px]">✓</span>}
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-gray-600">{pro.category}</td>
                                        <td className="py-3 px-2 text-gray-500">{pro.location}</td>
                                        <td className="py-3 px-2 text-gray-700">⭐ {pro.rating}</td>
                                        <td className="py-3 px-2">
                                            <span className={pro.available ? 'badge-green' : 'badge badge-red bg-gray-100 text-gray-600'}>
                                                {pro.available ? 'Available' : 'Busy'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                <div className="animate-fade-in space-y-6">
                    {categoryMessage && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${categoryMessage.includes('❌') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                            {categoryMessage}
                        </div>
                    )}

                    {/* Add Category Form */}
                    <div className="card">
                        <h3 className="font-semibold text-gray-900 mb-4">Add New Category</h3>
                        <form onSubmit={handleAddCategory} className="flex gap-3 flex-wrap">
                            <input 
                                value={newCatIcon}
                                onChange={e => setNewCatIcon(e.target.value)}
                                placeholder="Icon (emoji)"
                                disabled={isAddingCategory}
                                className="input w-24 disabled:opacity-50"
                            />
                            <input 
                                value={newCatName}
                                onChange={e => setNewCatName(e.target.value)}
                                placeholder="Category Name"
                                disabled={isAddingCategory}
                                className="input flex-1 min-w-[140px] disabled:opacity-50"
                            />
                            <input 
                                value={newCatDesc}
                                onChange={e => setNewCatDesc(e.target.value)}
                                placeholder="Description"
                                disabled={isAddingCategory}
                                className="input flex-1 min-w-[180px] disabled:opacity-50"
                            />
                            <button 
                                type="submit"
                                disabled={!newCatName.trim() || isAddingCategory}
                                className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 px-4"
                            >
                                {isAddingCategory ? (
                                    <>
                                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    </>
                                ) : '+ Add'}
                            </button>
                        </form>
                    </div>

                    {/* Categories List */}
                    <div className="card">
                        <h3 className="font-semibold text-gray-900 mb-5">Service Categories ({categories.length})</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {categories.map(cat => (
                                <div 
                                    key={cat.id} 
                                    className={`flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors ${removingId === cat.id ? 'opacity-50' : ''}`}
                                >
                                    <span className="text-2xl">{cat.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm">{cat.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{cat.description}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveCategory(cat.id)}
                                        disabled={removingId === cat.id || isAddingCategory}
                                        className="text-red-400 hover:text-red-600 text-lg flex-shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Remove"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
