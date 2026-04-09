// src/pages/DashboardPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!currentUser) {
        navigate('/signin');
        return null;
    }

    return (
        <div className="main-content" style={{ textAlign: 'center', padding: '50px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
                Welcome to Your Dashboard, {currentUser.name.split(' ')[0]}!
            </h1>
            <p style={{ color: '#666', marginTop: '15px' }}>
                This confirms the Dashboard page is correctly routed.
            </p>
            <button onClick={() => navigate('/history')} className="signin-btn" style={{ backgroundColor: '#28a745', marginTop: '30px' }}>
                View Booking History
            </button>
        </div>
    );
};

export default DashboardPage;