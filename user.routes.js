const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const { protect, authorize } = require('../middleware/auth.middleware');

// @route GET /api/users — Admin only
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/users/profile — Update own profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, avatar },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route PUT /api/users/save/:articleId — Save article
router.put('/save/:articleId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const alreadySaved = user.savedArticles.includes(req.params.articleId);
    if (alreadySaved) {
      user.savedArticles = user.savedArticles.filter(id => id.toString() !== req.params.articleId);
    } else {
      user.savedArticles.push(req.params.articleId);
    }
    await user.save();
    res.status(200).json({ success: true, saved: !alreadySaved, savedArticles: user.savedArticles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
