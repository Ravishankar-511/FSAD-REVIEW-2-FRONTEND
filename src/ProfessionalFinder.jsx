import React, { useState, useMemo, useEffect } from 'react';
import { getAllProfessionals, availableCities } from './data.js'; // Fallback and city data
import PopularCategories from './components/PopularCategories.jsx'; 
import { Link } from 'react-router-dom'; 
import StarRating from './components/StarRating.jsx'; 
import useDebounce from './hooks/useDebounce.js';

const ProfessionalFinder = () => {
    // --- STATE MANAGEMENT ---
    // Initialize with local data immediately as the guaranteed fallback
    const [allProfessionals, setAllProfessionals] = useState(getAllProfessionals()); 
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProfession, setSelectedProfession] = useState('');
    const [sortByRating, setSortByRating] = useState(false);
    
    // Filtering States
    const [locationTerm, setLocationTerm] = useState('');
    const [minRating, setMinRating] = useState('0');
    const [minRate, setMinRate] = useState('');
    const [maxRate, setMaxRate] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('');
    
    // Favorites State
    const [favoritesKey, setFavoritesKey] = useState(0); 

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Get current user details and their favorites
    const getCurrentUser = () => {
        const userJson = localStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) : null;
    };
    const currentUser = getCurrentUser();

    // Load favorite IDs from storage
    const favoriteIds = useMemo(() => {
        if (!currentUser || !currentUser.email) return [];
        const key = `favorites_${currentUser.email}`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    }, [currentUser, favoritesKey]);

    // 🚀 API FETCH EFFECT: Try to fetch live data (but the page will already be populated)
    useEffect(() => {
        const fetchProfessionals = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/professionals'); 
                
                if (res.ok) {
                    const data = await res.json();
                    setAllProfessionals(data); 
                }
            } catch (err) {
                console.error("API connection failed. Displaying local mock data as fallback.", err);
                const localData = getAllProfessionals();
                setAllProfessionals(localData);
            }
        };
        fetchProfessionals();
    }, []);

    // --- FAVORITES HANDLER ---
    const handleFavoriteToggle = (e, proId) => {
        e.preventDefault(); 
        e.stopPropagation(); 

        if (!currentUser || !currentUser.email) {
            alert("Please sign in to save favorites.");
            return;
        }
        
        const key = `favorites_${currentUser.email}`;
        let favorites = JSON.parse(localStorage.getItem(key) || '[]');
        
        if (favorites.includes(proId)) {
            favorites = favorites.filter(id => id !== proId);
            alert("Removed from favorites!");
        } else {
            favorites.push(proId);
            alert("Added to favorites! View in My Favorites.");
        }
        localStorage.setItem(key, JSON.stringify(favorites));
        
        setFavoritesKey(prev => prev + 1); 
    };

    // --- UTILITY HANDLERS ---
    
    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedProfession('');
        setLocationTerm('');
        setMinRating('0');
        setMinRate('');
        setMaxRate('');
        setSortByRating(false);
        setAvailabilityFilter('');
    };
    
    const handleClearSearch = () => setSearchTerm('');

    // --- FILTERING LOGIC (useMemo) ---
    const filteredAndSortedProfessionals = useMemo(() => {
        let list = [...allProfessionals]; 
        
        // 1. Search, 2. Profession, 3. Location, 4. Price, 5. Rating, 6. Availability, 7. Sort
        
        const termLower = debouncedSearchTerm.toLowerCase();
        list = list.filter(p => {
            const matchesNamePro = p.name.toLowerCase().includes(termLower) || p.profession.toLowerCase().includes(termLower);
            const matchesDescription = p.desc.toLowerCase().includes(termLower);
            return matchesNamePro || matchesDescription;
        });

        if (selectedProfession) {
            list = list.filter(p => p.profession === selectedProfession);
        }
        
        const locationLower = locationTerm.toLowerCase();
        if (locationLower) {
             list = list.filter(p => p.location && p.location.toLowerCase().includes(locationLower));
        }

        const minR = parseInt(minRate) || 0; 
        const maxR = parseInt(maxRate) || Infinity; 
        list = list.filter(p => p.rate >= minR && p.rate <= maxR);
        
        const requiredRating = parseFloat(minRating);
        list = list.filter(p => p.rating >= requiredRating);
        
        // Availability Filter
        list = list.filter(p => availabilityFilter === '' || (availabilityFilter === 'available' && p.isAvailable));

        if (sortByRating) {
            list.sort((a, b) => b.rating - a.rating);
        }

        return list;
    }, [debouncedSearchTerm, selectedProfession, sortByRating, allProfessionals, minRate, maxRate, locationTerm, minRating, availabilityFilter]);

    // --- Location Autocomplete Simulation ---
    const locationSuggestions = useMemo(() => {
        if (locationTerm.length < 2) return []; 
        const termLower = locationTerm.toLowerCase();
        return availableCities.filter(city => city.toLowerCase().includes(termLower)).slice(0, 5);
    }, [locationTerm]);

    // --- UI RENDER (JSX) ---
    return (
        <main className="main-content">
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '20px', textAlign: 'center' }}>
                Find & Hire the Right Professional
            </h1>
            
            <PopularCategories 
                setSelectedProfession={setSelectedProfession}
                setSearchTerm={setSearchTerm} 
            />

            {/* Controls Section */}
            <section className="controls-section">
                
                {/* Search Bar with Clear Icon */}
                <div style={{ position: 'relative' }} className="search-input-group">
                    <input
                        type="text"
                        placeholder="Search name/profession/keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%' }}
                    />
                    {searchTerm && (
                        <button 
                            onClick={handleClearSearch}
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', padding: '0', cursor: 'pointer' }}
                        >
                            &times;
                        </button>
                    )}
                </div>
                
                {/* Location Filter with Autocomplete */}
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Filter by City/Area..."
                        value={locationTerm}
                        onChange={(e) => setLocationTerm(e.target.value)}
                        style={{ width: '100%' }}
                    />
                    {locationSuggestions.length > 0 && (
                        <div style={{ position: 'absolute', zIndex: 10, background: 'white', border: '1px solid #ccc', borderRadius: '5px', width: '100%', maxHeight: '200px', overflowY: 'auto', marginTop: '5px' }}>
                            {locationSuggestions.map(city => (
                                <div 
                                    key={city} 
                                    onClick={() => { setLocationTerm(city); }}
                                    style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                >
                                    {city}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Profession Filter */}
                <select
                    value={selectedProfession}
                    onChange={(e) => setSelectedProfession(e.target.value)}
                    aria-label="Filter by profession"
                >
                    <option value="">All Services</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Painter">Painter</option>
                    <option value="Cleaner">Cleaner</option>
                    <option value="Tutor">Tutor (Maths/Science)</option>
                    <option value="Music Teacher">Music Teacher</option>
                    <option value="Fitness Trainer">Fitness Trainer</option>
                    <option value="Photographer">Photographer / Videographer</option>
                    <option value="Graphic Designer">Graphic Designer</option>
                    <option value="Web Developer">Web/App Developer</option>
                    <option value="Content Writer">Content Writer</option>
                    <option value="Beautician">Beautician / Makeup artist</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Legal Consultant">Legal Consultant</option>
                    <option value="Digital Marketing Expert">Digital Marketing Expert</option>
                </select>

                {/* Price Range Filters */}
                <input
                    type="number"
                    placeholder="Min Rate (₹)"
                    value={minRate}
                    onChange={(e) => setMinRate(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Rate (₹)"
                    value={maxRate}
                    onChange={(e) => setMaxRate(e.target.value)}
                />
                
                {/* Minimum Rating Filter (Visual options) */}
                <select
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    aria-label="Filter by minimum star rating"
                >
                    <option value="0">Min Rating (Any)</option>
                    <option value="4.5">★★★★★ 4.5 & Up</option>
                    <option value="4.0">★★★★☆ 4.0 & Up</option>
                    <option value="3.5">★★★☆☆ 3.5 & Up</option>
                </select>

                {/* FEATURE: Filter by Availability */}
                <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    aria-label="Filter by availability"
                >
                    <option value="">Availability (Any)</option>
                    <option value="available">Available Now</option>
                </select>

                {/* Sort Button */}
                <button
                    style={{ backgroundColor: sortByRating ? '#28a745' : '#ccc', color: sortByRating ? 'white' : '#333' }}
                    onClick={() => setSortByRating(!sortByRating)}
                >
                    {sortByRating ? 'Rating High ↓' : 'Sort by Rating'}
                </button>
                
                {/* Clear All Filters Button */}
                <button
                    onClick={handleClearFilters}
                    aria-live="polite"
                    style={{ backgroundColor: '#dc3545', color: 'white', fontWeight: 'bold' }}
                >
                    Clear All Filters
                </button>
            </section>

            {/* FEATURE: Filter Count Display */}
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '20px 0 10px', color: '#333' }}>
                Showing {filteredAndSortedProfessionals.length} of {allProfessionals.length} Professionals
            </h2>

            {/* Results Display Section */}
            <section className="results-grid">
                {filteredAndSortedProfessionals.length === 0 ? (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', fontSize: '18px', color: '#666', marginTop: '50px' }}>
                        Sorry, no professionals match your criteria. Try adjusting your search.
                    </p>
                ) : (
                    filteredAndSortedProfessionals.map(p => (
                        <div key={p.id} className="professional-card" style={{ position: 'relative' }}>
                            
                            {/* FAVORITES ICON */}
                            <button
                                onClick={(e) => handleFavoriteToggle(e, p.id)}
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
                                title={favoriteIds.includes(p.id) ? "Remove from Favorites" : "Add to Favorites"}
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 24 24" 
                                    fill={favoriteIds.includes(p.id) ? '#dc3545' : '#ccc'} 
                                    width="24px" 
                                    height="24px"
                                    style={{ 
                                        transition: 'fill 0.2s', 
                                    }}
                                >
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </button>

                            <Link 
                                to={`/professional/${p.id}`} 
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div className="card-content">
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
                                        {/* FEATURE: Availability Dot */}
                                        <span style={{ 
                                            backgroundColor: p.isAvailable ? '#28a745' : '#dc3545', 
                                            width: '10px', height: '10px', borderRadius: '50%', 
                                            marginLeft: '10px', display: 'inline-block' 
                                        }} title={p.isAvailable ? 'Available Now' : 'Currently Booked'}></span>
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
                                    
                                    <div className="card-details" style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <StarRating rating={p.rating} />
                                            <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>({p.rating})</p>
                                        </div>
                                        <p style={{ margin: 0 }}>💰 ₹{p.rate}/hr</p> 
                                    </div>
                                    
                                    <button 
                                        className="hire-btn"
                                        style={{ marginTop: '15px', backgroundColor: '#3498db' }}
                                    >
                                        View Profile & Book
                                    </button>
                                </div>
                            </Link>
                        </div>
                    ))
                )}
            </section>
        </main>
    );
};

export default ProfessionalFinder;