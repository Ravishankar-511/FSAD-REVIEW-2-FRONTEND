// src/pages/JoinProfessional.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Helper function for basic email format validation
const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
};

const JoinProfessional = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', profession: '', rate: '', desc: '', email: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({}); // State for validation errors

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear the specific error for the field as the user types
        setErrors(prev => ({ ...prev, [e.target.name]: null })); 
    };

    const runValidation = () => {
        let currentErrors = {};
        
        // 1. Name validation
        if (formData.name.length < 3) {
            currentErrors.name = "Full Name is required (Min 3 chars).";
        }
        
        // 2. Email validation
        if (!validateEmail(formData.email)) {
            currentErrors.email = "Invalid email format.";
        }
        
        // 3. Profession validation
        if (!formData.profession) {
            currentErrors.profession = "Please select a profession.";
        }
        
        // 4. Rate validation (IMPROVED: Handles empty string and ensures positive number)
        const rate = parseFloat(formData.rate);
        if (formData.rate === '') {
             currentErrors.rate = "Hourly Rate is required.";
        } else if (isNaN(rate) || rate <= 0) {
            currentErrors.rate = "Rate must be a positive number (₹).";
        }
        
        // 5. Description validation
        if (formData.desc.length < 20) {
            currentErrors.desc = `Description must be at least 20 characters. (Current: ${formData.desc.length})`;
        }
        
        setErrors(currentErrors);
        // The form is valid only if the collected errors object is empty
        return Object.keys(currentErrors).length === 0;
    };

    const handleSubmit = async (e) => { // 👈 API Submission requires ASYNC
        e.preventDefault();
        
        // 1. Run full validation check
        if (!runValidation()) {
            return;
        }
        
        setIsLoading(true);

        // 2. Create the new professional object (formatted for MongoDB Schema)
        const newProfessional = {
            name: formData.name,
            profession: formData.profession,
            rate: parseInt(formData.rate), 
            desc: formData.desc,
            rating: 5.0, // Default rating for new professional
            image: "https://images.unsplash.com/photo-1520607162513-7740e53a2c57?w=400&auto-format&fit=crop", 
            skills: [], 
            location: "Unspecified", 
            isVerified: false, 
        };

        try {
            // 3. API CALL: Send new professional data to Express server
            const response = await fetch('http://localhost:5000/api/professionals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProfessional),
            });

            if (!response.ok) {
                // If API fails, throw error to trigger catch block
                throw new Error('Failed to register professional via API.');
            }

            // 4. Success Feedback and Redirect
            alert(`Success! ${newProfessional.name} is now registered in the cloud database!`);
            
            // Navigate and refresh to show the newly added professional immediately
            navigate('/');
            window.location.reload(); 

        } catch (error) {
            console.error("API Submission Failed. Ensure backend server is running.", error);
            alert("Submission failed. Ensure backend server is running on port 5000.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = { 
        padding: '12px', border: '1px solid', borderRadius: '5px', marginBottom: '5px', 
        width: '100%', boxSizing: 'border-box'
    };
    
    // Determine if the submit button should be disabled
    const isSubmitDisabled = isLoading || Object.keys(errors).some(key => errors[key] !== null);

    return (
        <div className="signin-page-container">
            <div className="signin-form-box">
                <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Join Our Network</h2>
                <p style={{ color: '#666', marginBottom: '25px' }}>Register your services to connect with clients.</p>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    
                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} onBlur={runValidation} style={{ ...inputStyle, borderColor: errors.name ? 'red' : '#ccc' }} />
                    {errors.name && <p style={{ color: 'red', fontSize: '12px', margin: '0 0 10px 0' }}>{errors.name}</p>}

                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} onBlur={runValidation} style={{ ...inputStyle, borderColor: errors.email ? 'red' : '#ccc' }} />
                    {errors.email && <p style={{ color: 'red', fontSize: '12px', margin: '0 0 10px 0' }}>{errors.email}</p>}
                    
                    <select name="profession" value={formData.profession} onChange={handleChange} onBlur={runValidation} style={{ ...inputStyle, borderColor: errors.profession ? 'red' : '#ccc' }}>
                        <option value="">Select Profession</option>
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
                    {errors.profession && <p style={{ color: 'red', fontSize: '12px', margin: '0 0 10px 0' }}>{errors.profession}</p>}
                    
                    <input type="number" name="rate" placeholder="Hourly Rate (₹)" value={formData.rate} onChange={handleChange} onBlur={runValidation} style={{ ...inputStyle, borderColor: errors.rate ? 'red' : '#ccc' }} />
                    {errors.rate && <p style={{ color: 'red', fontSize: '12px', margin: '0 0 10px 0' }}>{errors.rate}</p>}

                    <textarea name="desc" placeholder="Brief Bio / Description (Min 20 chars)" value={formData.desc} onChange={handleChange} onBlur={runValidation} rows="4" style={{ ...inputStyle, borderColor: errors.desc ? 'red' : '#ccc' }}></textarea>
                    {errors.desc && <p style={{ color: 'red', fontSize: '12px', margin: '0 0 10px 0' }}>{errors.desc}</p>}
                    
                    <button 
                        type="submit" 
                        className="signin-submit-btn"
                        disabled={isSubmitDisabled} 
                        style={{ opacity: isSubmitDisabled ? 0.7 : 1, marginTop: '15px' }}
                    >
                        {isLoading ? 'Processing...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default JoinProfessional;