import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import ProductGrid from "../components/shop/ProductGrid";
import productsData from "../data/products";

const DEFAULT_WISHLIST_IDS = [1, 3, 5];

export default function Wishlist() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q") || "";

  const wishlistItems = useMemo(
    () => productsData.filter((product) => DEFAULT_WISHLIST_IDS.includes(product.id)),
    []
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return wishlistItems;
    const query = search.toLowerCase();

    return wishlistItems.filter((product) => {
      return (
        product.title.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    });
  }, [search, wishlistItems]);

  const searchString = searchParams.toString();
  const shopLink = searchString ? `/shop?${searchString}` : "/shop";

  return (
    <>
      <Header />
      <div className="container my-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h1 className="fw-black">Wishlist</h1>
            <p className="text-muted mb-0">Saved products you want to revisit later.</p>
          </div>
          <div className="d-flex justify-content-end w-100 w-md-50">
            <Link to={shopLink} className="btn btn-outline-secondary">
              Continue shopping
            </Link>
          </div>
        </div>

        <ProductGrid products={filtered} />
      </div>
      <Footer />
    </>
  );
}
