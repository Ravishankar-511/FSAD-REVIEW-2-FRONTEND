// src/pages/FavoritesPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllProfessionals } from '../data.js';
import StarRating from '../components/StarRating.jsx';

const FavoritesPage = () => {
    const navigate = useNavigate();
    const [allProfessionals] = useState(getAllProfessionals());
    const [favoriteIds, setFavoriteIds] = useState([]);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    useEffect(() => {
        if (currentUser && currentUser.email) {
            if (typeof window !== 'undefined') {
                const favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.email}`) || '[]');
                setFavoriteIds(favorites);
            }
        }
    }, [currentUser]);

    const favoritedProfessionals = useMemo(() => {
        return allProfessionals.filter(p => favoriteIds.includes(p.id));
    }, [allProfessionals, favoriteIds]);

    const handleRemoveFavorite = (proId) => {
        if (!currentUser) return; 

        const updatedFavorites = favoriteIds.filter(id => id !== proId);
        localStorage.setItem(`favorites_${currentUser.email}`, JSON.stringify(updatedFavorites));
        
        setFavoriteIds(updatedFavorites);
        alert("Professional removed from your favorites.");
    };

    if (!currentUser) {
        return (
            <div className="main-content" style={{ textAlign: 'center', padding: '50px' }}>
                <h2 style={{ color: 'red' }}>Access Denied</h2>
                <p>Please Sign In to view your saved favorites.</p>
                <button onClick={() => navigate('/signin')} className="signin-btn" style={{ marginTop: '20px' }}>
                    Sign In Now
                </button>
            </div>
        );
    }
    
    return (
        <div className="main-content">
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', margin: '20px 0' }}>
                My Saved Professionals ({favoritedProfessionals.length})
            </h1>

            {favoritedProfessionals.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '18px', color: '#666', marginTop: '50px' }}>
                    You have no saved professionals. Go back to the search page to add some!
                </p>
            ) : (
                <section className="results-grid">
                    {favoritedProfessionals.map(p => (
                         <div key={p.id} className="professional-card" style={{ position: 'relative' }}>
                             
                            {/* 👈 UPDATED REMOVE FAVORITE BUTTON (SVG) */}
                            <button 
                                onClick={() => handleRemoveFavorite(p.id)}
                                style={{ 
                                    position: 'absolute', 
                                    top: '10px', 
                                    right: '10px', 
                                    background: 'white', 
                                    borderRadius: '50%', 
                                    width: '40px', 
                                    height: '40px', 
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: '1px solid #ddd', 
                                    cursor: 'pointer', 
                                    zIndex: 10,
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)', 
                                    transition: 'background-color 0.2s, border-color 0.2s',
                                }}
                                title="Remove from Favorites"
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 24 24" 
                                    fill="#dc3545" // Always red for 'remove' on this page
                                    width="24px" 
                                    height="24px"
                                >
                                    {/* Using a solid heart for 'removed' state on this page, or a trash can if preferred */}
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </button>
                            
                            {/* Card Link */}
                            <Link to={`/professional/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="card-content">
                                    
                                    {/* Top Line (Icon, Name, Profession) */}
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                        <span style={{ fontSize: '30px', marginRight: '10px', color: '#007bff' }}>👤</span> 
                                        <div>
                                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0' }}>{p.name}</h3>
                                            <p style={{ color: '#007bff', fontWeight: '600', fontSize: '14px', margin: '0' }}>{p.profession}</p>
                                        </div>
                                        {/* Verified Badge Simulation */}
                                        {p.isVerified && (
                                            <span title="Verified Professional" style={{ color: '#28a745', marginLeft: '10px', fontSize: '20px' }}>
                                                ✓
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Skills Tags */}
                                    <div style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                        {p.skills.slice(0, 3).map(skill => (
                                            <span key={skill} style={{ backgroundColor: '#f0f0f0', color: '#555', padding: '3px 8px', borderRadius: '3px', fontSize: '12px' }}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    
                                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>{p.desc}</p>

                                    {/* Details (Rating and Price) */}
                                    <div className="card-details" style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <StarRating rating={p.rating} />
                                            <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>({p.rating})</p>
                                        </div>
                                        <p style={{ margin: 0 }}>💰 ₹{p.rate}/hr</p> 
                                    </div>
                                    
                                    <button className="hire-btn" style={{ marginTop: '15px', backgroundColor: '#3498db' }}>
                                        View Profile
                                    </button>
                                </div>
                            </Link>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
};

export default FavoritesPage;