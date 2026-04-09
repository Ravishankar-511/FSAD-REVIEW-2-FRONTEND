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
        <header className="app-header">
            <Link to="/" className="app-title">
                ProFinder
            </Link>
            <div className="nav-links" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                
                {/* Link for Professional Registration (Always visible utility link) */}
                <Link 
                    to="/join-professional" 
                    style={{ textDecoration: 'none', color: '#007bff', padding: '8px 0', fontWeight: 'bold' }}
                >
                    Join as Professional
                </Link>

                {currentUser && currentUser.isLoggedIn ? (
                    // Display links and user profile when logged in
                    <>
                        {/* Utility Links for Logged-In User */}
                        <Link 
                            to="/history" 
                            style={{ textDecoration: 'none', color: '#333', padding: '8px 0', fontWeight: 'bold' }}
                        >
                            <span title="Booking History">🕒 History</span>
                        </Link>
                        
                        <Link 
                            to="/favorites" 
                            style={{ textDecoration: 'none', color: '#333', padding: '8px 0', fontWeight: 'bold' }}
                        >
                            ❤️ Favorites
                        </Link>

                        {/* User Display and Sign Out Button */}
                        <span style={{ fontWeight: 'bold', color: '#333', marginLeft: '10px' }}>
                            Hello, {currentUser.name.split(' ')[0]} 👋
                        </span>
                        <button 
                            onClick={handleSignOut} 
                            className="signin-btn" 
                            style={{ backgroundColor: '#dc3545', border: '1px solid #dc3545' }}
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