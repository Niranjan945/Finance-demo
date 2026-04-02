
# CryptoTrade Journal



![Production Ready](https://img.shields.io/badge/Status-Production_Ready-success) ![Node.js](https://img.shields.io/badge/Node.js-22-green) ![React](https://img.shields.io/badge/React-19-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)



A production-grade, full-stack crypto trade tracking and analytics platform. Built to solve the "spreadsheet chaos" retail traders face by automatically calculating realized Profit & Loss using a strict Average Cost Basis algorithm.## 🌐 Live URLs & Demos



| Resource | Deployed URL |

| :--- | :--- |

| **Frontend Web App** | [https://trade-frontend-l0to.onrender.com](https://trade-frontend-l0to.onrender.com) |

| **Backend API Root** | [https://trademe-1.onrender.com](https://trademe-1.onrender.com) |

| **Interactive API Docs** | [https://trademe-1.onrender.com/api-docs](https://trademe-1.onrender.com/api-docs) |**Test Credentials:*** **Email:** `niranjan023a@gmail.com`* **Password:** `admin@**1234`



---## ✨ Core Features



| Feature | Description | Architecture Layer |

| :--- | :--- | :--- |

| 📋 **Trade Logging** | Log any BUY or SELL with symbol, quantity, price, date, and notes. | Full-Stack |

| 📈 **Auto P&L Engine** | Realized P&L is computed automatically on SELL orders using a weighted Average Cost Basis algorithm. | Backend (Node) |

| 📊 **Live Dashboard** | Real-time tracking of win rate, net P&L, total trades, and incurred fees. | Full-Stack |

| 🛡️ **Role-Based UI** | Adapts dynamically for standard Traders (isolated view) vs. Administrators (global platform view). | Frontend (React) |

| 🔒 **Strict Security** | JWT authentication with Bcrypt password hashing. Input validation happens at the API boundary via Zod. | Backend (Node) |

| 🧠 **Advanced Analytics** | Uses complex MongoDB Aggregation pipelines (`$match`, `$group`) to compute all stats in a single database trip. | Backend (DB) |



---## 💻 Tech Stack Highlights



| Layer | Technologies Used | Purpose |

| :--- | :--- | :--- |

| **Frontend** | React 19, Vite, Tailwind CSS, React Router v7, Axios | Component-based SPA architecture optimized with a lightning-fast build tool. |

| **Backend** | Node.js 22, Express 4 | Robust RESTful API following MVC patterns with global error handling. |

| **Database** | MongoDB Atlas, Mongoose 8 | Flexible NoSQL schema modeling and complex aggregation pipelines. |

| **Security** | JWT, Bcryptjs, Zod, CORS | Stateless authentication, secure password hashing, and strict runtime type-checking. |

| **Documentation**| Swagger UI Express | Interactive, living API documentation for frontend consumption. |



---## 🚀 How to Run Locally



This project is structured as a monorepo containing both the `client` and `server`. You will need two terminal windows to run it locally.### 1. Clone the Repository```bash

git clone [https://github.com/Niranjan945/TradeMe.git](https://github.com/Niranjan945/TradeMe.git)

cd TradeMe

2. Setup the Backend

Open your first terminal window:

Bash



cd server

npm install

Create a .env file in the /server folder:

Code snippet



PORT=5000

NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_jwt_key

Start the backend server:

Bash



npm run dev

(Note: The server automatically runs a seedAdmin() script on startup to ensure the admin account is ready out-of-the-box).

3. Setup the Frontend

Open your second terminal window:

Bash



cd client

npm install

Create a .env file in the /client folder:

Code snippet



VITE_API_URL=http://localhost:5000/api/v1

Start the Vite development server:

Bash



npm run dev

👨‍💻 Author

Avula Niranjan Reddy

Email: niranjan024cmrit@gmail.com

GitHub: @Niranjan945
