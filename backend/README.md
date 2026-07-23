# Riders Galaxy Backend API

Backend server for Riders Galaxy E-commerce Portal with Firebase Authentication and Razorpay Payment Integration.

## Features

- **Authentication**: Firebase Auth integration
- **Products**: Full CRUD operations for products
- **Orders**: Order management system
- **Payments**: Razorpay integration
- **Role-based Access**: Admin and customer roles

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- Firebase Project
- Razorpay Account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/riders-galaxy
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_DATABASE_URL=your-database-url
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret
JWT_SECRET=your-jwt-secret
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password, Google)
4. Go to Project Settings > Service Accounts
5. Generate a new private key
6. Copy the JSON content to your `.env` file

### Razorpay Setup

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Create an account
3. Get your Key ID and Key Secret from Settings > API Keys
4. Add them to your `.env` file

### Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with Firebase token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/users` - Get all users (admin only)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment signature
- `GET /api/payment/key` - Get Razorpay public key

## Database Models

### User
- firebaseUid, email, displayName, role, phone, addresses

### Product
- title, price, category, brand, description, sizes, colors, tripReady, image, images, stock, isActive

### Order
- userId, orderNumber, items, shippingAddress, paymentDetails, orderStatus, subtotal, shippingCost, total

## Security

- All protected routes require Firebase authentication
- Admin routes require admin role
- Payment signatures are verified with Razorpay
- MongoDB connection should use authentication in production
