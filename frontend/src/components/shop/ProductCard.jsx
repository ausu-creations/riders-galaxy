import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const { addItem, openCart } = useCart();

  const handleAddToCart = () => {
    addItem(product, 1);
    openCart();
  };

  return (
    <div className="card h-100">
      <img
        src={product.image}
        className="card-img-top"
        alt={product.title}
        style={{ objectFit: "cover", height: 160 }}
      />
      <div className="card-body d-flex flex-column">
        <h6 className="card-title">{product.title}</h6>
        <p className="card-text text-muted mb-2">{product.category}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <strong>₹{product.price.toFixed(2)}</strong>
          <div>
            <Link to={`/shop/product/${product.id}`} className="btn btn-sm btn-outline-primary me-2">
              View
            </Link>
            <button
              className="btn btn-sm btn-primary"
              onClick={handleAddToCart}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
