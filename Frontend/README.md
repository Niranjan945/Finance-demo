# 📈 Trading Journal Frontend

A high-fidelity trading journal built with **React** and **Tailwind CSS**, featuring Razorpay-grade aesthetics and a robust platform control center for administrators. 

## 🚀 Key Features
- **Smart Auth:** Role-based access (Admin/User) powered by Context API.
- **Unified Analytics:** Real-time P&L tracking, Win Rate calculation, and Fee monitoring.
- **Platform Control:** Admins can view all platform trades while managing their own.
- **Responsive Table:** Clean, interactive data views with action-based permissions.
- **Data Export:** Download platform or personal trading history as a CSV file.

## 💻 Tech Stack & Requirements

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**: Package manager

### Technologies Used
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **State Management:** React Context API & Hooks

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