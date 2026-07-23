import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import AutoImageCarousel from "../components/common/AutoImageCarousel";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct } = useProducts();
  const product = getProduct(id);
  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "");
  const [qty, setQty] = useState(1);

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

  return (
    <>
      <Header />
      <div className="container my-5">
        <div className="row g-4">
          <div className="col-md-6">
            <AutoImageCarousel images={product.images} />
          </div>

          <div className="col-md-6">
            <h2 className="fw-black text-uppercase">{product.title}</h2>
            <p className="text-muted">{product.brand}</p>
            <h3 className="text-primary">₹{product.price.toFixed(2)}</h3>
            <p className="lead">{product.description}</p>

            {product.sizes?.length > 0 && (
              <div className="mb-3 product-option-group">
                <label className="d-block mb-1">Size</label>
                <div className="product-option-buttons">
                  {product.sizes.map((s) => (
                    <button key={s} className={`btn btn-outline-secondary ${selectedSize === s ? "active" : ""}`} onClick={() => setSelectedSize(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors?.length > 0 && (
              <div className="mb-3 product-option-group">
                <label className="d-block mb-1">Color</label>
                <div className="product-option-buttons">
                  {product.colors.map((c) => (
                    <button key={c} className={`btn btn-outline-secondary ${selectedColor === c ? "active" : ""}`} onClick={() => setSelectedColor(c)}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-3 quantity-group">
              <label className="d-block mb-1">Quantity</label>
              <input type="number" value={qty} min={1} className="form-control quantity-input" onChange={(e) => setQty(Number(e.target.value || 1))} />
            </div>

            <div className="product-action-group">
              <button
                className="btn btn-primary"
                onClick={() => {
                  addItem({ ...product, selectedSize, selectedColor }, qty);
                  openCart();
                }}
              >
                Add to Cart
              </button>
              <button className="btn btn-outline-primary">Buy Now</button>
              <button className="btn btn-light wishlist-btn" title="Add to wishlist">♡</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
