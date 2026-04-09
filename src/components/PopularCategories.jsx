// src/components/PopularCategories.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Component receives setter functions as props
const PopularCategories = ({ setSelectedProfession, setSearchTerm }) => {
    const navigate = useNavigate();
    
    // Static list of top categories
    const categories = [
        { name: 'Web Developer', emoji: '💻' },
        { name: 'Plumber', emoji: '🛠️' },
        { name: 'Electrician', emoji: '⚡' },
        
        // 👈 ALL NEW POPULAR CATEGORIES
        { name: 'Appliance Technician', emoji: '⚙️' }, 
        { name: 'Deep Cleaner', emoji: '🧼' }, 
        { name: 'Car Mechanic', emoji: '🚗' }, 
        { name: 'Graphic Designer', emoji: '🎨' },
    ];

    const handleCategoryClick = (categoryName) => {
        setSelectedProfession(categoryName); 
        setSearchTerm(''); 
        navigate('/');
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    return (
        <section className="category-section">
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
                Most Popular Categories
            </h2>
            <div className="category-list">
                {categories.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => handleCategoryClick(category.name)}
                        className="category-button"
                    >
                        <span style={{ fontSize: '24px', marginRight: '8px' }}>{category.emoji}</span>
                        {category.name}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default PopularCategories;