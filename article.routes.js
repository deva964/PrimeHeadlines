const express = require('express');
const router = express.Router();
const {
  getArticles, getArticleBySlug, createArticle,
  updateArticle, deleteArticle, getByCategory
} = require('../controllers/article.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/',                        getArticles);
router.get('/category/:category',      getByCategory);
router.get('/:slug',                   getArticleBySlug);
router.post('/',   protect, authorize('journalist', 'editor', 'admin'), createArticle);
router.put('/:id', protect, authorize('journalist', 'editor', 'admin'), updateArticle);
router.delete('/:id', protect, authorize('editor', 'admin'),            deleteArticle);

module.exports = router;
