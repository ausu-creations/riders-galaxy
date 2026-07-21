import React from "react";
import DoubleThumbSlider from "../common/DoubleThumbSlider";

const DEFAULT_CATEGORIES = [
  "Helmets",
  "Riding Jackets",
  "Riding Gloves",
  "Riding Pants",
  "Riding Boots",
  "Intercom",
  "Crash Gaurds",
  "AUX Lights",
  "Mobile/Camera Mounts",
  "Navigation Screens",
  "Luggage Systems",
  "Exhausts",
  "Air Filter",
  "Spark Plugs",
  "Brake Pads",
  "Chain Sprockets",
  "Others",
];

const DEFAULT_BRANDS = ["Axor", "Raida", "DSG", "Royal Enfield", "Korda", "LS2", "Rynox", "Lone Ranger", "Others"];

export default function FiltersSidebar({
  categories = DEFAULT_CATEGORIES,
  selectedCategories = [],
  setSelectedCategories,
  selectedBrands = [],
  setSelectedBrands,
  priceRange = { min: 0, max: 0 },
  setPriceRange,
  sortBy,
  setSortBy,
  clearFilters,
}) {
  function toggleCategory(cat) {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  }

  function toggleBrand(b) {
    if (selectedBrands.includes(b)) {
      setSelectedBrands(selectedBrands.filter((x) => x !== b));
    } else {
      setSelectedBrands([...selectedBrands, b]);
    }
  }

  function updateMin(e) {
    const val = Number(e.target.value || 0);
    setPriceRange({ ...priceRange, min: Math.min(val, priceRange.max) });
  }

  function updateMax(e) {
    const val = Number(e.target.value || 0);
    setPriceRange({ ...priceRange, max: Math.max(val, priceRange.min) });
  }

  return (
    <aside className="filters-sidebar">
      <div className="mb-4 filters-sidebar-group">
        <h5 className="mb-3">Products</h5>
        <ul className="list-unstyled">
          {categories.map((cat) => (
            <li key={cat} className="mb-2">
              <label className="form-check">
                <input className="form-check-input" type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} />
                <span className="form-check-label ms-2">{cat}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">Brands</h5>
        <ul className="list-unstyled">
          {(DEFAULT_BRANDS || []).map((b) => (
            <li key={b} className="mb-2">
              <label className="form-check">
                <input className="form-check-input" type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} />
                <span className="form-check-label ms-2">{b}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">Price Range</h5>
        <DoubleThumbSlider min={0} max={5000} values={priceRange} onChange={(vals) => setPriceRange(vals)} />
      </div>

      <div className="mb-4">
        <h5 className="mb-3">Sort By</h5>
        <select className="form-select form-select-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div>
        <button className="btn btn-link p-0" onClick={clearFilters}>
          Clear filters
        </button>
      </div>
    </aside>
  );
}
