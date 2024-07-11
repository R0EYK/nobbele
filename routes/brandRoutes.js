// brandRoutes.js

const express = require('express');
const router = express.Router();
const Brand = require('../models/brandModel');
// Route to fetch a list of brands
router.get('/list', async (req, res) => {
    try {
        const brands = await Brand.find();
        res.json(brands);
    } catch (err) {
        console.error('Error fetching brands:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});


module.exports = router;
