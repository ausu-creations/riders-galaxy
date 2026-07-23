# Complete E-Commerce Backend Setup Guide

## 🎯 Overview

This guide will help you set up a complete e-commerce backend with MongoDB Atlas, JWT authentication, Razorpay payment gateway, and admin-protected dashboard.

## ✅ Completed Changes

### Backend (Already Updated):
- ✅ Removed Firebase dependencies
- ✅ Updated User model for JWT authentication
- ✅ Implemented JWT-based auth routes (register, login, profile)
- ✅ Updated Order model to support guest orders
- ✅ Configured MongoDB Atlas connection
- ✅ Updated environment variables for MongoDB Atlas and Razorpay

### Frontend (Partially Updated):
- ✅ Restored API utility with JWT authentication
- ✅ Updated AuthContext for JWT authentication
- ✅ Created Login page with registration
- ✅ Created ProtectedRoute component
- ✅ Updated Dashboard to use API
- ✅ Added Razorpay dependency
- ✅ Updated routes to include login and protected dashboard

## 🔧 Remaining Tasks

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account
   - Create a new cluster (free tier is sufficient)

2. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It should look like: `mongodb+srv://username:password@cluster0.mongodb.net/riders-galaxy`

3. **Configure Environment Variables:**
   - Copy `backend/.env.example` to `backend/.env`
   - Update with your MongoDB Atlas connection string
   - Add your Razorpay credentials
   - Set a strong JWT secret

### 3. Set Up Razorpay

1. **Create Razorpay Account:**
   - Go to [Razorpay](https://razorpay.com)
   - Sign up for free account
   - Get your API Key ID and Key Secret from Dashboard > Settings > API Keys

2. **Add to Environment Variables:**
   ```env
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

### 4. Create Admin User

Run the seed script to create an admin user:

```bash
cd backend
node scripts/seedAdmin.js
```

This will create an admin user with credentials from your `.env` file.

### 5. Update Remaining Frontend Components

I need to update these components to use the API:

- **Shop.jsx** - Fetch products from API
- **ProductPage.jsx** - Fetch product details from API  
- **Checkout.jsx** - Implement Razorpay payment and guest checkout
- **Navbar.jsx** - Add authentication state and login/logout

### 6. Frontend Environment Variables

Create `frontend/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Start Backend:
```bash
cd backend
npm run dev
```

### Start Frontend:
```bash
cd frontend
npm run dev
```

## 🔐 Authentication Flow

### User Registration:
1. User fills registration form (name, email, password)
2. Frontend sends POST to `/api/auth/register`
3. Backend hashes password and creates user
4. Backend returns JWT token
5. Frontend stores token in localStorage
6. User is automatically logged in

### User Login:
1. User fills login form (email, password)
2. Frontend sends POST to `/api/auth/login`
3. Backend verifies credentials
4. Backend returns JWT token
5. Frontend stores token in localStorage
6. User is logged in

### Admin Dashboard Access:
1. User must be logged in with admin role
2. ProtectedRoute component checks user role
3. Only users with `role: 'admin'` can access dashboard
4. Regular users are redirected to home page

## 💳 Payment Integration

### Razorpay Payment Flow:

1. **Guest Checkout:**
   - User fills checkout form without login
   - Frontend sends order data to `/api/orders/guest`
   - Payment initiated without authentication

2. **Registered User Checkout:**
   - User fills checkout form (pre-filled if logged in)
   - Frontend sends order data to `/api/orders`
   - JWT token included in Authorization header
   - Payment initiated with authentication

3. **Payment Process:**
   - Frontend calls `/api/payment/create-order` to create Razorpay order
   - Razorpay checkout opens
   - User completes payment
   - Frontend calls `/api/payment/verify` to verify payment
   - Order is confirmed and saved to database

## 📋 Order Management

### Guest Orders:
- Stored with `guestInfo` instead of `userId`
- Cannot be tracked by users (no account)
- Admin can view and manage all orders
- Contact information available for follow-up

### Registered User Orders:
- Linked to user account via `userId`
- Available in user's order history
- Full tracking and management capabilities
- Better customer experience for repeat customers

## 🔧 Configuration Files

### Backend .env file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://your-connection-string/riders-galaxy
JWT_SECRET=your-super-secret-jwt-key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
ADMIN_EMAIL=admin@ridersgalaxy.com
ADMIN_PASSWORD=admin123
```

### Frontend .env file:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Next Steps

1. **Complete Frontend Integration:**
   - Update Shop.jsx to fetch from API
   - Update ProductPage.jsx to fetch from API
   - Update Checkout.jsx with Razorpay integration
   - Update Navbar.jsx with auth state

2. **Test Authentication:**
   - Test user registration
   - Test user login
   - Test admin dashboard access
   - Test protected routes

3. **Test Payment Flow:**
   - Test guest checkout with COD
   - Test registered user checkout with Razorpay
   - Test payment verification
   - Test order creation

4. **Deploy Backend:**
   - Deploy to Render, Railway, or Heroku
   - Update frontend API URL to production URL
   - Configure MongoDB Atlas for production
   - Set up production environment variables

## 📝 API Endpoints

### Authentication:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `GET /api/auth/users` - Get all users (admin only)

### Products:
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

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

## 🔒 Security Features

- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** bcryptjs for secure password storage
- **Role-Based Access:** Admin-only routes protected
- **Protected Routes:** Frontend route protection
- **API Middleware:** Backend authentication middleware
- **CORS:** Configured for secure cross-origin requests

## 🚨 Important Notes

1. **MongoDB Atlas:** Ensure your MongoDB Atlas cluster is whitelisted to allow connections from your IP
2. **JWT Secret:** Use a strong, random JWT secret in production
3. **Razorpay:** Use test mode for development, switch to live for production
4. **Environment Variables:** Never commit `.env` files to version control
5. **Password Security:** Admin password should be changed immediately after first login

## 🎉 Summary

Your e-commerce application will have:
- ✅ Complete backend with MongoDB Atlas
- ✅ JWT-based authentication system
- ✅ User registration and login
- ✅ Protected admin dashboard
- ✅ Razorpay payment integration
- ✅ Guest checkout functionality
- ✅ Order management system
- ✅ Role-based access control

The foundation is now in place. The remaining frontend integration can be completed following the patterns established in the Dashboard component.