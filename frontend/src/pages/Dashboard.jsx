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
  const { products, addProduct, updateProduct, deleteProduct, fetchProducts, loading: productsLoading } = useProducts();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(false);
  
  // Products state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    title: "", price: "", category: "", brand: "", description: "",
    sizes: "", colors: "", tripReady: false, image: "", images: [], stock: 0,
    sizeStock: {}, // New: individual stock for each size
    colorImages: {}, // New: color-specific images mapping (arrays of images per color)
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [colorImageUploads, setColorImageUploads] = useState({}); // Track uploads per color
  
  // Dynamic brands and categories from existing products
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [showOtherBrand, setShowOtherBrand] = useState(false);
  const [showOtherCategory, setShowOtherCategory] = useState(false);
  
  // Predefined sizes for checkboxes
  const PREDEFINED_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

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

  // Extract unique brands and categories from products
  useEffect(() => {
    const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
    const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
    
    // Ensure "Others" is always at the end if present
    const brandOthersIndex = uniqueBrands.indexOf("Others");
    if (brandOthersIndex > -1) {
      uniqueBrands.splice(brandOthersIndex, 1);
      uniqueBrands.push("Others");
    }
    
    const categoryOthersIndex = uniqueCategories.indexOf("Others");
    if (categoryOthersIndex > -1) {
      uniqueCategories.splice(categoryOthersIndex, 1);
      uniqueCategories.push("Others");
    }
    
    setAvailableBrands(uniqueBrands);
    setAvailableCategories(uniqueCategories);
  }, [products]);

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
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    const sizes = productFormData.sizes.split(",").map(s => s.trim()).filter(s => s);
    
    // Build sizeStock object from form data
    const sizeStock = {};
    sizes.forEach(size => {
      sizeStock[size] = parseInt(productFormData.sizeStock[size]) || 0;
    });
    
    // Determine the best main image to save (never save placeholders)
    let mainImageToSave;
    if (productFormData.image && !productFormData.image.includes('placeholder') && !productFormData.image.includes('via.placeholder')) {
      mainImageToSave = productFormData.image;
    } else if (productFormData.images && productFormData.images.length > 0) {
      mainImageToSave = productFormData.images[0];
    } else if (productFormData.colorImages && Object.keys(productFormData.colorImages).length > 0) {
      const firstColorKey = Object.keys(productFormData.colorImages)[0];
      const firstColorImages = productFormData.colorImages[firstColorKey];
      if (firstColorImages && firstColorImages.length > 0) {
        mainImageToSave = firstColorImages[0];
      }
    }
    
    // Only use fallback if absolutely necessary
    if (!mainImageToSave) {
      mainImageToSave = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop";
    }
    
    console.log('Saving product with main image:', mainImageToSave);
    
    const productData = {
      title: productFormData.title,
      price: parseFloat(productFormData.price),
      category: productFormData.category,
      brand: productFormData.brand,
      description: productFormData.description,
      sizes: sizes,
      colors: productFormData.colors.split(",").map(c => c.trim()).filter(c => c),
      tripReady: productFormData.tripReady,
      image: mainImageToSave,
      images: productFormData.images,
      stock: parseInt(productFormData.stock) || 0,
      sizeStock: sizeStock,
      colorImages: productFormData.colorImages || {}, // Include color-specific images (arrays per color)
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        setEditingProduct(null);
        // Refresh products to ensure latest data
        await fetchProducts();
      } else {
        await addProduct(productData);
      }

      setProductFormData({
        title: "", price: "", category: "", brand: "", description: "",
        sizes: "", colors: "", tripReady: false, image: "", images: [], stock: 0,
        sizeStock: {},
        colorImages: {},
      });
      setUploadedImages([]);
      setColorImageUploads({});
      setShowProductForm(false);
      setShowOtherBrand(false);
      setShowOtherCategory(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  // Image upload handler (multiple images)
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    console.log('Starting image upload for files:', files.map(f => f.name));
    setUploadingImage(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      console.log('Sending upload request to /upload/images');
      const response = await api.post('/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response);

      if (response.success) {
        const newImages = response.imageUrls;
        console.log('Received image URLs:', newImages);
        setUploadedImages([...uploadedImages, ...newImages]);
        
        // Only update main image if there were no regular images before
        const hadNoRegularImages = !productFormData.images || productFormData.images.length === 0;
        
        setProductFormData({ 
          ...productFormData, 
          images: [...productFormData.images, ...newImages],
          // Update main image only if there were no regular images before
          ...(hadNoRegularImages && {
            image: response.imageUrls[0] || 
                   (productFormData.colorImages && Object.values(productFormData.colorImages)[0]?.[0]) || 
                   "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
          })
        });
      } else {
        console.error('Upload failed:', response);
        alert('Upload failed: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload images: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    
    // Check if the removed image was the main image
    const wasMainImage = productFormData.image === uploadedImages[index];
    const shouldUpdateMainImage = wasMainImage;
    
    // Find new main image if needed
    let newMainImage = productFormData.image;
    if (shouldUpdateMainImage) {
      // Try to use remaining regular images, then color images, then fallback
      newMainImage = newImages[0] || 
                    (productFormData.colorImages && Object.values(productFormData.colorImages)[0]?.[0]) || 
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop";
    }
    
    setProductFormData({ 
      ...productFormData, 
      images: newImages,
      image: newMainImage
    });
  };

  // Handle color-specific image upload (multiple images per color)
  const handleColorImageUpload = async (color, e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    console.log(`Starting image upload for color ${color}:`, files.map(f => f.name));
    setColorImageUploads({ ...colorImageUploads, [color]: true });
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      console.log(`Sending upload request for color ${color} with ${files.length} files`);
      const response = await api.post('/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(`Upload response for color ${color}:`, response);

      if (response.success && response.imageUrls.length > 0) {
        // Get existing images for this color or initialize empty array
        const existingColorImages = productFormData.colorImages[color] || [];
        const newColorImages = [...existingColorImages, ...response.imageUrls];
        
        console.log(`Setting images for color ${color}:`, newColorImages);
        
        // Update main image if there are no regular images
        const shouldUpdateMainImage = !productFormData.images || productFormData.images.length === 0;
        
        setProductFormData({ 
          ...productFormData, 
          colorImages: {
            ...productFormData.colorImages,
            [color]: newColorImages
          },
          // Update main image if needed (prefer first color image)
          ...(shouldUpdateMainImage && {
            image: newColorImages[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
          })
        });
      } else {
        console.error('Upload failed:', response);
        alert('Upload failed: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Color image upload error:', error);
      alert('Failed to upload color image: ' + (error.response?.data?.error || error.message));
    } finally {
      setColorImageUploads({ ...colorImageUploads, [color]: false });
    }
  };

  // Remove specific color image
  const handleRemoveColorImage = (color, imageIndex) => {
    const existingColorImages = productFormData.colorImages[color] || [];
    const newColorImages = existingColorImages.filter((_, index) => index !== imageIndex);
    
    // Check if the removed image was the main image and there are no regular images
    const wasMainImage = productFormData.image === existingColorImages[imageIndex];
    const hasRegularImages = productFormData.images && productFormData.images.length > 0;
    const shouldUpdateMainImage = wasMainImage && !hasRegularImages;
    
    // Find new main image if needed
    let newMainImage = productFormData.image;
    if (shouldUpdateMainImage) {
      // Try to use remaining color images
      const allColorImages = Object.values(productFormData.colorImages).flat();
      newMainImage = allColorImages[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop";
    }
    
    setProductFormData({ 
      ...productFormData, 
      colorImages: {
        ...productFormData.colorImages,
        [color]: newColorImages
      },
      ...(shouldUpdateMainImage && { image: newMainImage })
    });
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

  // Handle size checkbox change
  const handleSizeCheckboxChange = (size) => {
    const currentSizes = productFormData.sizes ? productFormData.sizes.split(",").map(s => s.trim()).filter(s => s) : [];
    
    if (currentSizes.includes(size)) {
      // Remove size
      const newSizes = currentSizes.filter(s => s !== size);
      setProductFormData({
        ...productFormData,
        sizes: newSizes.join(", "),
        sizeStock: {
          ...productFormData.sizeStock,
          [size]: 0 // Reset stock for removed size
        }
      });
    } else {
      // Add size
      const newSizes = [...currentSizes, size];
      setProductFormData({
        ...productFormData,
        sizes: newSizes.join(", "),
        sizeStock: {
          ...productFormData.sizeStock,
          [size]: 0 // Initialize stock for new size
        }
      });
    }
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
    
    // Check if brand or category is not in available lists
    const brandInList = availableBrands.includes(product.brand);
    const categoryInList = availableCategories.includes(product.category);
    
    setShowOtherBrand(!brandInList && product.brand);
    setShowOtherCategory(!categoryInList && product.category);
    
    // Handle sizes - if product has custom sizes not in predefined list, keep them as text
    const productSizes = product.sizes || [];
    const hasCustomSizes = productSizes.some(size => !PREDEFINED_SIZES.includes(size));
    
    // Determine the best main image (avoid placeholders)
    let mainImage;
    
    // First priority: Use the existing main image if it's valid
    if (product.image && 
        !product.image.includes('placeholder') && 
        !product.image.includes('via.placeholder') &&
        !product.image.includes('via.placeholder.com')) {
      mainImage = product.image;
    } 
    // Second priority: Use first regular image if available
    else if (product.images && product.images.length > 0) {
      mainImage = product.images[0];
    }
    // Third priority: Use first color image if available
    else if (product.colorImages && Object.keys(product.colorImages).length > 0) {
      const firstColorKey = Object.keys(product.colorImages)[0];
      const firstColorImages = product.colorImages[firstColorKey];
      if (firstColorImages && firstColorImages.length > 0) {
        mainImage = firstColorImages[0];
      }
    }
    
    // Final fallback
    if (!mainImage) {
      mainImage = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop";
    }
    
    console.log('Loading product colorImages:', product.colorImages);
    console.log('Loading product colorImages type:', typeof product.colorImages);
    console.log('Loading product colorImages keys:', product.colorImages ? Object.keys(product.colorImages) : 'none');
    
    setProductFormData({
      title: product.title,
      price: product.price,
      category: product.category,
      brand: product.brand,
      description: product.description,
      sizes: hasCustomSizes ? productSizes.join(", ") : productSizes.join(", "),
      colors: product.colors ? product.colors.join(", ") : "",
      tripReady: product.tripReady || false,
      image: mainImage,
      images: product.images || [],
      stock: product.stock || 0,
      sizeStock: sizeStockObj,
      colorImages: product.colorImages || {}, // Load color-specific images (already converted by backend)
    });
    
    console.log('Set productFormData colorImages:', productFormData.colorImages);
    
    setUploadedImages(product.images || []);
    setColorImageUploads({});
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleCancelProduct = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setProductFormData({
      title: "", price: "", category: "", brand: "", description: "",
      sizes: "", colors: "", tripReady: false, image: "", images: [], stock: 0,
      sizeStock: {},
      colorImages: {},
    });
    setUploadedImages([]);
    setColorImageUploads({});
    setShowOtherBrand(false);
    setShowOtherCategory(false);
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

          {productsLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading products...</p>
            </div>
          ) : (
            <>
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
                          <select
                            className="form-control"
                            value={productFormData.category}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === 'other') {
                                setShowOtherCategory(true);
                                setProductFormData({ ...productFormData, category: '' });
                              } else {
                                setShowOtherCategory(false);
                                setProductFormData({ ...productFormData, category: value });
                              }
                            }}
                            required={!showOtherCategory}
                          >
                            <option value="">Select Category</option>
                            {availableCategories.filter(cat => cat !== "Others").map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                            {availableCategories.includes("Others") && (
                              <option key="Others" value="Others">Others</option>
                            )}
                            <option value="other">Other (add new)</option>
                          </select>
                          {showOtherCategory && (
                            <input
                              type="text"
                              className="form-control mt-2"
                              placeholder="Enter new category"
                              value={productFormData.category}
                              onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                              required
                            />
                          )}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Brand</label>
                          <select
                            className="form-control"
                            value={productFormData.brand}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === 'other') {
                                setShowOtherBrand(true);
                                setProductFormData({ ...productFormData, brand: '' });
                              } else {
                                setShowOtherBrand(false);
                                setProductFormData({ ...productFormData, brand: value });
                              }
                            }}
                            required={!showOtherBrand}
                          >
                            <option value="">Select Brand</option>
                            {availableBrands.filter(brand => brand !== "Others").map(brand => (
                              <option key={brand} value={brand}>{brand}</option>
                            ))}
                            {availableBrands.includes("Others") && (
                              <option key="Others" value="Others">Others</option>
                            )}
                            <option value="other">Other (add new)</option>
                          </select>
                          {showOtherBrand && (
                            <input
                              type="text"
                              className="form-control mt-2"
                              placeholder="Enter new brand"
                              value={productFormData.brand}
                              onChange={(e) => setProductFormData({ ...productFormData, brand: e.target.value })}
                              required
                            />
                          )}
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
                          <label className="form-label">Sizes</label>
                          <div className="size-checkboxes">
                            {PREDEFINED_SIZES.map((size) => {
                              const currentSizes = productFormData.sizes ? productFormData.sizes.split(",").map(s => s.trim()).filter(s => s) : [];
                              const isChecked = currentSizes.includes(size);
                              return (
                                <div key={size} className="form-check form-check-inline">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`size-${size}`}
                                    checked={isChecked}
                                    onChange={() => handleSizeCheckboxChange(size)}
                                  />
                                  <label className="form-check-label" htmlFor={`size-${size}`}>
                                    {size}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                          {/* Show custom sizes input if product has sizes not in predefined list */}
                          {productFormData.sizes && (() => {
                            const currentSizes = productFormData.sizes.split(",").map(s => s.trim()).filter(s => s);
                            const hasCustomSizes = currentSizes.some(size => !PREDEFINED_SIZES.includes(size));
                            if (hasCustomSizes) {
                              return (
                                <div className="mt-2">
                                  <label className="form-label small text-muted">Custom Sizes (comma-separated)</label>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    value={currentSizes.filter(size => !PREDEFINED_SIZES.includes(size)).join(", ")}
                                    onChange={(e) => {
                                      const customSizes = e.target.value.split(",").map(s => s.trim()).filter(s => s);
                                      const predefinedSelected = PREDEFINED_SIZES.filter(size => currentSizes.includes(size));
                                      const allSizes = [...predefinedSelected, ...customSizes];
                                      setProductFormData({ ...productFormData, sizes: allSizes.join(", ") });
                                    }}
                                    placeholder="8, 9, 10"
                                  />
                                </div>
                              );
                            }
                            return null;
                          })()}
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
                        <div className="col-md-12 mb-3">
                          <label className="form-label">Product Images</label>
                          <div className="d-flex gap-2">
                            <input
                              type="file"
                              className="form-control"
                              onChange={handleImageUpload}
                              accept="image/*"
                              disabled={uploadingImage}
                              multiple
                            />
                            {uploadingImage && (
                              <span className="text-muted">Uploading...</span>
                            )}
                          </div>

                          {/* Image Previews */}
                          {uploadedImages.length > 0 && (
                            <div className="mt-3">
                              <label className="form-label small">Uploaded Images:</label>
                              <div className="d-flex gap-2 flex-wrap">
                                {uploadedImages.map((imageUrl, index) => (
                                  <div key={index} className="position-relative">
                                    <img
                                      src={imageUrl}
                                      alt={`Preview ${index + 1}`}
                                      style={{
                                        maxWidth: '100px',
                                        maxHeight: '100px',
                                        objectFit: 'cover'
                                      }}
                                      className="border rounded"
                                    />
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                      onClick={() => handleRemoveImage(index)}
                                      style={{
                                        width: '20px',
                                        height: '20px',
                                        padding: '0',
                                        borderRadius: '50%'
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Color-Specific Images Section */}
                      {productFormData.colors && (
                        <div className="row mb-3">
                          <div className="col-md-12">
                            <label className="form-label">Color-Specific Images <span className="text-muted small">(No limit - upload as many as you want)</span></label>
                            <div className="card bg-light">
                              <div className="card-body">
                                {productFormData.colors.split(",").map(c => c.trim()).filter(c => c).map((color) => (
                                  <div key={color} className="mb-3 p-2 border rounded">
                                    <div className="d-flex align-items-center mb-2">
                                      <strong className="me-2">{color}:</strong>
                                      <span className="text-muted small">
                                        {productFormData.colorImages[color]?.length || 0} image(s) uploaded
                                      </span>
                                    </div>
                                    
                                    {/* Display multiple images for this color */}
                                    {productFormData.colorImages[color] && productFormData.colorImages[color].length > 0 && (
                                      <div className="d-flex gap-2 flex-wrap mb-2">
                                        {productFormData.colorImages[color].map((imageUrl, index) => (
                                          <div key={index} className="position-relative">
                                            <img
                                              src={imageUrl}
                                              alt={`${color} variant ${index + 1}`}
                                              style={{
                                                maxWidth: '60px',
                                                maxHeight: '60px',
                                                objectFit: 'cover'
                                              }}
                                              className="border rounded"
                                            />
                                            <button
                                              type="button"
                                              className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                              onClick={() => handleRemoveColorImage(color, index)}
                                              style={{
                                                width: '20px',
                                                height: '20px',
                                                padding: '0',
                                                borderRadius: '50%',
                                                fontSize: '12px'
                                              }}
                                            >
                                              ×
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    
                                    {/* Upload button for this color */}
                                    <div className="d-flex gap-2 align-items-center">
                                      <input
                                        type="file"
                                        className="form-control form-control-sm"
                                        onChange={(e) => handleColorImageUpload(color, e)}
                                        accept="image/*"
                                        disabled={colorImageUploads[color]}
                                        multiple
                                      />
                                      {colorImageUploads[color] && (
                                        <span className="text-muted small">Uploading...</span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                                {(!productFormData.colors || productFormData.colors.split(",").map(c => c.trim()).filter(c => c).length === 0) && (
                                  <p className="text-muted small mb-0">Add colors above to enable color-specific images</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

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
                              src={product.image || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"}
                              alt={product.title}
                              style={{ width: 50, height: 50, objectFit: "cover" }}
                              className="rounded"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop";
                              }}
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
          </>
        )}
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