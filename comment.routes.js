const express = require('express');
const router = express.Router();
const { getComments, addComment, deleteComment, approveComment } = require('../controllers/comment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/:articleId',                                      getComments);
router.post('/:articleId',   protect,                          addComment);
router.delete('/:id',        protect,                          deleteComment);
router.put('/:id/approve',   protect, authorize('editor', 'admin'), approveComment);

module.exports = router;
