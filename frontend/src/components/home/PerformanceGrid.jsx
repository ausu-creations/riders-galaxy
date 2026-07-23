import React from "react";
import { Link } from "react-router-dom";
import ExhaustsImg from "../../assets/images/exhausts.jpg";
import AirFilterImg from "../../assets/images/air-filter.jpg";
import SparkPlugsImg from "../../assets/images/sparkplugs.png";
import BrakesImg from "../../assets/images/brakes.jpg";
import ChainsetImg from "../../assets/images/chainset.png";

export default function PerformanceGrid() {
  return (
    <section className="performance-section py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="text-uppercase text-warning fw-bold tracking-wider fs-7 d-block mb-1 font-barlow">POWER UP</span>
            <h2 className="display-6 fw-black text-black text-uppercase m-0 header-title">Performance Parts<span className="title-dot"></span></h2>
          </div>
          <div>
            <Link to="/shop" className="view-all-link text-uppercase fw-bold text-decoration-none text-black fs-7 font-barlow">View All <span className="arrow-shift">&rarr;</span></Link>
          </div>
        </div>

        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-2 g-md-3">
          <div className="col">
            <Link to={`/shop?category=${encodeURIComponent("exhausts")}&q=${encodeURIComponent("Exhausts")}`} className="text-decoration-none text-reset">
              <div className="performance-card position-relative overflow-hidden h-100 p-3" data-category="exhausts">
              <div className="card-img-wrapper">
                <span className="badge-count text-uppercase">2 Products</span>
                <img src={ExhaustsImg} alt="Exhaust Systems" className="img-fluid w-100" />
              </div>
              <div className="card-footer-strip d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="category-title m-0">Exhausts</h3>
                  <span className="action-text text-muted">Shop now</span>
                </div>
                <div className="arrow-box">&rarr;</div>
              </div>
              </div>
            </Link>
          </div>

          <div className="col">
            <Link to={`/shop?category=${encodeURIComponent("air-filters")}&q=${encodeURIComponent("Air Filter")}`} className="text-decoration-none text-reset">
              <div className="performance-card position-relative overflow-hidden h-100 p-3" data-category="air-filters">
              <div className="card-img-wrapper">
                <span className="badge-count text-uppercase">14 Products</span>
                <img src={AirFilterImg} alt="Air Filters" className="img-fluid w-100" />
              </div>
              <div className="card-footer-strip d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="category-title m-0">Air Filter</h3>
                  <span className="action-text text-muted">Shop now</span>
                </div>
                <div className="arrow-box">&rarr;</div>
              </div>
              </div>
            </Link>
          </div>

          <div className="col">
            <Link to={`/shop?category=${encodeURIComponent("spark-plugs")}&q=${encodeURIComponent("Spark Plugs")}`} className="text-decoration-none text-reset">
              <div className="performance-card position-relative overflow-hidden h-100 p-3" data-category="spark-plugs">
              <div className="card-img-wrapper">
                <span className="badge-count text-uppercase">3 Products</span>
                <img src={SparkPlugsImg} alt="Spark Plugs" className="img-fluid w-100" />
              </div>
              <div className="card-footer-strip d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="category-title m-0">Spark Plugs</h3>
                  <span className="action-text text-muted">Shop now</span>
                </div>
                <div className="arrow-box">&rarr;</div>
              </div>
              </div>
            </Link>
          </div>

          <div className="col">
            <Link to={`/shop?category=${encodeURIComponent("brake-pads")}&q=${encodeURIComponent("Brake Pads")}`} className="text-decoration-none text-reset">
              <div className="performance-card position-relative overflow-hidden h-100 p-3" data-category="brake-pads">
              <div className="card-img-wrapper">
                <span className="badge-count text-uppercase">201 Products</span>
                <img src={BrakesImg} alt="Brake Pads" className="img-fluid w-100" />
              </div>
              <div className="card-footer-strip d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="category-title m-0">Brake Pads</h3>
                  <span className="action-text text-muted">Shop now</span>
                </div>
                <div className="arrow-box">&rarr;</div>
              </div>
              </div>
            </Link>
          </div>

          <div className="col">
            <Link to={`/shop?category=${encodeURIComponent("sprockets")}&q=${encodeURIComponent("Chain Sprockets")}`} className="text-decoration-none text-reset">
              <div className="performance-card position-relative overflow-hidden h-100 p-3" data-category="sprockets">
              <div className="card-img-wrapper">
                <span className="badge-count text-uppercase">9 Products</span>
                <img src={ChainsetImg} alt="Chain Sprockets" className="img-fluid w-100" />
              </div>
              <div className="card-footer-strip d-flex align-items-center justify-content-between">
                <div>
                  <h3 className="category-title m-0">Chain Sprockets</h3>
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
