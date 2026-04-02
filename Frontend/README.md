# CryptoTrade Journal - Frontend

This is the frontend client for the CryptoTrade Journal application. It is a blazing-fast Single Page Application (SPA) built with React 19 and Vite, styled with Tailwind CSS.

## 🚀 Tech Stack

* **Framework:** React 19
* **Build Tool:** Vite 7
* **Routing:** React Router v7
* **Styling:** Tailwind CSS
* **HTTP Client:** Axios (with interceptors for JWT)
* **Icons:** Lucide React
* **Date Formatting:** date-fns

## 📂 Project Structure

```text
frontend/
├── src/
│   ├── Api/
│   │   └── Axios.jsx            # API instance & global configuration
│   ├── assets/
│   │   └── react.svg            # Static assets
│   ├── components/
│   │   ├── Navbar.jsx           # Global navigation component
│   │   ├── ProtectedRoute.jsx   # Route guard for authenticated users
│   │   └── TradeModal.jsx       # Log/Edit trade form
│   ├── context/
│   │   └── authContext.jsx      # Global user authentication state
│   ├── pages/
│   │   ├── Dashboard.jsx        # Main trading dashboard
│   │   ├── Login.jsx            # User sign-in page
│   │   └── Register.jsx         # New account registration
│   ├── App.jsx                  # Main router & provider setup
│   ├── index.css                # Tailwind directives & global fonts
│   └── main.jsx                 # React entry point
├── index.html                   # HTML template
├── package.json                 # Project dependencies & scripts
├── postcss.config.js            # CSS transformation config
├── tailwind.config.js           # Custom theme & styling rules
└── README.md                    # Project documentation

🏃‍♂️ Getting Started

Install dependencies:
     npm install

Start the development server:
    npm run dev

Build for production:
    npm run build

