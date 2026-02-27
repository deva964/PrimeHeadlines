const Article = require('../models/Article.model');

// @route   GET /api/articles
// @access  Public
exports.getArticles = async (req, res) => {
  try {
    const { category, status = 'published', search, page = 1, limit = 10, featured, breaking } = req.query;

    const query = { status };
    if (category) query.category = category;
    if (featured) query.isFeatured = true;
    if (breaking) query.isBreaking = true;
    if (search) query.$text = { $search: search };

    const skip = (page - 1) * limit;
    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .populate('author', 'name avatar')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: articles.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      articles
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/articles/:slug
// @access  Public
exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug })
      .populate('author', 'name avatar bio')
      .populate('comments');

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Increment views
    article.views += 1;
    await article.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   POST /api/articles
// @access  Private (journalist, editor, admin)
exports.createArticle = async (req, res) => {
  try {
    req.body.author = req.user.id;
    const article = await Article.create(req.body);
    res.status(201).json({ success: true, article });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route   PUT /api/articles/:id
// @access  Private (author, editor, admin)
exports.updateArticle = async (req, res) => {
  try {
    let article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    // Only author, editor or admin can update
    if (article.author.toString() !== req.user.id && !['editor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this article' });
    }
    article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, article });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route   DELETE /api/articles/:id
// @access  Private (admin, editor)
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    await article.deleteOne();
    res.status(200).json({ success: true, message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route   GET /api/articles/category/:category
// @access  Public
exports.getByCategory = async (req, res) => {
  try {
    const articles = await Article.find({
      category: req.params.category,
      status: 'published'
    })
      .populate('author', 'name avatar')
      .sort({ publishedAt: -1 })
      .limit(20);
    res.status(200).json({ success: true, count: articles.length, articles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
