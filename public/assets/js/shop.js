const API_BASE = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Read initial parameters from URL (e.g. shop.html?category=helmets)
  const urlParams = new URLSearchParams(window.location.search);
  
  // 2. Pre-fill filter inputs if URL params exist
  if (urlParams.has('category')) {
    // Select category checkbox or value
  }
  
  // 3. Initial load of products
  loadShopProducts(urlParams.toString());

  // 4. Attach Event Listeners
  document.getElementById('apply-filters-btn').addEventListener('click', applyFilters);
  document.getElementById('reset-filters-btn').addEventListener('click', resetFilters);
  document.getElementById('sort-by').addEventListener('change', applyFilters);
});

// Build query parameters from Sidebar inputs
function getSelectedFilters() {
  const params = new URLSearchParams();

  const minPrice = document.getElementById('min-price').value;
  const maxPrice = document.getElementById('max-price').value;
  const make = document.getElementById('filter-make').value;
  const model = document.getElementById('filter-model').value;
  const sortBy = document.getElementById('sort-by').value;

  if (minPrice) params.append('minPrice', minPrice);
  if (maxPrice) params.append('maxPrice', maxPrice);
  if (make) params.append('make', make);
  if (model) params.append('model', model);
  if (sortBy) params.append('sort', sortBy);

  // Add checked categories
  const checkedCats = Array.from(document.querySelectorAll('.cat-checkbox:checked'))
                           .map(cb => cb.value);
  if (checkedCats.length > 0) {
    params.append('category', checkedCats.join(','));
  }

  return params.toString();
}

// Fetch products based on current filter state
async function loadShopProducts(queryString = '') {
  const grid = document.getElementById('shop-products-grid');
  grid.innerHTML = `<div class="col-12 text-center py-5"><div class="spinner-border text-danger" role="status"></div></div>`;

  try {
    const res = await fetch(`${API_BASE}/products?${queryString}`);
    const products = await res.json();

    document.getElementById('results-count').innerText = `Showing ${products.length} items`;
    renderShopGrid(products);
  } catch (err) {
    console.error('Failed to load products:', err);
    grid.innerHTML = `<div class="col-12 text-center text-danger py-5">Failed to load catalog. Please check your backend connection.</div>`;
  }
}

function renderShopGrid(products) {
  const grid = document.getElementById('shop-products-grid');
  if (products.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center py-5"><h5>No products match your criteria.</h5></div>`;
    return;
  }

  grid.innerHTML = products.map(product => `
    <div class="col-6 col-md-4">
      <div class="card h-100 shadow-sm border-0 product-card">
        <img src="${product.images[0] || 'img/placeholder.jpg'}" class="card-img-top" alt="${product.title}">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <span class="badge bg-secondary mb-1">${product.brand}</span>
            <h6 class="card-title fw-bold">${product.title}</h6>
          </div>
          <div class="mt-3">
            <div class="fw-bold text-danger fs-5">$${product.price}</div>
            <button class="btn btn-dark btn-sm w-100 mt-2">View Details</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function applyFilters() {
  const queryString = getSelectedFilters();
  // Update browser URL bar without page refresh
  window.history.pushState({}, '', `${window.location.pathname}?${queryString}`);
  loadShopProducts(queryString);
}

function resetFilters() {
  document.getElementById('min-price').value = '';
  document.getElementById('max-price').value = '';
  document.getElementById('filter-make').value = '';
  document.getElementById('filter-model').value = '';
  window.history.pushState({}, '', window.location.pathname);
  loadShopProducts();
}