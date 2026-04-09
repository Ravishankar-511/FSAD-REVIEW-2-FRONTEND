// src/data.js

// Final comprehensive static data list (Mock database)
export const staticProfessionalsData = [
  // --- Updated with all previous professions and required fields ---
  { id: 1, name: "Rohan Sharma", profession: "Plumber", rating: 4.8, rate: 500, desc: "Certified and insured plumber for fast leak repair and bathroom fittings.", image: "https://images.unsplash.com/photo-1549045337-ee4795e1e5e6?w=400&auto-format&fit=crop", location: "Mumbai", skills: ["Leak Repair", "Bathroom Fitting", "Water Heater"], isVerified: true, isAvailable: true, reviews: 25 },
  { id: 2, name: "Priya Patel", profession: "Web Developer", rating: 4.5, rate: 800, desc: "Specializes in React, modern front-end frameworks, and responsive design.", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9d91?w=400&auto-format&fit=crop", location: "Bangalore", skills: ["React", "JavaScript", "Redux"], isVerified: true, isAvailable: true, reviews: 45 },
  { id: 3, name: "Arjun Singh", profession: "Electrician", rating: 4.9, rate: 650, desc: "Licensed master electrician for commercial wiring, panel upgrades, and installations.", image: "https://images.unsplash.com/photo-1581092651631-f12745300b65?w=400&auto-format&fit=crop", location: "Delhi", skills: ["Wiring", "Panel Upgrade", "Lighting"], isVerified: false, isAvailable: true, reviews: 10 },
  { id: 4, name: "Meera Das", profession: "Photographer", rating: 4.6, rate: 1200, desc: "Experienced in wedding, portrait, and commercial photography with fast turnaround.", image: "https://images.unsplash.com/photo-1502982899975-ad9924921357?w=400&auto-format&fit=crop", location: "Mumbai", skills: ["Weddings", "Portraits", "Commercial"], isVerified: true, isAvailable: false, reviews: 55 },
  { id: 5, name: "Kiran Rao", profession: "Plumber", rating: 4.1, rate: 450, desc: "Expert in leak detection and bathroom remodels. Reliable and clean service.", image: "https://images.unsplash.com/photo-1563854898150-1372d89b1418?w=400&auto-format&fit=crop", location: "Chennai", skills: ["Leak Detection", "Pipe Fixing"], isVerified: false, isAvailable: true, reviews: 30 },
  { id: 6, name: "Sneha Varma", profession: "Web Developer", rating: 4.7, rate: 950, desc: "Full-stack developer with expertise in Node.js and MongoDB.", image: "https://images.unsplash.com/photo-1504868584819-5991c0157404?w=400&auto-format&fit=crop", location: "Hyderabad", skills: ["Node.js", "MongoDB", "Vue"], isVerified: true, isAvailable: true, reviews: 60 },
  { id: 7, name: "Jai Kumar", profession: "Electrician", rating: 4.3, rate: 550, desc: "Residential electrical panel upgrades and smart home installations.", image: "https://images.unsplash.com/photo-1582234057973-19e8f1f7d1a?w=400&auto-format&fit=crop", location: "Delhi", skills: ["Home Wiring", "Switches", "Installation"], isVerified: false, isAvailable: false, reviews: 22 },
  { id: 8, name: "Tanya Iyer", profession: "Photographer", rating: 5.0, rate: 1500, desc: "Highly rated commercial photographer specializing in product and brand imagery.", image: "https://images.unsplash.com/photo-1510100764720-6d45903b41e8?w=400&auto-format&fit=crop", location: "Bangalore", skills: ["Products", "Branding", "Events"], isVerified: true, isAvailable: true, reviews: 75 },
  { id: 13, name: "Suresh Yadav", profession: "Carpenter", rating: 4.2, rate: 750, desc: "Expert in custom furniture building, repair, and modular kitchen installation.", image: "https://images.unsplash.com/photo-1518716298516-43187654a1a6?w=400&auto-format&fit=crop", location: "Bangalore", skills: ["Furniture", "Modular Kitchen", "Woodwork"], isVerified: true, isAvailable: true, reviews: 18 },
  { id: 17, name: "Ayesha Das", profession: "Fitness Trainer", rating: 5.0, rate: 1000, desc: "Personalized fitness and yoga instruction for weight loss and flexibility.", image: "https://images.unsplash.com/photo-1599058917215-6258c7075c7e?w=400&auto-format&fit=crop", location: "Delhi", skills: ["Yoga", "Weight Loss", "Nutrition"], isVerified: true, isAvailable: true, reviews: 80 },
  { id: 20, name: "Imran Siddiqui", profession: "Accountant", rating: 4.9, rate: 1800, desc: "Consultant for GST filing, tax preparation, and small business accounting.", image: "https://images.unsplash.com/photo-1554224155-7aee8ae7ae0a?w=400&auto-format&fit=crop", location: "Remote", skills: ["GST", "Tax Filing", "Bookkeeping"], isVerified: true, isAvailable: true, reviews: 95 },
  { id: 22, name: "Kabir Verma", profession: "Digital Marketing Expert", rating: 4.7, rate: 1300, desc: "Specializes in social media marketing, PPC campaigns, and SEO strategy.", image: "https://images.unsplash.com/photo-1557835334-1188310f845a?w=400&auto-format&fit=crop", location: "Bangalore", skills: ["SEO", "PPC", "Social Media"], isVerified: true, isAvailable: true, reviews: 65 },
];

export function getAllProfessionals() {
    if (typeof window === 'undefined') {
        return staticProfessionalsData;
    }
    const savedData = localStorage.getItem('newProfessionals');
    const newProfessionals = savedData ? JSON.parse(savedData) : [];
    
    // Add defaults to new entries for consistency
    const combinedList = [...staticProfessionalsData, ...newProfessionals.map(p => ({
        ...p,
        location: p.location || 'Local',
        skills: p.skills || [p.profession],
        isVerified: p.isVerified || false,
        isAvailable: p.isAvailable || true,
        reviews: p.reviews || 0,
    }))];

    // Ensure IDs are unique and return
    const finalMap = new Map();
    combinedList.forEach(p => {
        finalMap.set(`${p.id}-${p.name}`, p);
    });

    return Array.from(finalMap.values());
}

// Static list of possible cities for the Autocomplete
export const availableCities = ['Mumbai', 'Bangalore', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Remote'];