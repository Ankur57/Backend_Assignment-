# 🔐 Secure Product Update Approval System

A full-stack web application implementing a **controlled product update workflow** with JWT authentication, role-based access control, and an audit trail. Unlike a simple CRUD app, product updates here go through a **formal approval pipeline** — users submit change requests, and administrators review, approve, or reject them.

> Built with **Node.js / Express v5**, **MongoDB**, and **React + Tailwind CSS**.

---

## 📑 Table of Contents

- [Architecture Overview](#-architecture-overview)
- [Core Features](#-core-features)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Security Practices](#-security-practices)
- [Scalability Notes](#-scalability-notes)

---

## 🏗 Architecture Overview

```
┌─────────────────┐        ┌──────────────────────────────────────┐
│   React Client  │◄──────►│         Express REST API             │
│  (Vite + TW)    │  JWT   │         /api/v1/*                    │
└─────────────────┘ Bearer ├──────────────────────────────────────┤
                           │  Auth     │ Products │ Updates  │
                           ├──────────────────────────────────────┤
                           │        Middleware Layer              │
                           │   protect (JWT) ─► adminOnly (RBAC) │
                           ├──────────────────────────────────────┤
                           │          MongoDB (Mongoose)          │
                           │  Users │ Products │ UpdateRequests   │
                           │  
                           └──────────────────────────────────────┘
```

---

## ✨ Core Features

### 🔑 Authentication & Authorization
| Feature | Details |
|---|---|
| Registration | `POST /api/v1/auth/register` — password hashed with **bcrypt** (10 salt rounds) |
| Login | `POST /api/v1/auth/login` — returns signed **JWT** (1-day expiry) |
| Token Payload | Contains `id` and `role` — decoded server-side on every protected request |
| Role-Based Access | `user` role → Products & Update Requests; `admin` role → Approve/Reject |

### 📦 Product Management
- **Create Product** — Any authenticated user can create products.
- **View Products** — Lists all products (protected route).
- Products **cannot be directly updated** — changes go through the approval workflow.

### 🔄 Update Approval Workflow
This is the core innovation of the project:

```
User submits update request (new name / new price)
        │
        ▼
  Status: PENDING ──────► Admin reviews
                            │         │
                         Approve    Reject
                            │         │
                            ▼         ▼
                   Product Updated   No Change
                  Status: APPROVED  Status: REJECTED
```

- Users submit `POST /api/v1/updates` with `{ productId, newName, newPrice }`.
- Admin views all requests via `GET /api/v1/updates`.
- Admin approves (`POST /api/v1/updates/approve/:id`) or rejects (`POST /api/v1/updates/reject/:id`).
- On approval, the original product document is updated atomically.
- Every action is logged to the **AuditLog** collection for traceability.

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Express v5** | REST API framework |
| **MongoDB + Mongoose** | NoSQL database with ODM |
| **JWT (jsonwebtoken)** | Stateless authentication |
| **bcrypt** | Password hashing (10 rounds) |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |
| **nodemon** | Dev server with hot-reload |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | Component-based UI library |
| **Vite** | Lightning-fast build tool |
| **Tailwind CSS 3** | Utility-first CSS framework |
| **React Router v7** | Client-side routing |
| **Axios** | HTTP client with interceptors |

---

## 🗄 Database Schema

### User
```js
{
  name: String,
  email: { type: String, unique: true },
  password: String,              // bcrypt hashed
  role: "user" | "admin",       // default: "user"
  timestamps: true
}
```

### Product
```js
{
  name: String,
  price: Number,
  createdBy: ObjectId → User,
  timestamps: true
}
```

### UpdateRequest
```js
{
  productId: ObjectId → Product,
  newName: String,
  newPrice: Number,
  status: "PENDING" | "APPROVED" | "REJECTED",   // default: "PENDING"
  createdBy: ObjectId → User,
  timestamps: true
}
```

### AuditLog
```js
{
  action: String,                // e.g. "UPDATE_REQUEST_CREATED", "UPDATE_APPROVED"
  performedBy: ObjectId → User,
  timestamps: true
}
```

### Workflow
```js
{
  title: String,
  type: "LOW_RISK" | "HIGH_RISK",
  status: "PENDING_APPROVAL" | "COMPLETED" | "REJECTED",
  createdBy: ObjectId → User,
  timestamps: true
}
```

---

## 📡 API Documentation

### Auth Routes — `/api/v1/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Register a new user |
| `POST` | `/login` | ❌ | Login and receive JWT |

### Product Routes — `/api/v1/products`
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/` | ✅ JWT | Any | List all products |
| `POST` | `/` | ✅ JWT | Any | Create a new product |

### Update Request Routes — `/api/v1/updates`
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/` | ✅ JWT | Any | List all update requests |
| `POST` | `/` | ✅ JWT | User | Submit an update request |
| `POST` | `/approve/:id` | ✅ JWT | Admin | Approve a pending request |
| `POST` | `/reject/:id` | ✅ JWT | Admin | Reject a pending request |

### Workflow Routes — `/api/v1/workflows`
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| `GET` | `/` | ✅ JWT | Any | List all workflows |
| `POST` | `/` | ✅ JWT | Any | Create a workflow |
| `POST` | `/approve/:id` | ✅ JWT | Admin | Approve a high-risk workflow |
| `POST` | `/reject/:id` | ✅ JWT | Admin | Reject a high-risk workflow |

---

## 📁 Project Structure

```
Backend_Assignment/
├── Server/
│   ├── server.js                    # Entry point — connects MongoDB & starts Express
│   ├── package.json
│   ├── .env                         # MONGO_URI, JWT_SECRET
│   └── src/
│       ├── app.js                   # Express app config, middleware, route mounting
│       ├── config/                  # Database configuration
│       ├── controller/
│       │   ├── authController.js    # Register & Login logic
│       │   ├── productController.js # Create & Get products
│       │   ├── updateController.js  # Update request CRUD + approval workflow
│       ├── middlewares/
│       │   └── auth.js              # JWT protect + adminOnly middleware
│       ├── models/
│       │   ├── usermodel.js         # User schema with role enum
│       │   ├── Product.js           # Product schema
│       │   ├── UpdateRequest.js     # Update request with status tracking
│       ├── routes/
│       │   ├── authRoutes.js        # /api/v1/auth/*
│       │   ├── productRoutes.js     # /api/v1/products/*
│       │   ├── updateRoutes.js      # /api/v1/updates/*
│       └── utlis/
│           └── generateToken.js     # JWT token generation utility
│
└── Client/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx                 # React entry point
        ├── App.jsx                  # Router setup (Login, Register, Dashboard, Admin)
        ├── index.css                # Tailwind directives + custom glass components
        ├── api/
        │   └── axios.js             # Axios instance with JWT interceptor
        ├── components/
        │   ├── Navbar.jsx           # Sticky glassmorphism navbar
        │   └── Card.jsx             # Reusable card component
        └── pages/
            ├── Login.jsx            # Login page with glassmorphism UI
            ├── Register.jsx         # Registration page
            ├── Dashboard.jsx        # User dashboard — products + request updates
            └── Admin.jsx            # Admin panel — approve/reject requests
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18.x
- **MongoDB** (local or [MongoDB Atlas](https://cloud.mongodb.com))
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/Backend_Assignment.git
cd Backend_Assignment
```

### 2. Setup the Backend
```bash
cd Server
npm install
```

Create a `.env` file in the `Server/` directory:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/secureUpdateDB
JWT_SECRET=your_super_secret_key_here
```

Start the backend server:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Setup the Frontend
```bash
cd Client
npm install
npm run dev
# Client runs on http://localhost:5173
```

### 4. Create an Admin User
Register a normal user via the UI, then manually update the role in MongoDB:
```js
// In MongoDB Shell or Atlas
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

## 🛡 Security Practices

| Practice | Implementation |
|---|---|
| **Password Hashing** | bcrypt with 10 salt rounds — passwords never stored in plain text |
| **JWT Authentication** | Stateless tokens with 1-day expiry, sent via `Authorization: Bearer <token>` |
| **Role-Based Access Control** | `protect` middleware verifies JWT; `adminOnly` middleware checks `role === "admin"` |
| **Input Validation** | Mongoose schema-level validation with `enum`, `unique`, and `required` constraints |
| **CORS** | Enabled via `cors()` middleware for frontend-backend communication |
| **Environment Variables** | Secrets (`JWT_SECRET`, `MONGO_URI`) stored in `.env`, never committed to VCS |
| **API Versioning** | All routes prefixed with `/api/v1/` for backward-compatible future evolution |
| **Audit Trail** | Every approval/rejection action is logged with user ID and timestamp |

---

## 📈 Scalability Notes

This project is architected with scalability in mind. Here are strategies for scaling to production:

### Horizontal Scaling
- **Stateless JWT auth** enables any server instance to validate tokens — ideal for load balancing across multiple Node.js processes (e.g., via **PM2 cluster mode** or **Kubernetes pods**).
- Express app is cleanly separated from the server entry point (`app.js` vs `server.js`), making it easy to wrap in serverless functions (AWS Lambda, Vercel).

### Database Scaling
- **MongoDB Atlas** provides built-in sharding and replica sets for horizontal database scaling.
- Mongoose schemas use `ObjectId` references and `populate()` for efficient relational queries without embedding.
- Indexes on `email` (unique) ensure fast lookups during authentication.

### Caching (Future Enhancement)
- **Redis** can be integrated as a caching layer for:
  - JWT token blacklisting (logout/revocation)
  - Frequently queried product listings
  - Rate limiting on auth endpoints

### Microservices Migration Path
The modular structure (controllers, routes, models separated by domain) allows each service to be extracted into independent microservices:
- **Auth Service** → User registration, login, token management
- **Product Service** → Product CRUD operations
- **Approval Service** → Update request workflow + audit logging

### Deployment Readiness
- **Docker**: Containerize both server and client for consistent environments.
- **CI/CD**: GitHub Actions for automated testing and deployment.
- **Reverse Proxy**: Nginx for serving static frontend assets and proxying API requests.

---

## 📄 License

This project is part of a backend developer internship assignment.

---

<p align="center">
  Built with ❤️ using Node.js, Express, MongoDB, React & Tailwind CSS
</p>
