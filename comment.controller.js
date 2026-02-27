const Comment = require('../models/Comment.model');
const Article = require('../models/Article.model');

// @route   GET /api/comments/:articleId
// @access  Public
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      article: req.params.articleId,
      isApproved: true
    }).populate('user', 'name avatar').sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: comments.length, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   POST /api/comments/:articleId
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    const comment = await Comment.create({
      article: req.params.articleId,
      user: req.user.id,
      text: req.body.text
    });
    await comment.populate('user', 'name avatar');
    res.status(201).json({ success: true, comment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route   DELETE /api/comments/:id
// @access  Private (admin or comment owner)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await comment.deleteOne();
    res.status(200).json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/comments/:id/approve
// @access  Private (admin, editor)
exports.approveComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    res.status(200).json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
