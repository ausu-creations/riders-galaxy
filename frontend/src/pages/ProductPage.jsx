import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import AutoImageCarousel from "../components/common/AutoImageCarousel";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import "../styles/global.css";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct } = useProducts();
  const product = getProduct(id);
  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "");
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState(product?.image || "");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!product) {
    return (
      <>
        <Header />
        <div className="container my-5">
          <h3>Product not found</h3>
          <p>The product you are looking for does not exist.</p>
          <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  // Handle thumbnail click with smooth transition
  const handleThumbnailClick = (image, index) => {
    if (currentImageIndex === index) return; // Don't transition if same image
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setMainImage(image);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <>
      <Header />
      <div className="product-page-container">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb py-3 mb-4">
            <a className="breadcrumb-item" href="/">Home</a>
            <a className="breadcrumb-item" href="/shop">Shop</a>
            <span className="breadcrumb-item active">{product.title}</span>
          </nav>

          <div className="row g-5">
            {/* Product Images Section */}
            <div className="col-lg-6">
              <div className="product-gallery">
                <div className="main-image-container mb-3">
                  <img 
                    src={mainImage} 
                    alt={product.title} 
                    className={`img-fluid main-product-image ${isTransitioning ? 'transitioning' : ''}`}
                  />
                </div>
                <div className="thumbnail-container d-flex gap-2">
                  {productImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      className={`thumbnail-image ${currentImageIndex === index ? 'active' : ''}`}
                      onClick={() => handleThumbnailClick(img, index)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="col-lg-6">
              <div className="product-details">
                <h1 className="product-title text-uppercase fw-black mb-2">{product.title}</h1>
                <p className="product-brand text-muted mb-3">{product.brand}</p>
                
                <div className="product-price-section mb-4">
                  <span className="product-price">₹{product.price.toFixed(2)}</span>
                  <span className="tax-info text-muted">Inclusive of all taxes</span>
                </div>

                {/* Color Selection */}
                {product.colors?.length > 0 && (
                  <div className="product-option-section mb-4">
                    <label className="option-label d-block mb-2">Color: <span className="selected-option">{selectedColor}</span></label>
                    <div className="color-options d-flex gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          className={`color-swatch ${selectedColor === c ? 'active' : ''}`}
                          style={{ backgroundColor: getColorCode(c) }}
                          onClick={() => setSelectedColor(c)}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {product.sizes?.length > 0 && (
                  <div className="product-option-section mb-4">
                    <label className="option-label d-block mb-2">Size: <span className="selected-option">{selectedSize}</span></label>
                    <div className="size-options d-flex gap-2 flex-wrap">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          className={`size-option ${selectedSize === s ? 'active' : ''}`}
                          onClick={() => setSelectedSize(s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <button className="size-chart-link mt-2">Size Chart</button>
                  </div>
                )}

                {/* Quantity */}
                <div className="product-option-section mb-4">
                  <label className="option-label d-block mb-2">Quantity</label>
                  <div className="quantity-selector d-flex align-items-center">
                    <button 
                      className="quantity-btn" 
                      onClick={() => setQty(Math.max(1, qty - 1))}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      value={qty} 
                      min="1" 
                      className="quantity-input text-center"
                      onChange={(e) => setQty(Number(e.target.value || 1))}
                    />
                    <button 
                      className="quantity-btn" 
                      onClick={() => setQty(qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="product-actions mb-4">
                  <button
                    className="btn btn-add-to-cart btn-primary w-100 mb-2"
                    onClick={() => {
                      addItem({ ...product, selectedSize, selectedColor }, qty);
                      openCart();
                    }}
                  >
                    Add to Cart
                  </button>
                  <button className="btn btn-buy-now btn-outline-primary w-100 mb-2">
                    Buy It Now
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="trust-badges row g-3 mb-4">
                  <div className="col-6">
                    <div className="trust-badge">
                      <div className="trust-icon">🚚</div>
                      <div className="trust-text">
                        <span className="trust-title">Free Delivery</span>
                        <span className="trust-subtitle">On orders above ₹999</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="trust-badge">
                      <div className="trust-icon">🔄</div>
                      <div className="trust-text">
                        <span className="trust-title">7 Days Replacement</span>
                        <span className="trust-subtitle">Easy returns</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="trust-badge">
                      <div className="trust-icon">🔒</div>
                      <div className="trust-text">
                        <span className="trust-title">Secure Payments</span>
                        <span className="trust-subtitle">100% protected</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="trust-badge">
                      <div className="trust-icon">🛡️</div>
                      <div className="trust-text">
                        <span className="trust-title">1 Year Warranty</span>
                        <span className="trust-subtitle">Manufacturer warranty</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="share-section">
                  <span className="share-label">Share:</span>
                  <button className="share-btn">Facebook</button>
                  <button className="share-btn">WhatsApp</button>
                  <button className="share-btn">Twitter</button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="product-description-section mt-5">
            <h2 className="section-title mb-4">Product Description</h2>
            <div className="description-content">
              <p className="lead mb-4">{product.description}</p>
              
              {product.category && (
                <div className="product-specs">
                  <h3 className="specs-title mb-3">Specifications</h3>
                  <ul className="specs-list">
                    <li><strong>Category:</strong> {product.category}</li>
                    <li><strong>Brand:</strong> {product.brand}</li>
                    {product.sizes?.length > 0 && <li><strong>Available Sizes:</strong> {product.sizes.join(', ')}</li>}
                    {product.colors?.length > 0 && <li><strong>Available Colors:</strong> {product.colors.join(', ')}</li>}
                    {product.tripReady && <li><strong>Trip Ready:</strong> Yes</li>}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="faq-section mt-5">
            <h2 className="section-title mb-4">Frequently Asked Questions</h2>
            <div className="accordion" id="faqAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                    How do I choose the right size?
                  </button>
                </h2>
                <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="accordion-body">
                    Use a measuring tape to measure your head circumference one inch above your eyebrows. Refer to our size chart to find your perfect fit.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                    What is the return policy?
                  </button>
                </h2>
                <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="accordion-body">
                    We offer 7 days replacement policy for manufacturing defects. The product must be unused and in original packaging.
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                    Is the product covered under warranty?
                  </button>
                </h2>
                <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="accordion-body">
                    Yes, all our products come with a 1-year manufacturer warranty against manufacturing defects.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

// Helper function to get color codes for common colors
function getColorCode(colorName) {
  const colorMap = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Red': '#FF0000',
    'Blue': '#0000FF',
    'Green': '#008000',
    'Yellow': '#FFFF00',
    'Orange': '#FFA500',
    'Purple': '#800080',
    'Brown': '#A52A2A',
    'Gray': '#808080',
    'Matte Black': '#1a1a1a',
    'Brushed': '#c0c0c0',
  };
  return colorMap[colorName] || '#CCCCCC';
}
