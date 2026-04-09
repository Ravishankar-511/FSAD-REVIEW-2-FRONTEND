// src/pages/SupportPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SupportPage = () => {
    // Mock data for FAQ
    const faqData = [
        { question: "Are the professionals verified?", answer: "Yes, all verified professionals (marked with a ✓) have passed a background check and ID verification." },
        { question: "How does the payment simulation work?", answer: "Payment is simulated using the UPI QR code. No real transaction occurs in this prototype." },
        { question: "Can I get a refund?", answer: "For the prototype, all bookings are final. In a live system, refunds would be handled by the platform." },
    ];

    return (
        <div className="main-content" style={{ maxWidth: '900px', padding: '40px 0' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#333', marginBottom: '30px' }}>
                Help Center & FAQs
            </h1>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                {faqData.map((item, index) => (
                    <div key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff', margin: '0 0 5px' }}>
                            {item.question}
                        </h3>
                        <p style={{ color: '#555', margin: 0 }}>
                            {item.answer}
                        </p>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <p style={{ fontWeight: 'bold' }}>Need direct help?</p>
                <Link to="/" className="signin-btn" style={{ backgroundColor: '#dc3545', padding: '10px 20px' }}>
                    Contact Support (Mock Link)
                </Link>
            </div>
        </div>
    );
};

export default SupportPage;