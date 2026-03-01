# 🚀 CryptoTrade Journal - Backend API

A high-performance RESTful API built with Node.js, Express, and MongoDB. This backend serves as the core engine for logging, managing, and analyzing cryptocurrency trades. It features JWT-based authentication, role-based access control (RBAC), robust Zod payload validation, and advanced MongoDB aggregations for generating instant dashboard analytics.

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **Validation:** Zod
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs
* **Documentation:** Swagger UI Express

## 📂 Folder Structure

\`\`\`text
cryptotrade-backend/
├── src/
│   ├── config/
│   │   ├── database.js        # MongoDB connection setup
│   │   └── swagger.js         # Swagger UI configuration
│   ├── controllers/
│   │   ├── authController.js  # Registration and login logic
│   │   └── tradeController.js # CRUD operations & aggregation pipelines
│   ├── middlewares/
│   │   ├── auth.js            # JWT verification & Role checking
│   │   └── errorHandler.js    # Global error handling
│   ├── models/
│   │   ├── user.js            # Mongoose schema for Users
│   │   └── trade.js           # Mongoose schema for Trades
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints (/api/v1/auth)
│   │   └── tradeRoutes.js     # Trade endpoints (/api/v1/trades)
│   ├── utils/
│   │   ├── AppError.js        # Custom error class
│   │   ├── asyncHandler.js    # Try/catch wrapper for async routes
│   │   └── seedAdmin.js       # Script to generate initial Admin user
├── .env                       # Environment variables (ignored in git)
├── .gitignore                 # Files to ignore in version control
├── package.json               # Project metadata and dependencies
└── server.js                  # Main Express application entry point
\`\`\`

## 📦 Getting Started

### 1. Prerequisites
* Node.js (v16+ recommended)
* MongoDB (Local instance or MongoDB Atlas URI)

### 2. Installation
Clone the repository and install the dependencies:
\`\`\`bash
git clone <your-repo-url>
cd cryptotrade-backend
npm install
\`\`\`

### 3. Environment Variables
Create a `.env` file in the root directory and add the following:
\`\`\`env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=30d
\`\`\`

### 4. Start the Server
Start the development server:
\`\`\`bash
npm run dev
\`\`\`
*(The server will automatically seed an Admin user on startup).*

## 📚 API Endpoints & Documentation

Interactive API documentation is built into the server using Swagger UI. Once the server is running, navigate to:

👉 **http://localhost:5000/api-docs**

### Quick Endpoint Reference

**Auth Routes** (Public)
* \`POST /api/v1/auth/register\` - Create a new user account
* \`POST /api/v1/auth/login\` - Authenticate and receive a JWT

**Trade Routes** (Requires Bearer Token)
* \`GET /api/v1/trades/dashboard/summary\` - Fetch aggregated trading metrics (PnL, Win Rate)
* \`POST /api/v1/trades\` - Log a new crypto trade
* \`GET /api/v1/trades\` - Fetch trades (Normal users see their own; Admins see all)
* \`GET /api/v1/trades/:id\` - Fetch a specific trade by ID
* \`PATCH /api/v1/trades/:id\` - Update an existing trade
* \`DELETE /api/v1/trades/:id\` - Delete a trade