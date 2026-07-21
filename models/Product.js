const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String }], // Array of image URLs
  description: { type: String },
  fitment: { type: String }, // For bike-specific parts (e.g., Royal Enfield Himalayan)
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);