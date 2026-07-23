# Hybrid E-Commerce Setup Guide

## 🎯 Overview

This is a hybrid e-commerce implementation where:
- **Frontend**: Uses local product data (like static version) for maximum performance
- **Backend**: Handles user data, payments, order tracking, and inventory on MongoDB Atlas
- **Authentication**: JWT-based with optional guest access
- **Payment**: Razorpay integration for online payments + COD option

## ✅ Implementation Summary

### 🔧 **Backend (Users, Orders, Payments, Inventory)**
- ✅ MongoDB Atlas connection configured with your credentials
- ✅ JWT-based authentication (no Firebase)
- ✅ User registration and login system
- ✅ Order management (guest + registered users)
- ✅ Razorpay payment integration
- ✅ Protected admin dashboard access
- ✅ Inventory tracking in database

### 🎨 **Frontend (Local Product Data + Backend Integration)**
- ✅ Products loaded from local ProductContext (no API calls)
- ✅ Login/signup modal with guest option
- ✅ Checkout with Razorpay payment integration
- ✅ Guest checkout functionality
- ✅ Admin dashboard protected with role-based access
- ✅ Navbar shows authentication state

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

The `.env` file is already configured with your MongoDB Atlas credentials:
```env
MONGODB_URI=mongodb://abhishek251gupta_db_user:Codywinscrown19@ac-m3tmsx0-shard-00-00.vgx49k1.mongodb.net:27017,ac-m3tmsx0-shard-00-01.vgx49k1.mongodb.net:27017,ac-m3tmsx0-shard-00-02.vgx49k1.mongodb.net:27017/?ssl=true&replicaSet=atlas-77fwnx-shard-0&authSource=admin&appName=Riders-Galaxy
```

### 2. Start Backend

```bash
cd backend
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Frontend

```bash
cd frontend
npm run dev
```

## 🔐 Authentication Flow

### Guest Users:
- Can browse all products (local data)
- Can add items to cart
- Can checkout with contact information
- Orders stored with guest info in MongoDB
- No account required

### Registered Users:
- Click 🔐 in navbar to open auth modal
- Can create account or login
- Checkout pre-filled with user data
- Orders linked to user account
- Order history tracking available

### Admin Users:
- Login with admin credentials
- Access protected dashboard
- Manage products via local ProductContext
- View all orders in MongoDB
- Update order status

## 💳 Payment Integration

### Razorpay Setup:
1. Get Razorpay API keys from [Razorpay Dashboard](https://razorpay.com)
2. Add to `backend/.env`:
   ```env
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

### Payment Options:
- **Online Payment**: Razorpay integration (UPI, Cards, Net Banking)
- **Cash on Delivery**: Traditional COD option
- Both options available for guest and registered users

## 📊 Data Flow

### Products:
- **Storage**: Local ProductContext (frontend)
- **Management**: Admin dashboard (local, not persisted)
- **Display**: Shop and ProductPage (local data)
- **Inventory**: Can be tracked separately in MongoDB if needed

### Users:
- **Storage**: MongoDB Atlas
- **Authentication**: JWT tokens
- **Management**: Backend API
- **Access**: Protected routes

### Orders:
- **Storage**: MongoDB Atlas
- **Types**: Guest orders + Registered user orders
- **Management**: Backend API + Admin dashboard
- **Tracking**: Available for registered users

### Payments:
- **Processing**: Razorpay backend integration
- **Verification**: Razorpay signature verification
- **Storage**: MongoDB with order details

## 🎯 User Experience

### Initial Visit:
1. User lands on home page (fully accessible)
2. Can browse all products (local data, fast loading)
3. Can add items to cart
4. Option to login via navbar 🔐 button
5. Auth modal offers: Login, Sign Up, or Continue as Guest

### Checkout Flow:
1. Guest: Fill contact details → Choose payment → Place order
2. Registered: Pre-filled data → Choose payment → Place order
3. Orders stored in MongoDB with appropriate user linkage

### Admin Access:
1. Login with admin credentials
2. Dashboard icon ⚙️ appears in navbar
3. Access protected admin dashboard
4. Manage products locally (can be synced to MongoDB later)
5. View and manage all orders from MongoDB

