import React from "react";
import { Link } from "react-router-dom";
import CrashGuardsImg from "../../assets/images/crashgaurds.png";
import AuxLightsImg from "../../assets/images/auxlights.jpg";
import MobileHolderImg from "../../assets/images/mobileholder.jpg";
import GPSScreenImg from "../../assets/images/GPSscreen.jpg";
import LuggageImg from "../../assets/images/luggage.png";

export default function TouringGrid() {
  return (
    <section className="touring-section py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="text-uppercase text-warning fw-bold tracking-wider fs-7 d-block mb-1 font-barlow">Touring Essentials</span>
            <h2 className="display-6 fw-black text-black text-uppercase m-0 header-title">Bike Accessories<span className="title-dot"></span></h2>
          </div>
          <div>
            <Link to="/shop" className="view-all-link text-uppercase fw-bold text-decoration-none text-black fs-7 font-barlow">View All <span className="arrow-shift">&rarr;</span></Link>
          </div>
        </div>

        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-2 g-md-3">
          <div className="col">
            <Link to={`/shop?category=${encodeURIComponent("crash-gaurds")}&q=${encodeURIComponent("Crash Gaurds")}`} className="text-decoration-none text-reset">
              <div className="touring-card position-relative overflow-hidden h-100 p-3" data-category="crash-gaurds">
              <div className="card-img-wrapper">
                <span className="badge-count text-uppercase">22 Products</span>
                <img src={CrashGuardsImg} alt="Crash Gaurds" className="img-fluid w-100" />
              </div>
              <div className="card-footer-strip d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="category-title m-0">Crash Gaurds</h3>
                  <span className="action-text text-muted">Shop now</span>
                </div>
                <div className="arrow-box">&rarr;</div>
              </div>
              </div>
            </Link>
          </div>

          <div className="col">
            <Link to={`/shop?category=${encodeURIComponent("aux-lights")}&q=${encodeURIComponent("Aux Lights")}`} className="text-decoration-none text-reset">
              <div className="touring-card position-relative overflow-hidden h-100 p-3" data-category="aux-lights">
              <div className="card-img-wrapper">
                <span className="badge-count text-uppercase">22 Products</span>
                <img src={AuxLightsImg} alt="Auxiliary Lights" className="img-fluid w-100" />
              </div>
              <div className="card-footer-strip d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="category-title m-0">Aux Lights</h3>
                  <span className="action-text text-muted">Shop now</span>
                </div>
                <div className="arrow-box">&rarr;</div>
              </div>
              </div>
            </Link>
          </div>

          <div className="col">
            <Link to={`/shop?category=${encodeURIComponent("mounts")}&q=${encodeURIComponent("Mobile Mounts")}`} className="text-decoration-none text-reset">
              <div className="category-card position-relative overflow-hidden h-100 p-3" data-category="mounts">
              <div className="card-img-wrapper">
                <span className="badge-products text-uppercase">28 Products</span>
                <img src={MobileHolderImg} alt="Mobile Mounts" className="img-fluid w-100" />
              </div>
              <div className="card-footer-strip d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="category-name m-0">Mobile Mounts</h3>
                  <span className="shop-now-text text-muted">Shop now</span>
                </div>
                <div className="action-arrow-box">&rarr;</div>
              </div>
              </div>
            </Link>
          </div>

          <div className="col">
            <Link to={`/shop?category=${encodeURIComponent("navigation")}&q=${encodeURIComponent("Navigation Screen")}`} className="text-decoration-none text-reset">
              <div className="category-card position-relative overflow-hidden h-100 p-3" data-category="navigation">
              <div className="card-img-wrapper">
                <span className="badge-products text-uppercase">3 Products</span>
                <img src={GPSScreenImg} alt="Navigation Screen" className="img-fluid w-100" />
              </div>
              <div className="card-footer-strip d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="category-name m-0">Navigation Screen</h3>
                  <span className="shop-now-text text-muted">Shop now</span>
                </div>
                <div className="action-arrow-box">&rarr;</div>
              </div>
              </div>
            </Link>
          </div>

          <div className="col">
            <Link to={`/shop?category=${encodeURIComponent("luggage-systems")}&q=${encodeURIComponent("Luggage Systems")}`} className="text-decoration-none text-reset">
              <div className="touring-card position-relative overflow-hidden h-100 p-3" data-category="luggage-systems">
              <div className="card-img-wrapper">
                <span className="badge-count text-uppercase">23 Products</span>
                <img src={LuggageImg} alt="Luggage Systems" className="img-fluid w-100" />
              </div>
              <div className="card-footer-strip d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="category-title m-0">Luggage Systems</h3>
                  <span className="action-text text-muted">Shop now</span>
                </div>
                <div className="arrow-box">&rarr;</div>
              </div>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
