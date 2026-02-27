# 📰 Prime Headlines — Backend API

A production-ready REST API built with **Node.js + Express + MongoDB** powering the Prime Headlines news platform.

---

## 🗂️ Folder Structure

```
prime-headlines-backend/
├── server.js               # Entry point
├── .env.example            # Environment variables template
├── package.json
├── config/
│   └── db.js               # MongoDB connection
├── models/
│   ├── User.model.js       # User schema
│   ├── Article.model.js    # Article schema
│   └── Comment.model.js    # Comment schema
├── controllers/
│   ├── auth.controller.js  # Register, login, profile
│   ├── article.controller.js
│   └── comment.controller.js
├── routes/
│   ├── auth.routes.js
│   ├── article.routes.js
│   ├── comment.routes.js
│   ├── user.routes.js
│   └── category.routes.js
└── middleware/
    └── auth.middleware.js  # JWT protect + role auth
```

---

## ⚡ Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
# Fill in your MongoDB URI, JWT secret, Cloudinary keys
```

### 3. Run in development
```bash
npm run dev
```

### 4. Run in production
```bash
npm start
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Private | Get current user |
| PUT | `/api/auth/updatepassword` | Private | Update password |

### Articles
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/articles` | Public | Get all published articles |
| GET | `/api/articles/:slug` | Public | Get article by slug |
| GET | `/api/articles/category/:category` | Public | Get by category |
| POST | `/api/articles` | Journalist+ | Create article |
| PUT | `/api/articles/:id` | Journalist+ | Update article |
| DELETE | `/api/articles/:id` | Editor+ | Delete article |

### Comments
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/comments/:articleId` | Public | Get approved comments |
| POST | `/api/comments/:articleId` | Private | Add comment |
| DELETE | `/api/comments/:id` | Private | Delete own comment |
| PUT | `/api/comments/:id/approve` | Editor+ | Approve comment |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin | Get all users |
| PUT | `/api/users/profile` | Private | Update profile |
| PUT | `/api/users/save/:articleId` | Private | Save/unsave article |

### Categories
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/categories` | Public | Get categories + counts |

---

## 👥 User Roles
- **reader** — Can read, comment, save articles
- **journalist** — Can create & edit own articles
- **editor** — Can approve/reject articles & comments
- **admin** — Full access

---

## 🛡️ Security Features
- JWT Authentication
- Password hashing with bcrypt
- Rate limiting (100 req / 15 min)
- MongoDB injection sanitization
- Helmet HTTP headers
- CORS protection

---

## 🔧 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcryptjs
- **Images**: Cloudinary
- **Security**: Helmet, express-rate-limit, mongo-sanitize
