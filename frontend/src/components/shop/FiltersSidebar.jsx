import React from "react";
import DoubleThumbSlider from "../common/DoubleThumbSlider";

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

export default function FiltersSidebar({
  categories = DEFAULT_CATEGORIES,
  brands = DEFAULT_BRANDS,
  selectedCategories = [],
  setSelectedCategories,
  selectedBrands = [],
  setSelectedBrands,
  priceRange = { min: 0, max: 0 },
  setPriceRange,
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
          {categories.filter(cat => cat !== "Others").map((cat) => (
            <li key={cat} className="mb-2">
              <label className="form-check">
                <input className="form-check-input" type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} />
                <span className="form-check-label ms-2">{cat}</span>
              </label>
            </li>
          ))}
          {categories.includes("Others") && (
            <li key="Others" className="mb-2">
              <label className="form-check">
                <input className="form-check-input" type="checkbox" checked={selectedCategories.includes("Others")} onChange={() => toggleCategory("Others")} />
                <span className="form-check-label ms-2">Others</span>
              </label>
            </li>
          )}
        </ul>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">Brands</h5>
        <ul className="list-unstyled">
          {(brands || []).filter(brand => brand !== "Others").map((b) => (
            <li key={b} className="mb-2">
              <label className="form-check">
                <input className="form-check-input" type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} />
                <span className="form-check-label ms-2">{b}</span>
              </label>
            </li>
          ))}
          {(brands || []).includes("Others") && (
            <li key="Others" className="mb-2">
              <label className="form-check">
                <input className="form-check-input" type="checkbox" checked={selectedBrands.includes("Others")} onChange={() => toggleBrand("Others")} />
                <span className="form-check-label ms-2">Others</span>
              </label>
            </li>
          )}
        </ul>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">Price Range (INR)</h5>
        <DoubleThumbSlider min={50} max={89999} values={priceRange} onChange={(vals) => setPriceRange(vals)} />
      </div>
    </aside>
  );
}
