import { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useApp } from '../context/AppContext';

export default function SupportDashboard() {
    const { complaints, resolveComplaint, supportRequests, resolveSupportRequest } = useApp();
    const [activeSection, setActiveSection] = useState('complaints'); // 'complaints' | 'requests'
    const [filter, setFilter] = useState('all'); // 'all' | 'open' | 'resolved'
    const [searchQuery, setSearchQuery] = useState('');
    const [resolvingId, setResolvingId] = useState(null);
    const [resolveMessage, setResolveMessage] = useState('');

    const filtered = (activeSection === 'complaints' ? complaints : supportRequests).filter(c => {
        const matchFilter = filter === 'all' || c.status === filter;
        const matchSearch = !searchQuery ||
            c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchFilter && matchSearch;
    });

    const openCount = complaints.filter(c => c.status === 'open').length;
    const resolvedCount = complaints.filter(c => c.status === 'resolved').length;
    const openRequestsCount = supportRequests.filter(r => r.status === 'open').length;

    const priorityColor = { high: 'badge-red', medium: 'badge-yellow', low: 'badge-green' };

    const handleResolveComplaint = async (ticketId) => {
        setResolvingId(ticketId);
        try {
            // Simulate API call
            await new Promise(res => setTimeout(res, 600));
            resolveComplaint(ticketId);
            setResolveMessage('✅ Ticket marked as resolved successfully!');
            setTimeout(() => setResolveMessage(''), 3000);
        } catch (error) {
            console.error('Error resolving complaint:', error);
            setResolveMessage('❌ Failed to resolve ticket. Please try again.');
            setTimeout(() => setResolveMessage(''), 3000);
        } finally {
            setResolvingId(null);
        }
    };

    const handleResolveSupportRequest = async (ticketId) => {
        setResolvingId(ticketId);
        try {
            await new Promise(res => setTimeout(res, 600));
            resolveSupportRequest(ticketId);
            setResolveMessage('✅ User request marked as resolved!');
            setTimeout(() => setResolveMessage(''), 3000);
        } catch (error) {
            setResolveMessage('❌ Failed to resolve request. Please try again.');
            setTimeout(() => setResolveMessage(''), 3000);
        } finally {
            setResolvingId(null);
        }
    };

    return (
        <DashboardLayout title="Customer Support">
            {resolveMessage && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${resolveMessage.includes('❌') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                    {resolveMessage}
                </div>
            )}

            {/* Section Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <button
                    onClick={() => { setActiveSection('complaints'); setFilter('all'); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeSection === 'complaints' ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                >
                    💬 Complaints ({complaints.length})
                </button>
                <button
                    onClick={() => { setActiveSection('requests'); setFilter('all'); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeSection === 'requests' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                >
                    🎫 User Requests ({supportRequests.length})
                    {openRequestsCount > 0 && <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">{openRequestsCount}</span>}
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid sm:grid-cols-3 gap-5 mb-7">
                <div className="card text-center">
                    <p className="text-3xl font-bold text-gray-900">{activeSection === 'complaints' ? complaints.length : supportRequests.length}</p>
                    <p className="text-sm text-gray-500 mt-1">{activeSection === 'complaints' ? 'Total Complaints' : 'Total Requests'}</p>
                </div>
                <div className="card text-center">
                    <p className="text-3xl font-bold text-red-500">{activeSection === 'complaints' ? openCount : openRequestsCount}</p>
                    <p className="text-sm text-gray-500 mt-1">Open</p>
                </div>
                <div className="card text-center">
                    <p className="text-3xl font-bold text-green-600">{activeSection === 'complaints' ? resolvedCount : supportRequests.filter(r => r.status === 'resolved').length}</p>
                    <p className="text-sm text-gray-500 mt-1">Resolved</p>
                </div>
            </div>

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
                            placeholder="Search by user, subject, category..."
                            className="input pl-9"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'open', 'resolved'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tickets List */}
            <div>
                <p className="text-sm text-gray-500 mb-4">{filtered.length} ticket{filtered.length !== 1 ? 's' : ''} shown</p>
                {filtered.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-4xl mb-3">🎫</p>
                        <p className="text-gray-500">No tickets found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map(ticket => (
                            <div key={ticket.id} className="card animate-fade-in">
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        {/* Header row */}
                                        <div className="flex items-start gap-3 flex-wrap mb-2">
                                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">
                                                {ticket.userName[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold text-gray-900">{ticket.userName}</p>
                                                    <span className={`badge ${priorityColor[ticket.priority] || 'badge-blue'}`}>
                                                        {ticket.priority} priority
                                                    </span>
                                                    <span className="badge badge-blue">{ticket.category}</span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-800 mt-1">{ticket.subject}</p>
                                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{ticket.description}</p>
                                                <p className="text-xs text-gray-400 mt-2">📅 {ticket.date}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="flex items-center gap-3 sm:flex-col sm:items-end flex-shrink-0">
                                        <span className={`badge ${ticket.status === 'open' ? 'badge-red' : 'badge-green'} text-sm px-3 py-1`}>
                                            {ticket.status === 'open' ? '🔴 Open' : '✅ Resolved'}
                                        </span>
                                        {ticket.status === 'open' && (
                                            <button
                                                onClick={() => activeSection === 'complaints' ? handleResolveComplaint(ticket.id) : handleResolveSupportRequest(ticket.id)}
                                                disabled={resolvingId === ticket.id}
                                                className="btn-primary text-sm py-1.5 px-4 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {resolvingId === ticket.id ? (
                                                    <>
                                                        <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                        Resolving...
                                                    </>
                                                ) : 'Mark Resolved'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
