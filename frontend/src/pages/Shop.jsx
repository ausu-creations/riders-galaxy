import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
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
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
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
    if (sortBy === "name-asc") return res.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "name-desc") return res.sort((a, b) => b.title.localeCompare(a.title));
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

  const activeFiltersCount = selectedCategories.length + selectedBrands.length;

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <div className="shop-hero" style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: '60px 0',
        marginBottom: '40px'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb" style={{ marginBottom: '15px' }}>
                  <li className="breadcrumb-item"><Link to="/" style={{ color: '#a0a0a0', textDecoration: 'none' }}>Home</Link></li>
                  <li className="breadcrumb-item active" style={{ color: '#ffffff' }}>Shop</li>
                </ol>
              </nav>
              <h1 style={{ 
                color: '#ffffff', 
                fontSize: '2.5rem', 
                fontWeight: '700',
                marginBottom: '10px'
              }}>
                {search ? `Search: "${search}"` : 'Our Products'}
              </h1>
              <p style={{ color: '#a0a0a0', fontSize: '1.1rem' }}>
                {filtered.length} products found
              </p>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="shop-tools">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '10px 15px',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    background: '#1a1a2e',
                    color: '#ffffff',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginBottom: '60px' }}>
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 col-md-4">
            <div className="shop-sidebar">
              <div className="sidebar-header d-flex justify-content-between align-items-center mb-4">
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '600',
                  color: '#1a1a2e',
                  margin: 0
                }}>
                  Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <button 
                    onClick={clearFilters}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Clear All ({activeFiltersCount})
                  </button>
                )}
              </div>
              
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
          </div>

          {/* Products */}
          <div className="col-lg-9 col-md-8">
            <div className="shop-header d-flex justify-content-between align-items-center mb-4">
              <div className="products-count" style={{ color: '#666' }}>
                Showing {filtered.length} of {productsData.length} products
              </div>
              <div className="view-toggles">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`view-toggle ${viewMode === "grid" ? "active" : ""}`}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    background: viewMode === "grid" ? '#1a1a2e' : '#fff',
                    color: viewMode === "grid" ? '#fff' : '#333',
                    borderRadius: '4px 0 0 4px',
                    cursor: 'pointer',
                    marginRight: '2px'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M1 2a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H2a1 1 0 01-1-1V2zm6 0a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H8a1 1 0 01-1-1V2zm6 0a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V2zM1 8a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H2a1 1 0 01-1-1V8zm6 0a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H8a1 1 0 01-1-1V8zm6 0a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V8z"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`view-toggle ${viewMode === "list" ? "active" : ""}`}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    background: viewMode === "list" ? '#1a1a2e' : '#fff',
                    color: viewMode === "list" ? '#fff' : '#333',
                    borderRadius: '0 4px 4px 0',
                    cursor: 'pointer'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M3 4a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"/>
                  </svg>
                </button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="no-products text-center py-5">
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
                <h3 style={{ color: '#1a1a2e', marginBottom: '10px' }}>No products found</h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  style={{
                    padding: '12px 24px',
                    background: '#1a1a2e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <ProductGrid products={filtered} viewMode={viewMode} />
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}
