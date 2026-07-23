import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../auth/AuthModal";
import logo from "../../assets/images/logo.png";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const { itemCount, toggleCart } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
            <Link to="/shop" className="cta-button">
              NEED HELP?
            </Link>
          </div>

          <Link to={wishlistLink} className="action-item" title="Wishlist">
            ❤️
          </Link>

          {user ? (
            <>
              <Link to="/shop" className="action-item" title="Profile">
                👤
              </Link>

              {isAdmin && (
                <Link to="/dashboard" className="action-item" title="Dashboard">
                  ⚙️
                </Link>
              )}

              <button 
                className="action-item" 
                title="Logout" 
                onClick={handleLogout}
              >
                🚪
              </button>
            </>
          ) : (
            <button 
              className="action-item" 
              title="Login" 
              onClick={() => setShowAuthModal(true)}
            >
              🔐
            </button>
          )}

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
                href="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Riding Gears
              </a>

              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/shop?category=riding%20jackets&q=Riding%20Jackets">
                    Riding/Touring Jackets
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="/shop?category=riding%20pants&q=Riding%20Pants">
                    Riding/Touring Pants
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="/shop?category=riding%20gloves&q=Riding%20Gloves">
                    Riding/Touring Gloves
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="/shop?category=riding%20boots&q=Riding%20Boots">
                    Riding/Touring Boots
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/shop?category=helmets&q=Helmets">Helmets</Link>
            </li>

            <li>
              <Link to="/shop?category=exhausts&q=Exhausts">Performance Parts</Link>
            </li>

            <li>
              <Link to="/shop?category=luggage-systems&q=Luggage%20Systems">Bike Accessories</Link>
            </li>

            <li>
              <Link to="/shop">Brands</Link>
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

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  );
}
