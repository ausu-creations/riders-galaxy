import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, viewMode = "grid" }) {
  if (!products || products.length === 0) {
    return <p>No products match the current filters.</p>;
  }

  if (viewMode === "list") {
    return (
      <div className="row g-4">
        {products.map((p) => (
          <div key={p.id} className="col-12">
            <ProductCard product={p} viewMode="list" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="row g-4">
      {products.map((p) => (
        <div key={p.id} className="col-6 col-md-4 col-lg-3">
          <ProductCard product={p} viewMode="grid" />
        </div>
      ))}
    </div>
  );
}
