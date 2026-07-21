import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return <p>No products match the current filters.</p>;
  }

  return (
    <div className="row g-3">
      {products.map((p) => (
        <div key={p.id} className="col-6 col-md-4 col-lg-3">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
