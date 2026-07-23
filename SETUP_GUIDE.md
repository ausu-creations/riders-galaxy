# Riders Galaxy E-Commerce Portal - Complete Setup Guide

This guide will help you set up the complete e-commerce portal with Firebase Authentication, Razorpay Payment Integration, and Admin Dashboard.

## 🏗️ Architecture Overview

- **Frontend**: React + Vite + Bootstrap
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: Firebase Auth
- **Payment**: Razorpay
- **Database**: MongoDB (for products, orders, users)

## 📋 Prerequisites

1. Node.js (v14 or higher)
2. MongoDB (local installation or MongoDB Atlas account)
3. Firebase Account
4. Razorpay Account

## 🔧 Step-by-Step Setup

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "riders-galaxy"
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google (optional)
4. Get Firebase Configuration:
   - Go to Project Settings > General > Your apps
   - Copy the firebaseConfig values
5. Generate Service Account Key:
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the JSON file (you'll need this for backend)

### 2. Razorpay Setup

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up and verify your account
3. Get API Keys:
   - Go to Settings > API Keys
   - Copy Key ID and Key Secret
4. For testing, use Test Mode (enabled by default)

### 3. MongoDB Setup

**Option A: Local MongoDB**
1. Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Default connection: `mongodb://localhost:27017/riders-galaxy`

**Option B: MongoDB Atlas**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string from Connect > Connect your application

### 4. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file with your credentials:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/riders-galaxy
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_DATABASE_URL=your_firebase_database_url
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
JWT_SECRET=your-super-secret-jwt-key
ADMIN_EMAIL=admin@ridersgalaxy.com
ADMIN_PASSWORD=admin123
```

Start the backend server:

```bash
npm run dev
```

### 5. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Start the frontend:

```bash
npm run dev
```

### 6. Create Admin User

1. Go to Firebase Console > Authentication
2. Create a new user with email: `admin@ridersgalaxy.com`
3. Note the Firebase UID from the user details
4. Update the backend `.env` file or manually create admin in database:

```bash
cd backend
node scripts/seedAdmin.js
```

Or manually in MongoDB:

```javascript
db.users.insertOne({
  firebaseUid: "your-firebase-uid",
  email: "admin@ridersgalaxy.com",
  displayName: "Admin",
  role: "admin",
  createdAt: new Date()
})
```

## 🚀 Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

Access the application at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔐 Accessing Admin Dashboard

1. Navigate to `/login`
2. Login with admin credentials
3. Click the ⚙️ icon in the navbar to access the dashboard
4. Dashboard is protected and only accessible to admin users

## 💳 Testing Payments

### Test Mode (Razorpay)
- Razorpay provides test mode by default
- Use test card details:
  - Card: 4242 4242 4242 4242
  - Expiry: Any future date
  - CVV: Any 3 digits
  - OTP: Any 6 digits

### Cash on Delivery
- Select COD option during checkout
- Orders are created with payment status as "pending"

## 📦 Features Implemented

### ✅ Authentication
- Firebase Auth integration
- Email/Password login
- Google Sign-in
- Protected routes
- Role-based access (Admin/Customer)

### ✅ Admin Dashboard
- Product management (CRUD operations)
- Protected admin routes
- Real-time product updates
- Stock management
- Product image handling

### ✅ Payment Integration
- Razorpay payment gateway
- Order creation
- Payment verification
- Cash on Delivery option
- Secure payment flow

### ✅ Order Management
- Order creation and tracking
- Order status updates
- User order history
- Admin order management

### ✅ Shopping Features
- Product browsing and filtering
- Shopping cart functionality
- Wishlist management
- Search functionality
- Category-based navigation

## 🔧 Troubleshooting

### Backend won't start
- Check MongoDB connection
- Verify environment variables
- Check if port 5000 is available

### Firebase authentication fails
- Verify Firebase configuration
- Check API key restrictions
- Ensure Authentication is enabled in Firebase Console

### Razorpay payment fails
- Verify API keys
- Check if Test Mode is enabled
- Ensure backend is running
- Check CORS settings

### Frontend build errors
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (should be v14+)
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

## 📝 Environment Variables Reference

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `FIREBASE_CLIENT_EMAIL`: Firebase service account email
- `FIREBASE_PRIVATE_KEY`: Firebase service account private key
- `RAZORPAY_KEY_ID`: Razorpay key ID
- `RAZORPAY_KEY_SECRET`: Razorpay key secret
- `JWT_SECRET`: Secret for JWT tokens

### Frontend (.env)
- `VITE_API_URL`: Backend API URL
- `VITE_FIREBASE_API_KEY`: Firebase API key
- `VITE_FIREBASE_PROJECT_ID`: Firebase project ID
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `VITE_FIREBASE_APP_ID`: Firebase app ID

## 🚀 Deployment

### Backend Deployment
- Deploy to Heroku, Railway, or Vercel
- Set environment variables in deployment platform
- Ensure MongoDB is accessible (use MongoDB Atlas for production)

### Frontend Deployment
- Deploy to Vercel, Netlify, or GitHub Pages
- Set environment variables in deployment platform
- Update `VITE_API_URL` to production backend URL

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review console logs for errors
3. Verify all environment variables are set correctly
4. Ensure all services (MongoDB, Firebase, Razorpay) are properly configured

## 🎯 Next Steps

1. **Production Setup**: Use production keys for Razorpay
2. **Email Notifications**: Add order confirmation emails
3. **SMS Notifications**: Add SMS updates for order status
4. **Analytics**: Integrate analytics for user behavior
5. **Performance**: Optimize images and implement caching
6. **SEO**: Add meta tags and sitemap generation

---

**Note**: This is a complete e-commerce solution. Ensure you test all features thoroughly before going live.
