const express = require('express');
const router = express.Router();
const Article = require('../models/Article.model');

// @route GET /api/categories — Get all categories with article counts
router.get('/', async (req, res) => {
  try {
    const categories = await Article.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.status(200).json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
