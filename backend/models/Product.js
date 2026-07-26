const mongoose = require('mongoose');

const sizeStockSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: String,
  description: {
    type: String,
    required: true,
  },
  sizes: [String],
  colors: [String],
  sizeStock: [sizeStockSchema], // Individual stock for each size
  tripReady: {
    type: Boolean,
    default: false,
  },
  image: String,
  images: [String],
  stock: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Method to get total stock across all sizes
productSchema.methods.getTotalStock = function() {
  if (this.sizeStock && this.sizeStock.length > 0) {
    return this.sizeStock.reduce((total, item) => total + item.stock, 0);
  }
  return this.stock || 0;
};

// Method to get stock for a specific size
productSchema.methods.getStockForSize = function(size) {
  if (this.sizeStock && this.sizeStock.length > 0) {
    const sizeItem = this.sizeStock.find(item => item.size === size);
    return sizeItem ? sizeItem.stock : 0;
  }
  return this.stock || 0;
};

// Method to update stock for a specific size
productSchema.methods.updateStockForSize = function(size, quantity) {
  if (!this.sizeStock) {
    this.sizeStock = [];
  }
  
  const sizeIndex = this.sizeStock.findIndex(item => item.size === size);
  if (sizeIndex >= 0) {
    this.sizeStock[sizeIndex].stock = Math.max(0, quantity);
  } else {
    this.sizeStock.push({ size, stock: Math.max(0, quantity) });
  }
  
  // Update total stock
  this.stock = this.getTotalStock();
};

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-sync sizeStock with sizes array
  if (this.sizes && this.sizeStock) {
    // Remove stock entries for sizes that no longer exist
    this.sizeStock = this.sizeStock.filter(item => this.sizes.includes(item.size));
    
    // Add stock entries for new sizes
    this.sizes.forEach(size => {
      if (!this.sizeStock.find(item => item.size === size)) {
        this.sizeStock.push({ size, stock: 0 });
      }
    });
  }
  
  next();
});

module.exports = mongoose.model('Product', productSchema);
