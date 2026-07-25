import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import api from "../utils/api";
import Header from "../components/layout/Navbar";
import Footer from "../components/layout/footer";

function DashboardContent() {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(false);
  
  // Products state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    title: "", price: "", category: "", brand: "", description: "",
    sizes: "", colors: "", tripReady: false, image: "", images: "", stock: 0,
    sizeStock: {}, // New: individual stock for each size
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('');

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    name: "", email: "", password: "", phone: "", address: "", role: "customer",
  });

  // Fetch orders
  useEffect(() => {
    if (activeTab === 'orders') {
      console.log('Fetching orders...');
      fetchOrders();
    }
  }, [activeTab]);

  // Fetch users
  useEffect(() => {
    if (activeTab === 'users') {
      console.log('Fetching users...');
      fetchUsers();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await api.get('/orders');
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      console.error('Error details:', error.response?.data);
      setOrders([]); // Set empty array on error to prevent blank screen
      alert('Failed to fetch orders. Please check if backend is running.');
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await api.get('/auth/users');
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      console.error('Error details:', error.response?.data);
      setUsers([]); // Set empty array on error to prevent blank screen
      alert('Failed to fetch users. Please check if backend is running.');
    } finally {
      setUsersLoading(false);
    }
  };

  // Product handlers
  const handleProductSubmit = (e) => {
    e.preventDefault();
    
    const sizes = productFormData.sizes.split(",").map(s => s.trim()).filter(s => s);
    
    // Build sizeStock object from form data
    const sizeStock = {};
    sizes.forEach(size => {
      sizeStock[size] = parseInt(productFormData.sizeStock[size]) || 0;
    });
    
    const productData = {
      title: productFormData.title,
      price: parseFloat(productFormData.price),
      category: productFormData.category,
      brand: productFormData.brand,
      description: productFormData.description,
      sizes: sizes,
      colors: productFormData.colors.split(",").map(c => c.trim()).filter(c => c),
      tripReady: productFormData.tripReady,
      image: uploadedImageUrl || productFormData.image || "https://via.placeholder.com/300",
      images: productFormData.images.split(",").map(img => img.trim()).filter(img => img),
      stock: parseInt(productFormData.stock) || 0,
      sizeStock: sizeStock,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      setEditingProduct(null);
    } else {
      addProduct(productData);
    }

    setProductFormData({
      title: "", price: "", category: "", brand: "", description: "",
      sizes: "", colors: "", tripReady: false, image: "", images: "", stock: 0,
      sizeStock: {},
    });
    setUploadedImageUrl('');
    setShowProductForm(false);
  };

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.success) {
        setUploadedImageUrl(response.imageUrl);
        setProductFormData({ ...productFormData, image: response.imageUrl });
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle size stock change
  const handleSizeStockChange = (size, value) => {
    setProductFormData({
      ...productFormData,
      sizeStock: {
        ...productFormData.sizeStock,
        [size]: parseInt(value) || 0
      }
    });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    
    // Convert sizeStock array to object for form
    const sizeStockObj = {};
    if (product.sizeStock && product.sizeStock.length > 0) {
      product.sizeStock.forEach(item => {
        sizeStockObj[item.size] = item.stock;
      });
    }
    
    setProductFormData({
      title: product.title,
      price: product.price,
      category: product.category,
      brand: product.brand,
      description: product.description,
      sizes: product.sizes ? product.sizes.join(", ") : "",
      colors: product.colors ? product.colors.join(", ") : "",
      tripReady: product.tripReady || false,
      image: product.image,
      images: product.images ? product.images.join(", ") : "",
      stock: product.stock || 0,
      sizeStock: sizeStockObj,
    });
    setUploadedImageUrl(product.image || '');
    setShowProductForm(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  const handleCancelProduct = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setProductFormData({
      title: "", price: "", category: "", brand: "", description: "",
      sizes: "", colors: "", tripReady: false, image: "", images: "", stock: 0,
      sizeStock: {},
    });
    setUploadedImageUrl('');
  };

  // Order handlers
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      setLoading(true);
      await api.put(`/orders/${orderId}/status`, { orderStatus: status });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  // User handlers
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      if (editingUser) {
        await api.put(`/auth/users/${editingUser._id}`, userFormData);
      } else {
        await api.post('/auth/register', userFormData);
      }
      
      setUserFormData({
        name: "", email: "", password: "", phone: "", address: "", role: "customer",
      });
      setShowUserForm(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      password: "",
      phone: user.phone || "",
      address: user.address || "",
      role: user.role,
    });
    setShowUserForm(true);
  };

  const handleCancelUser = () => {
    setShowUserForm(false);
    setEditingUser(null);
    setUserFormData({
      name: "", email: "", password: "", phone: "", address: "", role: "customer",
    });
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        setLoading(true);
        await api.delete(`/auth/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleUserRole = async (userId, currentRole) => {
    try {
      setLoading(true);
      const newRole = currentRole === 'admin' ? 'customer' : 'admin';
      await api.put(`/auth/users/${userId}`, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="display-4 fw-bold">Admin Dashboard</h1>
          <p className="text-muted">Welcome, {user?.name || 'Admin'}</p>
        </div>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/shop")}
        >
          View Shop
        </button>
      </div>

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            📦 Products ({products.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📋 Orders ({orders.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users ({users.length})
          </button>
        </li>
      </ul>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Product Management</h3>
            <button className="btn btn-primary" onClick={() => setShowProductForm(true)}>
              + Add Product
            </button>
          </div>

          {showProductForm && (
            <div className="card mb-4 shadow">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">{editingProduct ? "Edit Product" : "Add New Product"}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleProductSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Product Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productFormData.title}
                        onChange={(e) => setProductFormData({ ...productFormData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={productFormData.price}
                        onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productFormData.category}
                        onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Brand</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productFormData.brand}
                        onChange={(e) => setProductFormData({ ...productFormData, brand: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={productFormData.description}
                      onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Sizes (comma-separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productFormData.sizes}
                        onChange={(e) => setProductFormData({ ...productFormData, sizes: e.target.value })}
                        placeholder="S, M, L, XL"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Colors (comma-separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productFormData.colors}
                        onChange={(e) => setProductFormData({ ...productFormData, colors: e.target.value })}
                        placeholder="Black, Red, White"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Total Stock</label>
                      <input
                        type="number"
                        className="form-control"
                        value={productFormData.stock}
                        onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                        min="0"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Size-wise inventory management */}
                  {productFormData.sizes && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">Size-wise Inventory</label>
                      <div className="row">
                        {productFormData.sizes.split(",").map((size, index) => {
                          const trimmedSize = size.trim();
                          if (!trimmedSize) return null;
                          return (
                            <div key={index} className="col-md-3 mb-2">
                              <label className="form-label small">{trimmedSize} Stock</label>
                              <input
                                type="number"
                                className="form-control"
                                value={productFormData.sizeStock[trimmedSize] || 0}
                                onChange={(e) => handleSizeStockChange(trimmedSize, e.target.value)}
                                min="0"
                                placeholder="0"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Main Image</label>
                      <div className="d-flex gap-2">
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleImageUpload}
                          accept="image/*"
                          disabled={uploadingImage}
                        />
                        {uploadingImage && (
                          <span className="text-muted">Uploading...</span>
                        )}
                      </div>
                      {uploadedImageUrl && (
                        <div className="mt-2">
                          <img 
                            src={uploadedImageUrl} 
                            alt="Preview" 
                            style={{ maxWidth: '100px', maxHeight: '100px' }}
                            className="border rounded"
                          />
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Image URL (optional)</label>
                      <input
                        type="url"
                        className="form-control"
                        value={productFormData.image}
                        onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Additional Images (comma-separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productFormData.images}
                        onChange={(e) => setProductFormData({ ...productFormData, images: e.target.value })}
                        placeholder="url1, url2, url3"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={productFormData.tripReady}
                        onChange={(e) => setProductFormData({ ...productFormData, tripReady: e.target.checked })}
                      />
                      <label className="form-check-label">Mark as Trip Ready</label>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      {editingProduct ? "Update Product" : "Add Product"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancelProduct}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="card shadow">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Products ({products.length})</h5>
            </div>
            <div className="card-body p-0">
              {products.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <span style={{ fontSize: '3rem' }}>📦</span>
                  </div>
                  <h4 className="text-muted">No products yet!</h4>
                  <p className="text-muted">Add your first product to get started.</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setShowProductForm(true)}
                  >
                    + Add Your First Product
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Trip Ready</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>
                            <img
                              src={product.image}
                              alt={product.title}
                              style={{ width: 50, height: 50, objectFit: "cover" }}
                              className="rounded"
                            />
                          </td>
                          <td>
                            <div className="fw-bold">{product.title}</div>
                            {product.sizeStock && product.sizeStock.length > 0 && (
                              <small className="text-muted">
                                {product.sizeStock.map(item => `${item.size}: ${item.stock}`).join(', ')}
                              </small>
                            )}
                          </td>
                          <td>{product.category}</td>
                          <td>{product.brand || "-"}</td>
                          <td>₹{product.price.toFixed(2)}</td>
                          <td>
                            <span className={`badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                              {product.stock || 0}
                            </span>
                          </td>
                          <td>{product.tripReady ? '✅' : '❌'}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={() => handleEditProduct(product)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Order Management</h3>
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Filter by status..."
                value={selectedOrderStatus}
                onChange={(e) => setSelectedOrderStatus(e.target.value)}
              />
              <button className="btn btn-outline-secondary" onClick={() => setSelectedOrderStatus('')}>
                Clear
              </button>
            </div>
          </div>

          {ordersLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="alert alert-info text-center py-5">
              <div className="mb-3">
                <span style={{ fontSize: '3rem' }}>📋</span>
              </div>
              <h4 className="alert-heading">Nothing to see here yet!</h4>
              <p className="mb-0">Orders will appear here when customers start making purchases on your shop.</p>
              <p className="mb-0 text-muted small">Head over to the shop to make a test order!</p>
            </div>
          ) : (
            <div className="card shadow">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">Orders ({orders.length})</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .filter(order => !selectedOrderStatus || order.orderStatus === selectedOrderStatus)
                        .map((order) => (
                        <tr key={order._id}>
                          <td>{order.orderNumber || order._id}</td>
                          <td>
                            {order.userId ? (
                              <span>{order.userId?.name || 'Registered User'}</span>
                            ) : (
                              <span className="text-muted">
                                Guest: {order.guestInfo?.name}
                              </span>
                            )}
                          </td>
                          <td>{order.items?.length || 0} items</td>
                          <td>₹{order.total?.toFixed(2) || '0'}</td>
                          <td>
                            <span className={`badge ${order.paymentDetails?.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                              {order.paymentDetails?.method === 'online' ? 'Online' : 'COD'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${
                              order.orderStatus === 'delivered' ? 'bg-success' :
                              order.orderStatus === 'shipped' ? 'bg-info' :
                              order.orderStatus === 'processing' ? 'bg-warning' :
                              order.orderStatus === 'cancelled' ? 'bg-danger' : 'bg-secondary'
                            }`}>
                              {order.orderStatus || 'pending'}
                            </span>
                          </td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={order.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              disabled={loading}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>User Management</h3>
            <button className="btn btn-primary" onClick={() => setShowUserForm(true)}>
              + Add User
            </button>
          </div>

          {showUserForm && (
            <div className="card mb-4 shadow">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">{editingUser ? "Edit User" : "Add New User"}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleUserSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={userFormData.name}
                        onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={userFormData.email}
                        onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                        required
                        disabled={editingUser}
                      />
                    </div>
                  </div>

                  {!editingUser && (
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={userFormData.password || ''}
                        onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                        required
                        minLength={6}
                      />
                    </div>
                  )}

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={userFormData.phone}
                        onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Role</label>
                      <select
                        className="form-select"
                        value={userFormData.role}
                        onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={userFormData.address}
                      onChange={(e) => setUserFormData({ ...userFormData, address: e.target.value })}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success" disabled={loading}>
                      {loading ? 'Processing...' : editingUser ? "Update User" : "Add User"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancelUser}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {usersLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="alert alert-info text-center py-5">
              <div className="mb-3">
                <span style={{ fontSize: '3rem' }}>👥</span>
              </div>
              <h4 className="alert-heading">No users here yet!</h4>
              <p className="mb-0">User accounts will appear here when people register on your shop.</p>
              <p className="mb-0 text-muted small">You can also manually add users using the "+ Add User" button above.</p>
            </div>
          ) : (
            <div className="card shadow">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">Users ({users.length})</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.phone || '-'}</td>
                          <td>
                            <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={() => handleEditUser(user)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-warning me-1"
                              onClick={() => handleToggleUserRole(user._id, user.role)}
                            >
                              {user.role === 'admin' ? 'Make Customer' : 'Make Admin'}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <Header />
      <DashboardContent />
      <Footer />
    </ProtectedRoute>
  );
}