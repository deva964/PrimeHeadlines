const mongoose = require('mongoose');
const slugify = require('slugify');

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: { type: String, unique: true },
    deck: {
      type: String,
      required: [true, 'Deck/subtitle is required'],
      maxlength: [400, 'Deck cannot exceed 400 characters']
    },
    body: {
      type: String,
      required: [true, 'Article body is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['World', 'Politics', 'Business', 'Technology', 'Science', 'Climate', 'Culture', 'Opinion', 'Sport']
    },
    tags: [{ type: String, lowercase: true }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    image: {
      url: { type: String, default: '' },
      caption: { type: String, default: '' },
      cloudinaryId: { type: String }
    },
    status: {
      type: String,
      enum: ['draft', 'review', 'published', 'archived'],
      default: 'draft'
    },
    isFeatured: { type: Boolean, default: false },
    isBreaking: { type: Boolean, default: false },
    readTime: { type: Number, default: 5 },  // minutes
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    publishedAt: { type: Date }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual: comments count
ArticleSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'article',
  count: true
});

// Auto-generate slug from title
ArticleSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  // Auto-set publishedAt
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  // Estimate read time (avg 200 words/min)
  if (this.isModified('body')) {
    const wordCount = this.body.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  next();
});

// Index for fast search
ArticleSchema.index({ title: 'text', body: 'text', tags: 'text' });
ArticleSchema.index({ category: 1, status: 1 });
ArticleSchema.index({ slug: 1 });

module.exports = mongoose.model('Article', ArticleSchema);
