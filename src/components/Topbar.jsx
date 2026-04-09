import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const roleBadgeColors = {
    admin: 'bg-purple-100 text-purple-700',
    professional: 'bg-green-100 text-green-700',
    user: 'bg-blue-100 text-blue-700',
    support: 'bg-orange-100 text-orange-700',
};

export default function Topbar({ onMenuClick, title }) {
    const { role } = useApp();
    const navigate = useNavigate();

    return (
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
            <div className="flex items-center gap-4">
                {/* Mobile hamburger */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                    aria-label="Open sidebar"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>

            <div className="flex items-center gap-3">
                {/* Role badge */}
                <span className={`badge text-xs font-semibold capitalize px-3 py-1 rounded-full ${roleBadgeColors[role] || 'bg-gray-100 text-gray-700'}`}>
                    {role}
                </span>

                {/* Notification bell */}
                <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer">
                    {role ? role[0].toUpperCase() : 'U'}
                </div>
            </div>
        </header>
    );
}
