import React from "react";
import { Link } from "react-router-dom";
import RynoxImg from "../../assets/images/rynox.jpg";
import ViaterraImg from "../../assets/images/Viaterra.png";
import LoneRangerImg from "../../assets/images/loneranger.png";
import RaidaImg from "../../assets/images/Raida.png";

export default function LongHaul() {
  return (
    <section className="long-haul-section py-5">
      <div className="container">
        <div className="row g-5 align-items-stretch">
          <div className="col-lg-6 d-flex flex-column justify-content-between">
            <div className="main-content-block">
              <span className="text-uppercase text-warning fw-bold tracking-wider fs-7 d-flex align-items-center gap-2 mb-2 font-barlow">🧭 LONG HAUL READY</span>
              <h2 className="display-4 fw-black text-black text-uppercase mb-3 main-title">Top Box, TailBag & <span className="text-danger">Saddle Bags</span></h2>
              <p className="text-secondary-white mb-4 fs-6 fw-normal lh-base">Finest saddlebags, tail bags and top boxes engineered for your long hauls. Waterproof, expandable, universal-fit — built to carry everything your journey demands.</p>

              <div className="d-flex gap-3 mb-5 mb-lg-4">
                <Link to={`/shop?category=${encodeURIComponent("luggage-systems")}&q=${encodeURIComponent("Luggage Systems")}`} className="btn btn-explore px-4 py-3 text-uppercase fw-bold text-decoration-none">Explore Products &rarr;</Link>
                <Link to={`/shop?category=${encodeURIComponent("top-box")}&q=${encodeURIComponent("Top Boxes")}`} className="btn btn-outline-boxes px-4 py-3 text-uppercase fw-bold text-decoration-none">Top Boxes</Link>
              </div>
            </div>

            <div className="row g-3 spec-matrix-row">
              <div className="col-4">
                <div className="spec-badge text-center p-3 rounded-1 border border-secondary border-opacity-25">
                  <span className="d-block text-warning fw-black fs-4 font-barlow">50L+</span>
                  <span className="d-block text-muted text-uppercase tracking-wide font-barlow mt-1 fs-8">Capacity</span>
                </div>
              </div>
              <div className="col-4">
                <div className="spec-badge text-center p-3 rounded-1 border border-secondary border-opacity-25">
                  <span className="d-block text-warning fw-black fs-4 font-barlow">IPX6</span>
                  <span className="d-block text-muted text-uppercase tracking-wide font-barlow mt-1 fs-8">Waterproof</span>
                </div>
              </div>
              <div className="col-4">
                <div className="spec-badge text-center p-3 rounded-1 border border-secondary border-opacity-25">
                  <span className="d-block text-warning fw-black fs-4 font-barlow">PAN</span>
                  <span className="d-block text-muted text-uppercase tracking-wide font-barlow mt-1 fs-8">India Ship</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="row row-cols-2 g-3 h-100 align-content-start">
              <div className="col">
                <Link to={`/shop?brand=${encodeURIComponent("rynox")}&q=${encodeURIComponent("Rynox")}`} className="text-decoration-none text-reset">
                  <div className="fitment-card position-relative overflow-hidden rounded-1 border border-secondary border-opacity-25" data-bike="rynox">
                    <div className="card-image-tint"></div>
                    <img src={RynoxImg} alt="Rynox Fit" className="img-fluid w-100 h-100 object-fit-cover" />
                    <div className="card-overlay-text p-3">
                      <span className="text-uppercase text-warning fw-bold font-barlow d-block mb-1 fs-8">From</span>
                      <h3 className="h5 fw-black text-white text-uppercase m-0 font-barlow tracking-wide">Rynox</h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col">
                <Link to={`/shop?brand=${encodeURIComponent("viaterra")}&q=${encodeURIComponent("Viaterra")}`} className="text-decoration-none text-reset">
                  <div className="fitment-card position-relative overflow-hidden rounded-1 border border-secondary border-opacity-25" data-bike="viaterra">
                    <div className="card-image-tint"></div>
                    <img src={ViaterraImg} alt="Viaterra Fit" className="img-fluid w-100 h-100 object-fit-cover" />
                    <div className="card-overlay-text p-3">
                      <span className="text-uppercase text-warning fw-bold font-barlow d-block mb-1 fs-8">From</span>
                      <h3 className="h5 fw-black text-white text-uppercase m-0 font-barlow tracking-wide">Viaterra</h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col">
                <Link to={`/shop?brand=${encodeURIComponent("lone-ranger")}&q=${encodeURIComponent("Lone Ranger")}`} className="text-decoration-none text-reset">
                  <div className="fitment-card position-relative overflow-hidden rounded-1 border border-secondary border-opacity-25" data-bike="lone-ranger">
                    <div className="card-image-tint"></div>
                    <img src={LoneRangerImg} alt="Lone Ranger Fit" className="img-fluid w-100 h-100 object-fit-cover" />
                    <div className="card-overlay-text p-3">
                      <span className="text-uppercase text-warning fw-bold font-barlow d-block mb-1 fs-8">From</span>
                      <h3 className="h5 fw-black text-white text-uppercase m-0 font-barlow tracking-wide">Lone Ranger</h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="col">
                <Link to={`/shop?brand=${encodeURIComponent("raida")}&q=${encodeURIComponent("Raida")}`} className="text-decoration-none text-reset">
                  <div className="fitment-card position-relative overflow-hidden rounded-1 border border-secondary border-opacity-25" data-bike="raida">
                    <div className="card-image-tint"></div>
                    <img src={RaidaImg} alt="Raida Fit" className="img-fluid w-100 h-100 object-fit-cover" />
                    <div className="card-overlay-text p-3">
                      <span className="text-uppercase text-warning fw-bold font-barlow d-block mb-1 fs-8">From</span>
                      <h3 className="h5 fw-black text-white text-uppercase m-0 font-barlow tracking-wide">Raida</h3>
                    </div>
                  </div>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
