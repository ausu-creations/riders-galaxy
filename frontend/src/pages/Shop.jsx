import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import FiltersSidebar from "../components/shop/FiltersSidebar";
import ProductGrid from "../components/shop/ProductGrid";
import { useProducts } from "../context/ProductContext";

const DEFAULT_CATEGORIES = [
  "Air Filter",
  "AUX Lights",
  "Brake Pads",
  "Chain Sprockets",
  "Crash Gaurds",
  "Exhausts",
  "Helmets",
  "Intercom",
  "Luggage Systems",
  "Mobile/Camera Mounts",
  "Navigation Screens",
  "Riding Boots",
  "Riding Gloves",
  "Riding Jackets",
  "Riding Pants",
  "Spark Plugs",
  "Others",
];

const DEFAULT_BRANDS = ["Axor", "DSG", "Korda", "LS2", "Lone Ranger", "Raida", "Royal Enfield", "Rynox", "Others"];

export default function Shop() {
  const { products: productsData } = useProducts();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState("newest");
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") || "";

  const categories = useMemo(() => {
    return DEFAULT_CATEGORIES;
  }, []);

  const brands = useMemo(() => {
    return DEFAULT_BRANDS;
  }, []);

  useEffect(() => {
    // initialize priceRange from data
    if (productsData.length > 0) {
      const prices = productsData.map((p) => p.price || 0);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setPriceRange({ min, max });
    }
  }, [productsData]);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const brandParam = searchParams.get("brand");

    if (categoryParam) {
      // try to match category param to available categories
      const matched = categories.find((c) => c.toLowerCase().includes(categoryParam.toLowerCase()));
      if (matched) setSelectedCategories([matched]);
    }

    if (brandParam) {
      // Handle brand parameter - try exact match first, then fuzzy match
      const matched = brands.find((b) => b.toLowerCase() === brandParam.toLowerCase() || 
                                       b.toLowerCase().includes(brandParam.toLowerCase()) ||
                                       brandParam.toLowerCase().includes(b.toLowerCase()));
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

      // category filter: exact category matching
      if (selectedCategories.length) {
        const ok = selectedCategories.some((sel) => {
          const selNorm = normalize(sel);
          const productCategory = normalize(p.category);
          
          // Handle "Others" case - include products not in DEFAULT_CATEGORIES
          if (selNorm === "others") {
            return !DEFAULT_CATEGORIES.some(defaultCat => normalize(defaultCat) === productCategory);
          }
          
          // Exact match or very close match (handle plural/singular)
          return productCategory === selNorm || 
                 productCategory === selNorm + "s" ||
                 selNorm === productCategory + "s";
        });
        if (!ok) return false;
      }

      // brand filter
      if (selectedBrands.length) {
        const ok = selectedBrands.some((sel) => {
          // Handle "Others" case - include products not in DEFAULT_BRANDS
          if (sel === "Others") {
            return !DEFAULT_BRANDS.includes(p.brand);
          }
          return sel === p.brand;
        });
        if (!ok) return false;
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
    return res.sort((a, b) => (b.createdAt || b.id) - (a.createdAt || a.id));
  }, [selectedCategories, selectedBrands, priceRange, sortBy, search, productsData]);

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
