// server/routes/professionals.js
const express = require('express');
const router = express.Router();
const Professional = require('../models/Professional');

// GET /api/professionals: Fetch ALL professionals
router.get('/', async (req, res) => {
    try {
        const professionals = await Professional.find();
        res.json(professionals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/professionals: Add a new professional (for registration)
router.post('/', async (req, res) => {
    try {
        const newProfessional = new Professional(req.body);
        const professional = await newProfessional.save();
        res.status(201).json(professional);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;