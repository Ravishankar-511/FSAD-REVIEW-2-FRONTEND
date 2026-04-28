// src/components/Footer.jsx
import React from 'react';
import { getAllProfessionals } from '../data.js';

const Footer = () => {
    // Dynamically calculate the total count
    // Using try-catch as a final safety net against data loading errors
    let totalCount = 0;
    try {
        totalCount = getAllProfessionals().length;
    } catch (e) {
        console.error("Footer data load failed:", e);
    }

    return (
        <footer style={{ 
            backgroundColor: 'var(--text)', 
            color: 'white', 
            textAlign: 'center', 
            padding: '15px 0', 
            marginTop: '50px',
            fontSize: '14px'
        }}>
            <p style={{ margin: '0' }}>
                &copy; {new Date().getFullYear()} WorkSphere. Part of a trusted network of {totalCount}+ experts.
            </p>
        </footer>
    );
};

export default Footer;