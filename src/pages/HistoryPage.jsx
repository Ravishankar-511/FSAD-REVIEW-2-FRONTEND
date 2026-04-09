// src/pages/HistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HistoryPage = () => {
    const navigate = useNavigate();
    const [bookingHistory, setBookingHistory] = useState([]);

    // Get current user details (used to fetch the correct user's history)
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    // Load history when the component mounts
    useEffect(() => {
        // Ensure we are in the browser and the user is logged in
        if (typeof window !== 'undefined' && currentUser && currentUser.email) {
            // The key is unique to the logged-in user's email
            const key = `bookingHistory_${currentUser.email}`;
            const history = JSON.parse(localStorage.getItem(key) || '[]');
            setBookingHistory(history);
        }
    }, [currentUser]);

    // --- Access Control Check ---
    if (!currentUser) {
        return (
            <div className="main-content" style={{ textAlign: 'center', padding: '50px' }}>
                <h2 style={{ color: 'red' }}>Access Denied</h2>
                <p>Please Sign In to view your booking history.</p>
                <button onClick={() => navigate('/signin')} className="signin-btn" style={{ marginTop: '20px' }}>
                    Sign In Now
                </button>
            </div>
        );
    }
    
    // --- Render History ---
    return (
        <div className="main-content" style={{ maxWidth: '900px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', margin: '20px 0' }}>
                Booking History
            </h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>
                Review your past services booked via your account ({currentUser.email}).
            </p>

            {bookingHistory.length === 0 ? (
                <div style={{ padding: '50px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <p style={{ fontSize: '18px', color: '#666' }}>You have no previous bookings yet. Start hiring today!</p>
                    <button onClick={() => navigate('/')} className="signin-btn" style={{ backgroundColor: '#007bff', marginTop: '20px' }}>
                        Browse Professionals
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {/* Display cards in reverse order (newest first) */}
                    {bookingHistory.slice().reverse().map((booking, index) => (
                        <div key={index} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            
                            <div style={{ flexGrow: 1 }}>
                                <p style={{ margin: '0 0 5px', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{booking.proName} ({booking.service})</p>
                                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Date Booked: {booking.date}</p>
                            </div>
                            
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: '0 0 5px', fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>₹{booking.rate}</p>
                                <span style={{ backgroundColor: '#e2f0d9', color: '#155724', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold' }}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;