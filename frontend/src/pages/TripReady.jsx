import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import FiltersSidebar from "../components/shop/FiltersSidebar";
import ProductGrid from "../components/shop/ProductGrid";
import productsData from "../data/products";

export default function TripReady() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState("newest");
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") || "";

  const tripReadyProducts = useMemo(
    () => productsData.filter((product) => product.tripReady),
    []
  );

  const categories = useMemo(() => {
    return Array.from(new Set(tripReadyProducts.map((p) => p.category)));
  }, [tripReadyProducts]);

  const brands = useMemo(() => {
    return Array.from(new Set(tripReadyProducts.map((p) => p.brand).filter(Boolean)));
  }, [tripReadyProducts]);

  useEffect(() => {
    const prices = tripReadyProducts.map((p) => p.price || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    setPriceRange({ min, max });
  }, [tripReadyProducts]);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const brandParam = searchParams.get("brand");

    if (categoryParam) {
      const matched = categories.find((c) => c.toLowerCase().includes(categoryParam.toLowerCase()));
      if (matched) setSelectedCategories([matched]);
    }

    if (brandParam) {
      const matched = brands.find((b) => b.toLowerCase().includes(brandParam.toLowerCase()));
      if (matched) setSelectedBrands([matched]);
    }
  }, [searchParams, categories, brands]);

  const filtered = useMemo(() => {
    function normalize(str = "") {
      return str.toLowerCase().replace(/[^a-z0-9]+/gi, " ").trim();
    }

    const res = tripReadyProducts.filter((p) => {
      const combined = normalize([p.title, p.category, p.brand].join(" "));

      if (selectedCategories.length) {
        const ok = selectedCategories.some((sel) => {
          const selNorm = normalize(sel);
          return combined.includes(selNorm.split(" ")[0]);
        });
        if (!ok) return false;
      }

      if (selectedBrands.length && !selectedBrands.includes(p.brand)) {
        return false;
      }

      if (p.price < (priceRange.min || 0) || p.price > (priceRange.max || Infinity)) {
        return false;
      }

      if (search) {
        if (!combined.includes(normalize(search))) return false;
      }

      return true;
    });

    if (sortBy === "price-asc") return res.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") return res.sort((a, b) => b.price - a.price);
    return res.sort((a, b) => b.id - a.id);
  }, [tripReadyProducts, selectedCategories, selectedBrands, priceRange, sortBy, search]);

  function clearFilters() {
    setSelectedCategories([]);
    setSelectedBrands([]);
    const prices = tripReadyProducts.map((p) => p.price || 0);
    setPriceRange({ min: Math.min(...prices), max: Math.max(...prices) });
    setSortBy("newest");
    setSearchParams({});
  }

  return (
    <>
      <Header />
      <div className="container my-4">
        <div className="mb-5">
          <h1 className="display-5 fw-black text-uppercase mb-3">Trip Ready Gear</h1>
          <p className="lead text-muted mb-0">A curated selection of long touring essentials for riders who want comfort, protection, and connectivity on the road.</p>
        </div>
        <div className="row">
          <div className="col-md-3">
            <FiltersSidebar
              categories={categories}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
              clearFilters={clearFilters}
            />
          </div>
          <div className="col-md-9">
            <ProductGrid products={filtered} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
