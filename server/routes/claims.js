const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Claim = require('../models/Claim');

// Multer config - save photos to /uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'uploads'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET search claims via Atlas Search
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q;
    if (!q || q.trim().length === 0) return res.json([]);

    const results = await Claim.aggregate([
      {
        $search: {
          index: 'claims_search',
          compound: {
            should: [
              { text: { query: q, path: 'claimantName', fuzzy: { maxEdits: 1 } } },
              { text: { query: q, path: 'idNumber' } },
              { text: { query: q, path: 'phone' } },
              { text: { query: q, path: 'details.city', fuzzy: { maxEdits: 1 } } },
              { text: { query: q, path: 'details.street', fuzzy: { maxEdits: 1 } } },
              { text: { query: q, path: 'details.damageDescription', fuzzy: { maxEdits: 1 } } },
              { text: { query: q, path: 'details.injuryDescription', fuzzy: { maxEdits: 1 } } },
              { text: { query: q, path: 'details.businessName', fuzzy: { maxEdits: 1 } } },
              { text: { query: q, path: 'details.businessType', fuzzy: { maxEdits: 1 } } },
              { text: { query: q, path: 'details.carMake', fuzzy: { maxEdits: 1 } } },
              { text: { query: q, path: 'details.licensePlate' } },
              { text: { query: q, path: 'details.insuranceCompany', fuzzy: { maxEdits: 1 } } },
              { text: { query: q, path: 'details.medicalInstitution', fuzzy: { maxEdits: 1 } } },
              { text: { query: q, path: 'details.injuryType', fuzzy: { maxEdits: 1 } } },
            ]
          }
        }
      },
      { $addFields: { score: { $meta: 'searchScore' } } },
      { $sort: { score: -1 } },
      { $limit: 50 }
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET stats for dashboard
router.get('/stats', async (req, res) => {
  try {
    const [total, byType, byStatus] = await Promise.all([
      Claim.countDocuments(),
      Claim.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
      Claim.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
    ]);
    res.json({
      total,
      byType: Object.fromEntries(byType.map(t => [t._id, t.count])),
      byStatus: Object.fromEntries(byStatus.map(s => [s._id, s.count]))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all claims (optional ?type= filter)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    const claims = await Claim.find(filter).sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single claim
router.get('/:id', async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ error: 'Claim not found' });
    res.json(claim);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create claim
router.post('/', async (req, res) => {
  try {
    const claim = new Claim(req.body);
    await claim.save();
    res.status(201).json(claim);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update claim
router.put('/:id', async (req, res) => {
  try {
    const claim = await Claim.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!claim) return res.status(404).json({ error: 'Claim not found' });
    res.json(claim);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST upload photos for a claim
router.post('/:id/photos', upload.array('photos', 10), async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ error: 'Claim not found' });
    const urls = req.files.map(f => `/uploads/${f.filename}`);
    claim.photos.push(...urls);
    await claim.save();
    res.json(claim);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
