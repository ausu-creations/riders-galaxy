import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import FiltersSidebar from "../components/shop/FiltersSidebar";
import ProductGrid from "../components/shop/ProductGrid";
import productsData from "../data/products";

export default function Shop() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState("newest");
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") || "";

  const categories = useMemo(() => {
    return Array.from(new Set(productsData.map((p) => p.category)));
  }, []);

  const brands = useMemo(() => {
    return Array.from(new Set(productsData.map((p) => p.brand).filter(Boolean)));
  }, []);

  useEffect(() => {
    // initialize priceRange from data
    const prices = productsData.map((p) => p.price || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    setPriceRange({ min, max });
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const brandParam = searchParams.get("brand");

    if (categoryParam) {
      // try to match category param to available categories
      const matched = categories.find((c) => c.toLowerCase().includes(categoryParam.toLowerCase()));
      if (matched) setSelectedCategories([matched]);
    }

    if (brandParam) {
      const matched = brands.find((b) => b.toLowerCase().includes(brandParam.toLowerCase()));
      if (matched) setSelectedBrands([matched]);
    }
    // only run on mount / when params or categories change
  }, [searchParams, categories, brands]);

  const filtered = useMemo(() => {
    function normalize(str = "") {
      return str.toLowerCase().replace(/[\W_]+/g, " ");
    }

    const res = productsData.filter((p) => {
      const combined = normalize([p.title, p.category, p.brand].join(" "));

      // category filter: if any selected category doesn't match combined string -> exclude
      if (selectedCategories.length) {
        const ok = selectedCategories.some((sel) => {
          const selNorm = normalize(sel);
          if (selNorm === "others") return false;
          return combined.includes(selNorm.split(" ")[0]);
        });
        if (!ok) return false;
      }

      // brand filter
      if (selectedBrands.length) {
        if (!selectedBrands.includes(p.brand)) return false;
      }

      // price filter
      if (p.price < (priceRange.min || 0) || p.price > (priceRange.max || Infinity)) return false;

      // search text
      if (search) {
        if (!combined.includes(normalize(search))) return false;
      }

      return true;
    });

    if (sortBy === "price-asc") return res.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") return res.sort((a, b) => b.price - a.price);
    return res.sort((a, b) => b.id - a.id);
  }, [selectedCategories, selectedBrands, priceRange, sortBy, search]);

  function clearFilters() {
    setSelectedCategories([]);
    setSelectedBrands([]);
    // reset priceRange to data bounds
    const prices = productsData.map((p) => p.price || 0);
    setPriceRange({ min: Math.min(...prices), max: Math.max(...prices) });
    setSortBy("newest");
    setSearchParams({});
  }

  return (
    <>
      <Header />
      <div className="container my-4">
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
