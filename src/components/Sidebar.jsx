import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const roleNavItems = {
    admin: [
        { label: 'Dashboard', icon: '📊', path: '/admin' },
        { label: 'Users', icon: '👥', path: '/admin/users' },
        { label: 'Professionals', icon: '🛠️', path: '/admin/professionals' },
        { label: 'Categories', icon: '🗂️', path: '/admin/categories' },
    ],
    professional: [
        { label: 'Dashboard', icon: '📊', path: '/professional' },
        { label: 'My Profile', icon: '👤', path: '/professional/profile' },
        { label: 'Services', icon: '🔧', path: '/professional/services' },
        { label: 'Requests', icon: '📋', path: '/professional/requests' },
    ],
    user: [
        { label: 'Dashboard', icon: '🏠', path: '/user' },
        { label: 'Find Professionals', icon: '🔍', path: '/user/find' },
        { label: 'My Requests', icon: '📋', path: '/user/requests' },
        { label: 'Support', icon: '🎫', path: '/user/support' },
    ],
    support: [
        { label: 'Dashboard', icon: '📊', path: '/support' },
        { label: 'All Tickets', icon: '🎫', path: '/support' },
    ],
};

const roleColors = {
    admin: 'from-purple-600 to-purple-700',
    professional: 'from-green-600 to-green-700',
    user: 'from-blue-600 to-blue-700',
    support: 'from-orange-500 to-orange-600',
};

const roleLabels = {
    admin: 'Admin Portal',
    professional: 'Pro Portal',
    user: 'User Portal',
    support: 'Support Portal',
};

export default function Sidebar({ open, onClose, role }) {
    const navigate = useNavigate();
    const { logout } = useApp();
    const items = roleNavItems[role] || [];
    const current = window.location.pathname;

    const handleNav = (path) => {
        navigate(path);
        onClose?.();
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        onClose?.();
    };

    return (
        <aside
            className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl border-r border-gray-100
        transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:z-auto
        flex flex-col
      `}
        >
            {/* Brand */}
            <div className={`bg-gradient-to-br ${roleColors[role] || 'from-green-600 to-green-700'} p-5`}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg">W</div>
                    <div>
                        <h1 className="text-white font-bold text-lg leading-tight">WorkSphere</h1>
                        <p className="text-white/70 text-xs">{roleLabels[role]}</p>
                    </div>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {items.map((item) => {
                    const isActive = current === item.path || (item.path !== '/' && current.startsWith(item.path + '/'));
                    return (
                        <button
                            key={item.path}
                            onClick={() => handleNav(item.path)}
                            className={isActive ? 'sidebar-link-active w-full text-left' : 'sidebar-link-inactive w-full text-left'}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                    <span className="text-lg">🚪</span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
