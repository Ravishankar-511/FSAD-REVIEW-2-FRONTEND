// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Header = () => {
    const navigate = useNavigate();
    const { logout } = useApp();
    
    // State to hold the logged-in user data
    const [currentUser, setCurrentUser] = useState(null);

    // Check for user session when component mounts
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSignOut = () => {
        logout(); // Clear session from context
        setCurrentUser(null); // Clear local state
        alert("You have been signed out.");
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-md">
            <Link to="/" className="app-title">
                Service Connect
            </Link>
            <div className="nav-links flex gap-4 items-center">
                
                {/* Link for Professional Registration (Always visible utility link) */}
                <Link 
                    to="/join-professional" 
                    className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-300"
                >
                    Join as Professional
                </Link>

                {currentUser && currentUser.isLoggedIn ? (
                    // Display links and user profile when logged in
                    <>
                        {/* Utility Links for Logged-In User */}
                        <Link 
                            to="/history" 
                            className="text-slate-600 hover:text-slate-800 font-semibold transition-colors duration-300"
                        >
                            <span title="Booking History">🕒 History</span>
                        </Link>
                        
                        <Link 
                            to="/favorites" 
                            className="text-slate-600 hover:text-slate-800 font-semibold transition-colors duration-300"
                        >
                            ❤️ Favorites
                        </Link>

                        {/* User Display and Sign Out Button */}
                        <span className="font-semibold text-slate-800">
                            Hello, {currentUser.name.split(' ')[0]} 👋
                        </span>
                        <button 
                            onClick={handleSignOut} 
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    // Display Sign In / Register link when logged out
                    <Link 
                        to="/signin" 
                        className="signin-btn"
                    >
                        Sign In / Register
                    </Link>
                )}
            </div>
        </header>
    );
};
export default Header;