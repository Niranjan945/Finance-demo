# 🚀 CryptoTrade Journal - Backend API

A secure, scalable RESTful API built with Node.js and Express for a cryptocurrency trading journal. This project features role-based access control (Admin/User), advanced MongoDB aggregations for P&L calculation, and interactive API documentation.

🔗 **Live API Base URL:** [https://trademe-1.onrender.com](https://trademe-1.onrender.com)  
📖 **Swagger API Docs:** [https://trademe-1.onrender.com/api-docs](https://trademe-1.onrender.com/api-docs)

---

## ✨ Core Features
* **Role-Based Access Control (RBAC):** Distinct `ADMIN` and `USER` privileges.
* **Smart P&L Engine:** Automatically calculates realized Profit & Loss based on historical buy prices.
* **Data Aggregation:** Uses MongoDB pipelines to generate real-time platform/user statistics.
* **Secure Auth:** Stateless JWT authentication with Bcrypt password hashing.
* **Robust Validation:** Strict request body validation using Zod.

## 💻 Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Node.js + Express.js | High-performance asynchronous routing |
| **Database** | MongoDB + Mongoose | Flexible schema design & advanced aggregations |
| **Security** | JWT, Bcrypt, Helmet | Secure authentication and HTTP headers |
| **Validation** | Zod | Type-safe schema validation |
| **Documentation**| Swagger UI | Interactive endpoint testing |

---

## 🛠️ Local Setup & Installation

### 1. Prerequisites
* Node.js (v18+)
* MongoDB (Local instance or MongoDB Atlas cluster)

### 2. Environment Variables
Create a `.env` file in the root directory and add the following:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port for the server to run on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing tokens | `your_super_secret_key` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `development` |

### 3. Installation Steps
```bash
# Clone the repository
git clone <your-backend-repo-url>
cd Backend

# Install dependencies
npm install

# Start the development server
node server.js

Method,Endpoint,Description,Auth Required
POST,/auth/register,Register a new user,❌ No
POST,/auth/login,Authenticate user & get token,❌ No
GET,/trades,"Get trades (Admin sees all, User sees own)",🔒 Yes
POST,/trades,Log a new crypto trade,🔒 Yes
GET,/trades/dashboard/summary,"Get aggregated P&L, win rate, and fees",🔒 Yes
GET,/trades/export/csv,Download trading history as CSV,🔒 Yes
PATCH,/trades/:id,Update an existing trade,🔒 Yes
DELETE,/trades/:id,Delete a trade,🔒 Yes