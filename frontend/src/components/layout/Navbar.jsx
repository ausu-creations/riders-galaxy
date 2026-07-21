import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import logo from "../../assets/images/logo.png";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setSearch(searchParams.get("q") || "");
  }, [location.pathname, searchParams]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    const query = search.trim();
    const nextParams = new URLSearchParams(searchParams);

    if (query) {
      nextParams.set("q", query);
    } else {
      nextParams.delete("q");
    }

    const targetPath = location.pathname.startsWith("/wishlist") ? "/wishlist" : "/shop";
    const searchString = nextParams.toString();
    navigate({ pathname: targetPath, search: searchString ? `?${searchString}` : "" });
  }

  const { itemCount, toggleCart } = useCart();
  const currentSearchString = searchParams.toString();
  const shopLink = currentSearchString ? `/shop?${currentSearchString}` : "/shop";
  const wishlistLink = currentSearchString ? `/wishlist?${currentSearchString}` : "/wishlist";

  return (
    <header className="p-0">
      {/* Top Row */}
      <div className="header-main-row">
        {/* Logo */}
        <div className="logo-container">
          <Link to="/" className="logo">
            <img
              src={logo}
              alt="Rider's Galaxy Logo"
              width="100"
            />
          </Link>
        </div>

        {/* Right Actions */}
        <div className="header-actions">
          <div className="nav-right-cta d-none d-lg-block">
            <a href="/shop" className="cta-button">
              NEED HELP?
            </a>
          </div>

          <Link to={wishlistLink} className="action-item" title="Wishlist">
            ❤️
          </Link>

          <a href="/shop" className="action-item" title="Profile">
            👤
          </a>

          <button type="button" className="action-item cart-icon" title="Cart" onClick={toggleCart}>
            🛒 <span className="cart-badge">{itemCount}</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="header-nav-row">
        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-toggle"
          id="mobileMenuBtn"
          aria-label="Toggle navigation"
          type="button"
        >
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>

        {/* Navigation Links */}
        <nav className="nav-container" id="mobileNavMenu">
          <ul className="nav-links">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/shop?category=riding%20jackets&q=Riding%20Jackets"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Riding Gears
              </a>

              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="/shop?category=riding%20jackets&q=Riding%20Jackets">
                    Riding/Touring Jackets
                  </a>
                </li>

                <li>
                  <a className="dropdown-item" href="/shop?category=riding%20pants&q=Riding%20Pants">
                    Riding/Touring Pants
                  </a>
                </li>

                <li>
                  <a className="dropdown-item" href="/shop?category=riding%20gloves&q=Riding%20Gloves">
                    Riding/Touring Gloves
                  </a>
                </li>

                <li>
                  <a className="dropdown-item" href="/shop?category=riding%20boots&q=Riding%20Boots">
                    Riding/Touring Boots
                  </a>
                </li>
              </ul>
            </li>

            <li>
              <a href="/shop?category=helmets&q=Helmets">Helmets</a>
            </li>

            <li>
              <a href="/shop?category=exhausts&q=Exhausts">Performance Parts</a>
            </li>

            <li>
              <a href="/shop?category=luggage-systems&q=Luggage%20Systems">Bike Accessories</a>
            </li>

            <li>
              <a href="/shop">Brands</a>
            </li>
          </ul>
        </nav>

        {/* Search */}
        <form className="expandable-search d-flex" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            aria-label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            type="submit"
            className="search-btn"
            title="Search"
          >
            🔍
          </button>
        </form>
      </div>
    </header>
  );
}