## 🔧 Configuration Files

### Backend `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://abhishek251gupta_db_user:Codywinscrown19@ac-m3tmsx0-shard-00-00.vgx49k1.mongodb.net:27017,ac-m3tmsx0-shard-00-01.vgx49k1.mongodb.net:27017,ac-m3tmsx0-shard-00-02.vgx49k1.mongodb.net:27017/?ssl=true&replicaSet=atlas-77fwnx-shard-0&authSource=admin&appName=Riders-Galaxy
JWT_SECRET=riders-galaxy-super-secret-jwt-key-2024
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
ADMIN_EMAIL=admin@ridersgalaxy.com
ADMIN_PASSWORD=admin123
```

### Frontend `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## 📝 API Endpoints

### Authentication:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Orders:
- `POST /api/orders` - Create order (authenticated)
- `POST /api/orders/guest` - Create guest order (public)
- `GET /api/orders/my-orders` - Get user orders (authenticated)
- `GET /api/orders/:id` - Get single order (authenticated)
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/:id` - Update order status (admin only)

### Payment:
- `GET /api/payment/key` - Get Razorpay key (public)
- `POST /api/payment/create-order` - Create Razorpay order (public)
- `POST /api/payment/verify` - Verify Razorpay payment (public)

## 🎨 Frontend Components

### Authentication:
- **AuthModal**: Login/signup modal with guest option
- **ProtectedRoute**: Route protection for admin dashboard
- **AuthContext**: JWT authentication state management

### Shopping:
- **Shop**: Uses local ProductContext for products
- **ProductPage**: Uses local ProductContext for product details
- **Cart**: Local storage-based cart
- **Checkout**: Backend integration for orders and payments

### Admin:
- **Dashboard**: Local product management + protected route
- **Navbar**: Authentication state and conditional elements

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs for secure password storage
- **Role-Based Access**: Admin-only routes protected
- **Protected Routes**: Frontend route protection
- **API Middleware**: Backend authentication middleware
- **Guest Access**: No authentication required for browsing

## 🚀 Deployment

### Backend Deployment:
1. Deploy to Render, Railway, or Heroku
2. Update MongoDB Atlas connection if needed
3. Set production environment variables
4. Add Razorpay production keys

### Frontend Deployment:
1. Can be deployed to Vercel, Netlify, or GitHub Pages
2. Update `VITE_API_URL` to production backend URL
3. Build process: `npm run build`

## 🎉 Benefits of This Approach

### Performance:
- **Fast Product Loading**: Local data, no API calls
- **Instant Navigation**: Client-side routing
- **No Server Dependency**: Frontend works independently

### Flexibility:
- **Guest Access**: No barriers to purchase
- **Optional Authentication**: Users choose when to create accounts
- **Local Product Management**: Quick product updates without database
- **Backend Integration**: Users, orders, payments stored in MongoDB

### Scalability:
- **MongoDB Atlas**: Cloud database, scales automatically
- **Separation of Concerns**: Products local, users/orders in database
- **Payment Integration**: Professional payment processing
- **Future-Ready**: Can easily add API-based product management later

## 📋 Next Steps

1. **Test MongoDB Connection**: Verify backend connects to your Atlas cluster
2. **Add Razorpay Keys**: Get Razorpay credentials and add to `.env`
3. **Create Admin User**: Run seed script to create admin account
4. **Test Complete Flow**: Browse → Add to Cart → Checkout → Payment
5. **Deploy Backend**: Deploy to cloud hosting
6. **Deploy Frontend**: Deploy to static hosting

## 🚨 Important Notes

1. **MongoDB Atlas**: Your cluster is already configured in the `.env` file
2. **Razorpay**: You need to add your Razorpay credentials
3. **Product Data**: Currently local, can be migrated to MongoDB later
4. **JWT Secret**: Current secret is for development, change for production
5. **Admin Access**: Dashboard is protected, only admin users can access

This hybrid approach gives you the best of both worlds: the performance and simplicity of a static site with the power of a backend for user management, payments, and order tracking.