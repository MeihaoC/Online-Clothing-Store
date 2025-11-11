# Clothing Store Web Application

A full-stack MERN (MongoDB, Express, React, Node.js) web application for an online clothing store. Users can browse products, manage a shopping cart, and place orders with secure authentication and modern UI design.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![React](https://img.shields.io/badge/React-18.3-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

---

## 📋 Table of Contents

- [Features](#-features)
- [Project Overview](#-project-overview)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Project](#-running-the-project)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Technologies Used](#-technologies-used)
- [Security Features](#-security-features)
- [Contributing](#-contributing)

---

## ✨ Features

### User Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Product Browsing**: Browse products with filtering by category and size
- **Search Functionality**: Real-time product search from navigation bar
- **Shopping Cart**: Add, update quantities, and remove items from cart
- **Checkout Process**: Secure checkout with currency conversion support
- **Order Management**: View order history and track order status
- **User Profile**: Manage account information and view past orders

### Technical Features
- **Responsive Design**: Mobile-friendly interface with modern UI/UX
- **RESTful API**: Well-structured backend API with proper error handling
- **Input Validation**: Server-side validation for all user inputs
- **Security**: Rate limiting, Helmet.js, and secure password hashing
- **Error Handling**: Centralized error handling with consistent responses

---

## 🎯 Project Overview

This application demonstrates a complete e-commerce solution with:

- **Frontend**: React-based single-page application with React Router
- **Backend**: Express.js RESTful API with MongoDB database
- **Authentication**: JWT-based authentication system
- **State Management**: React hooks for state management
- **Styling**: Custom CSS with responsive design principles

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or above)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (local installation) or [MongoDB Atlas](https://www.mongodb.com/atlas) account (recommended)
- Git (for cloning the repository)
- A code editor like [VS Code](https://code.visualstudio.com/)

---

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MeihaoC/5610-final-project.git
   cd Online-Clothing-Store
   ```

2. **Install backend dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd ../client
   npm install
   ```

---

## ▶️ Running the Project

### Development Mode

1. **Start the Backend Server**:
   ```bash
   cd server
   npm run dev    # Uses nodemon for auto-restart
   # OR
   npm start      # Standard node execution
   ```
   - Backend server runs at `http://localhost:5002`
   - API endpoints available at `http://localhost:5002/api`

2. **Start the Frontend Development Server** (in a new terminal):
   ```bash
   cd client
   npm start
   ```
   - Frontend runs at `http://localhost:3000`
   - Automatically opens in your browser

### Production Build

To create a production build of the frontend:

```bash
cd client
npm run build
```

This creates an optimized production build in the `client/build` folder.

---

## 🔐 Environment Variables

Create a `.env` file in the `server` folder. You can use `.env.example` as a template.

**⚠️ IMPORTANT:** Never commit your `.env` file to version control. It contains sensitive information.

### Required Variables

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clothing-store?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
```

### Optional Variables

```env
PORT=5002                    # Server port (defaults to 5002)
NODE_ENV=development         # Environment mode (development/production)
```

### Generating JWT Secret

Generate a secure JWT secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user and get your connection string
4. Add your IP address to the whitelist
5. Update `MONGODB_URI` in your `.env` file

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/clothing-store`

### Populating Sample Data

After setting up your database, populate it with sample data:

```bash
cd server
npm run seed
# OR
node models/FakerSeed.js
```

This creates:
- 50 sample products
- 20 sample users (with hashed passwords)
- 30 sample orders

---

## 🔌 API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### Products
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search?q=query` - Search products

### Cart
- `GET /api/users/cart` - Get user's cart (requires authentication)
- `POST /api/users/cart` - Add/update item in cart (requires authentication)
- `DELETE /api/users/cart/item/:productId` - Remove item from cart (requires authentication)

### Orders
- `GET /api/orders/history` - Get user's order history (requires authentication)
- `POST /api/users/checkout` - Create new order (requires authentication)
- `PATCH /api/orders/:id/status` - Update order status (requires authentication)

### User Profile
- `GET /api/users/profile` - Get user profile with order history (requires authentication)

---

## 📁 Project Structure

```
Online-Clothing-Store/
├── client/                 # React frontend application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components (NavBar, Footer)
│   │   ├── pages/         # Page components (Home, Login, Cart, etc.)
│   │   ├── css/           # Component-specific styles
│   │   ├── config.js      # API configuration
│   │   └── index.js       # Entry point
│   └── package.json
│
├── server/                 # Express backend application
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware (auth, validation, error handling)
│   ├── models/            # Mongoose schemas and seed script
│   ├── routes/            # API route definitions
│   ├── server.js          # Server entry point
│   └── package.json
│
├── .gitignore             # Git ignore rules
└── README.md             # This file
```

---

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Helmet.js** - Security headers
- **express-rate-limit** - Rate limiting
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Font Awesome** - Icons
- **CSS3** - Styling with Flexbox and Grid

---

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: Protection against brute force attacks
- **Helmet.js**: Security headers to prevent common vulnerabilities
- **CORS**: Configured for secure cross-origin requests
- **Error Handling**: Centralized error handling without exposing sensitive information

---

## 📊 Database Schema

### User Schema
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  cart: [{
    product: ObjectId (ref: Product),
    quantity: Number (min: 1)
  }],
  orderHistory: [ObjectId (ref: Order)]
}
```

### Product Schema
```javascript
{
  name: String (required),
  category: String (required),
  price: Number (required),
  size: String (required),
  description: String,
  imageUrl: String
}
```

### Order Schema
```javascript
{
  user: ObjectId (ref: User, required),
  products: [{
    product: ObjectId (ref: Product, required),
    quantity: Number (required, min: 1)
  }],
  totalAmount: Number (required),
  currency: String (required),
  shippingAddress: {
    userName: String (required),
    streetAddress: String (required),
    city: String (required),
    province: String (required),
    zipCode: String (required)
  },
  status: String (enum: ["Ordered", "Delivered", "Cancelled"], default: "Ordered"),
  orderDate: Date (default: Date.now)
}
```

---

## 🧪 Testing

Run tests for the frontend:

```bash
cd client
npm test
```

---

## 📝 Scripts

### Backend Scripts
- `npm start` - Start the server
- `npm run dev` - Start server with nodemon (auto-restart)
- `npm run seed` - Populate database with sample data

### Frontend Scripts
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests
