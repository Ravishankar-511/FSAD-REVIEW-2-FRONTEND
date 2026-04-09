// src/pages/SignIn.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Helper function for basic email format validation
const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
};

const SignIn = () => {
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false); 
    const [errors, setErrors] = useState({}); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({}); // Clear errors as user types
    };

    const runValidation = () => {
        let currentErrors = {};
        if (!validateEmail(formData.email)) {
            currentErrors.email = "Invalid email format.";
        }
        if (formData.password.length < 6) {
            currentErrors.password = "Password must be at least 6 characters.";
        }
        if (isRegistering && formData.name.length < 3) {
            currentErrors.name = "Full Name is required.";
        }
        setErrors(currentErrors);
        return Object.keys(currentErrors).length === 0;
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (!runValidation()) return;
        
        setIsLoading(true); // Start loading
        
        setTimeout(() => { // Simulate network delay
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === formData.email && u.password === formData.password);

            setIsLoading(false); // Stop loading

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify({ name: user.name, isLoggedIn: true, email: user.email }));
                alert(`Welcome back, ${user.name}! Successfully signed in.`);
                navigate('/');
                window.location.reload(); 
            } else {
                alert("Login failed. User not found or incorrect credentials. Directing to registration.");
                setIsRegistering(true); 
            }
        }, 800); 
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (!runValidation()) return;
        
        setIsLoading(true); // Start loading

        setTimeout(() => { // Simulate network delay
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            if (users.some(u => u.email === formData.email)) {
                setIsLoading(false);
                alert("Error: A user with this email already exists. Please sign in.");
                setIsRegistering(false);
                return;
            }

            const newUser = { name: formData.name, email: formData.email, password: formData.password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify({ name: newUser.name, isLoggedIn: true, email: newUser.email }));
            
            setIsLoading(false); // Stop loading

            alert(`Registration successful! Welcome, ${newUser.name}. You are now signed in.`);
            navigate('/');
            window.location.reload(); 
        }, 1000);
    };

    const commonInputStyle = { 
        width: '100%', padding: '12px', marginBottom: '5px', border: '1px solid',
        borderColor: '#ccc', borderRadius: '5px', boxSizing: 'border-box'
    };
    
    // Determine if the submit button should be disabled
    const isSubmitDisabled = isLoading || Object.keys(errors).length > 0;

    return (
        <div className="signin-page-container">
            <div className="signin-form-box">
                <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                    {isRegistering ? 'Register as Client' : 'Sign In'}
                </h2>
                <p style={{ color: '#666', marginBottom: '25px' }}>
                    {isRegistering ? 'Create your new account.' : 'Access your client account.'}
                </p>
                
                <form onSubmit={isRegistering ? handleRegister : handleLogin} 
                      style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    
                    {isRegistering && (
                        <>
                            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} style={commonInputStyle} required />
                            {errors.name && <p style={{ color: 'red', fontSize: '12px', margin: '0 0 10px 0' }}>{errors.name}</p>}
                        </>
                    )}

                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} style={{ ...commonInputStyle, borderColor: errors.email ? 'red' : '#ccc' }} required />
                    {errors.email && <p style={{ color: 'red', fontSize: '12px', margin: '0 0 10px 0' }}>{errors.email}</p>}
                    
                    <input type="password" name="password" placeholder="Password (min 6 chars)" value={formData.password} onChange={handleChange} style={{ ...commonInputStyle, borderColor: errors.password ? 'red' : '#ccc' }} required />
                    {errors.password && <p style={{ color: 'red', fontSize: '12px', margin: '0 0 10px 0' }}>{errors.password}</p>}
                    
                    <button type="submit" className="signin-submit-btn" style={{ marginTop: '10px', opacity: isSubmitDisabled ? 0.7 : 1 }} disabled={isSubmitDisabled}>
                        {isLoading ? 'Processing...' : (isRegistering ? 'Register & Sign In' : 'Sign In')}
                    </button>
                </form>
                
                <p style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
                    {isRegistering ? 'Already have an account? ' : 'Not a client yet? '}
                    <button 
                        onClick={() => setIsRegistering(!isRegistering)} 
                        style={{ background: 'none', border: 'none', color: '#007bff', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
                        disabled={isLoading}
                    >
                        {isRegistering ? 'Sign In' : 'Register Now'}
                    </button>
                </p>
            </div>
        </div>
    );
};
export default SignIn;