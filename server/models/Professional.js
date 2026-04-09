// server/models/Professional.js
const mongoose = require('mongoose');

const ProfessionalSchema = new mongoose.Schema({
    // Removed the 'id' field here, MongoDB uses '_id' automatically
    name: { type: String, required: true },
    profession: { type: String, required: true },
    rating: { type: Number, default: 5.0 },
    rate: { type: Number, required: true },
    desc: { type: String, required: true },
    location: { type: String, default: 'Unspecified' }, // Set default location here
    skills: { type: [String], default: [] },
    isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model('Professional', ProfessionalSchema);