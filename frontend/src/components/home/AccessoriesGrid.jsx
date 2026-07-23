import React from "react";
import { Link } from "react-router-dom";
import HelmetsImg from "../../assets/images/Helemts.png";
import JacketsImg from "../../assets/images/Jackets.png";
import GlovesImg from "../../assets/images/Gloves.png";
import PantsImg from "../../assets/images/Pants.png";
import BootsImg from "../../assets/images/Boots.png";
import IntercomsImg from "../../assets/images/Intercoms.jpg";

export default function AccessoriesGrid() {
  return (
    <section className="accessories-section py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="text-uppercase text-warning fw-bold tracking-wider fs-7 d-block mb-1">GEAR UP</span>
            <h2 className="display-6 fw-black text-black text-uppercase m-0 header-title">
              Rider Accessories<span className="title-dot"></span>
            </h2>
          </div>
          <div>
            <Link to="/shop" className="view-all-link text-uppercase fw-bold text-decoration-none text-black fs-7">
              View All <span className="arrow-shift">&rarr;</span>
            </Link>
          </div>
        </div>

        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-2 g-md-3">
          <div className="col">
            <Link to={`/shop?category=${encodeURIComponent("helmets")}&q=${encodeURIComponent("Helmets")}`} className="text-decoration-none text-reset">
              <div className="category-card position-relative overflow-hidden h-100 p-3" data-category="helmets">
              <div className="card-img-wrapper rounded-5">
                <span className="badge-products text-uppercase">15 Products</span>
                <img src={HelmetsImg} alt="Full Face Helmet" className="img-fluid w-100" />
              </div>
              <div className="card-footer-strip d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="category-name m-0">Helmets</h3>
                  <span className="shop-now-text text-muted">Shop now</span>
                </div>
                <div className="action-arrow-box">&rarr;</div>
              </div>
              </div>
            </Link>
          </div>

          <div className="col">
            <Link to={`/shop?category=${encodeURIComponent("jackets")}&q=${encodeURIComponent("Riding Jacket")}`} className="text-decoration-none text-reset">
              <div className="category-card position-relative overflow-hidden h-100 p-3" data-category="jackets">
              <div className="card-img-wrapper">
                <span className="badge-products text-uppercase">11 Products</span>
                <img src={JacketsImg} alt="Riding Jacket" className="img-fluid w-100" />
              </div>
              <div className="card-footer-strip d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="category-name m-0">Riding Jacket</h3>
                  <span className="shop-now-text text-muted">Shop now</span>
                </div>
                <div className="action-arrow-box">&rarr;</div>
              </div>
              </div>
            </Link>
          </div>

          <div className="col">
            <Link to={`/shop?category=${encodeURIComponent("gloves")}&q=${encodeURIComponent("Riding Gloves")}`} className="text-decoration-none text-reset">
              <div className="category-card position-relative overflow-hidden h-100 p-3" data-category="gloves">
              <div className="card-img-wrapper">
                <span className="badge-products text-uppercase">9 Products</span>
                <img src={GlovesImg} alt="Riding Gloves" className="img-fluid w-100" />
              </div>
              <div className="card-footer-strip d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="category-name m-0">Riding Gloves</h3>
                  <span className="shop-now-text text-muted">Shop now</span>
                </div>
                <div className="action-arrow-box">&rarr;</div>
              </div>
              </div>
            </Link>
          </div>

          <div className="col">
            <Link to={`/shop?category=${encodeURIComponent("pants")}&q=${encodeURIComponent("Riding Pants")}`} className="text-decoration-none text-reset">
              <div className="category-card position-relative overflow-hidden h-100 p-3" data-category="pants">
              <div className="card-img-wrapper">
                <span className="badge-products text-uppercase">15 Products</span>
                <img src={PantsImg} alt="Riding Pants" className="img-fluid w-100" />
              </div>
              <div className="card-footer-strip d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="category-name m-0">Riding Pants</h3>
                  <span className="shop-now-text text-muted">Shop now</span>
                </div>
                <div className="action-arrow-box">&rarr;</div>
              </div>
              </div>
            </Link>
          </div>

          <div className="col">
            <Link to={`/shop?category=${encodeURIComponent("boots")}&q=${encodeURIComponent("Riding Boots")}`} className="text-decoration-none text-reset">
              <div className="category-card position-relative overflow-hidden h-100 p-3" data-category="boots">
              <div className="card-img-wrapper">
                <span className="badge-products text-uppercase">15 Products</span>
                <img src={BootsImg} alt="Riding Boots" className="img-fluid w-100" />
              </div>
              <div className="card-footer-strip d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="category-name m-0">Riding Boots</h3>
                  <span className="shop-now-text text-muted">Shop now</span>
                </div>
                <div className="action-arrow-box">&rarr;</div>
              </div>
              </div>
            </Link>
          </div>

          <div className="col">
            <Link to={`/shop?category=${encodeURIComponent("intercoms")}&q=${encodeURIComponent("Intercoms")}`} className="text-decoration-none text-reset">
              <div className="category-card position-relative overflow-hidden h-100 p-3" data-category="intercoms">
              <div className="card-img-wrapper">
                <span className="badge-products text-uppercase">10 Products</span>
                <img src={IntercomsImg} alt="Intercoms" className="img-fluid w-100" />
              </div>
              <div className="card-footer-strip d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="category-name m-0">Intercoms</h3>
                  <span className="shop-now-text text-muted">Shop now</span>
                </div>
                <div className="action-arrow-box">&rarr;</div>
              </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
