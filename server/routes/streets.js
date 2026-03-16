const express = require('express');
const router = express.Router();
const Street = require('../models/Street');

// GET distinct cities
router.get('/cities', async (req, res) => {
  try {
    const cities = await Street.distinct('cityName');
    cities.sort((a, b) => a.localeCompare(b, 'he'));
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET streets for a city
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.json([]);
    const streets = await Street.find({ cityName: city }).select('streetName -_id').sort({ streetName: 1 });
    res.json(streets.map(s => s.streetName));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
