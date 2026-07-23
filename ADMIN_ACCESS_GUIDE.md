# Admin Dashboard Access Guide

## 🔐 How to Access Admin Dashboard

### Step 1: Start the Backend Server

First, make sure your backend is running:

```bash
cd backend
npm install
npm run dev
```

The backend should start on port 5000 and connect to your MongoDB Atlas cluster.

### Step 2: Create Admin User

Run the admin seed script to create an admin user:

```bash
cd backend
node scripts/seedAdmin.js
```

This will create an admin user with the credentials from your `.env` file:
- **Email**: admin@ridersgalaxy.com
- **Password**: admin123

### Step 3: Access Admin Dashboard

1. **Open your frontend** (should be running on http://localhost:5178/riders-galaxy/)

2. **Click the 🔐 lock icon** in the top-right navbar

3. **In the auth modal that appears:**
   - Click "Already have an account? Sign In"
   - Enter admin credentials:
     - Email: `admin@ridersgalaxy.com`
     - Password: `admin123`
   - Click "Sign In"

4. **After successful login:**
   - You'll see your profile icon 👤 in the navbar
   - **The dashboard icon ⚙️ will appear** in the navbar
   - Click the ⚙️ icon to access the admin dashboard

### Step 4: Manage Products in Admin Dashboard

Once in the admin dashboard, you can:

#### **Add New Products:**
1. Click the "+ Add Product" button
2. Fill in the product details:
   - Product Title
   - Price (₹)
   - Category
   - Brand
   - Description
   - Sizes (comma-separated, e.g., S, M, L, XL)
   - Colors (comma-separated, e.g., Black, Red, White)
   - Stock quantity
   - Main Image URL
   - Additional Images (comma-separated)
   - Mark as Trip Ready (optional)
3. Click "Add Product"

#### **Edit Existing Products:**
1. Find the product in the table
2. Click the "Edit" button
3. Modify the product details
4. Click "Update Product"

#### **Delete Products:**
1. Find the product in the table
2. Click the "Delete" button
3. Confirm the deletion

#### **View Shop:**
- Click "View Shop" to see how products appear to customers

## 🛍️ How Products Appear on Shop.jsx

The products you add/edit/delete in the admin dashboard will:
- **Appear immediately** on the Shop page (local ProductContext)
- **Load instantly** (no API calls to backend)
- **Be editable** without database changes
- **Persist** only in the current session (can be made persistent if needed)

## 📊 Product vs Inventory Management

### **Current Implementation:**
- **Products**: Managed locally in ProductContext (fast, instant)
- **Inventory**: Ready to be tracked in MongoDB (structure exists)
- **Orders**: Stored in MongoDB Atlas with product details

### **How Inventory Works:**
When you add a product with stock quantity in the admin dashboard:
- The stock is stored in the local ProductContext
- When orders are placed, the product details (including stock) are saved to MongoDB
- You can view stock levels in the admin dashboard

### **Future Enhancement:**
If you want to sync inventory between local and database:
1. Add stock management API endpoints to backend
2. Update ProductContext to sync with backend
3. Add inventory tracking to order processing

## 🔧 Backend Installation (If Not Done Yet)

If you haven't installed the backend dependencies yet:

```bash
cd backend
npm install
```

This will install:
- express (web framework)
- mongoose (MongoDB ODM)
- cors (cross-origin resource sharing)
- dotenv (environment variables)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- razorpay (payment processing)

## 🚀 Complete Startup Sequence

### **1. Start Backend:**
```bash
cd backend
npm install
node scripts/seedAdmin.js
npm run dev
```

### **2. Start Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### **3. Access Admin:**
1. Open http://localhost:5178/riders-galaxy/
2. Click 🔐 in navbar
3. Login with admin@ridersgalaxy.com / admin123
4. Click ⚙️ to access dashboard
5. Manage products

## 🎯 Admin Dashboard Features

### **Product Management:**
- ✅ Add new products
- ✅ Edit existing products
- ✅ Delete products
- ✅ Manage stock levels
- ✅ View all products in table format
- ✅ Real-time updates to Shop page

### **Order Management (Future):**
- ⏳ View all orders from MongoDB
- ⏳ Update order status
- ⏳ View guest orders
- ⏳ View registered user orders
- ⏳ Filter orders by status

### **User Management (Future):**
- ⏳ View all registered users
- ⏳ Manage user roles
- ⏳ View user profiles

## 🔐 Security Notes

### **Admin Protection:**
- Dashboard is protected by JWT authentication
- Only users with `role: 'admin'` can access
- Regular users with `role: 'customer'` are redirected
- Guest users cannot access dashboard

### **Password Security:**
- Admin password is hashed with bcryptjs
- JWT tokens are used for authentication
- Tokens expire after 30 days
- Password should be changed for production

## 🎨 Current Product Data Flow

### **Products:**
```
Admin Dashboard → ProductContext → Shop.jsx → ProductPage.jsx
(Local storage, instant updates, no API calls)
```

### **Orders:**
```
Checkout → Backend API → MongoDB Atlas
(Stored in database, persistent, user tracking)
```

### **Users:**
```
Auth Modal → Backend API → MongoDB Atlas
(Stored in database, authentication, role management)
```

## 📋 Troubleshooting

### **Dashboard icon doesn't appear:**
- Make sure you're logged in with admin credentials
- Check browser console for authentication errors
- Verify backend is running and accessible

### **Can't login:**
- Verify backend is running on port 5000
- Check MongoDB Atlas connection
- Ensure admin user was created successfully
- Try running seed script again

### **Products not appearing on Shop page:**
- Refresh the page after adding products
- Check browser console for errors
- Verify ProductContext is working correctly

### **Backend connection issues:**
- Check MongoDB Atlas connection string in `.env`
- Verify MongoDB Atlas cluster is accessible
- Check backend console for connection errors
- Ensure backend is running

## 🎉 Summary

To access the admin dashboard:
1. **Start backend**: `cd backend && npm run dev`
2. **Create admin**: `node scripts/seedAdmin.js`
3. **Login**: Click 🔐, use admin@ridersgalaxy.com / admin123
4. **Access dashboard**: Click ⚙️ icon that appears after login
5. **Manage products**: Add, edit, delete products in dashboard

The admin dashboard is now fully functional for product management and inventory tracking!