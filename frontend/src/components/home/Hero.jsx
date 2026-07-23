import React from "react";
import { Link } from "react-router-dom";
import banner1 from "../../assets/images/banner-1.jpg";
import banner2 from "../../assets/images/banner-2.png";
import banner3 from "../../assets/images/banner-3.png";
import TickerRibbon from "./TickerRibbon";
import ValueProposition from "./ValueProposition";

export default function Hero() {
  const slides = [
    {
      headingBadge: "— Riding Essentials",
      title: "Stay Prepaired, Ride Safe",
      text: "Get the right Gears like Helemts, Gloves, Jackets, Boots, and more for your next adventure.",
      ctaPrimary: "Shop Helmets →",
      ctaSecondary: "Explore All Gears",
      img: banner1,
    },
    {
      headingBadge: "— Bike Luggage & Saddlebags",
      title: "Conquer The Himalayas",
      text: "Premium saddle bags and luggage system combinations.",
      ctaPrimary: "",
      ctaSecondary: "Explore All Luggage Options →",
      img: banner2,
    },
    {
      headingBadge: "— Long Ride Essentials",
      title: "AUX Lights & Navigation",
      text: "Premium auxiliary lights and navigation systems for long-haul rides, trips.",
      ctaPrimary: "View AUX Lights →",
      ctaSecondary: "View Navigation Systems →",
      img: banner3,
    },
  ];

  return (
    <section className="hero-carousel-wrapper position-relative">
      <div
        id="heroRidersCarousel"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="5000"
      >
        <div className="carousel-inner">
          {slides.map((s, idx) => (
            <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
              <div
                className="hero-slide-bg"
                style={{
                  backgroundImage: `linear-gradient(rgba(5, 9, 21, 0.65), rgba(5, 9, 21, 0.85)), url(${s.img})`,
                }}
              />

              <div className="container h-100 position-relative z-1">
                <div className="row h-100 align-items-center">
                  <div className="col-lg-8 text-start text-white">
                    <span className="sub-heading-badge text-uppercase text-danger fw-bold tracking-wider d-inline-block mb-3">
                      {s.headingBadge}
                    </span>
                    <h1 className="display-1 fw-black text-uppercase main-hero-title mb-3">{s.title}</h1>
                    <p className="lead text-secondary-white mb-4 fs-6 fs-sm-5 fw-normal">{s.text}</p>

                    <div className="d-flex flex-column flex-sm-row gap-2 gap-sm-3">
                      {s.ctaPrimary && (
                        <Link to="/shop" className="btn btn-action-red px-3 px-md-4 py-2 py-md-3 text-uppercase fw-bold fs-7 fs-md-6 text-center">
                          {s.ctaPrimary}
                        </Link>
                      )}

                      {s.ctaSecondary && (
                        <Link to="/shop" className="btn btn-action-outline px-3 px-md-4 py-2 py-md-3 text-uppercase fw-bold fs-7 fs-md-6 text-center">
                          {s.ctaSecondary}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hero-bottom-controls">
          <button className="hero-control-btn" type="button" data-bs-target="#heroRidersCarousel" data-bs-slide="prev">
            ‹
          </button>

          <div className="hero-indicators" id="heroIndicators">
            <div className="hero-bar-segment">
              <div className="hero-bar-fill" />
            </div>
            <div className="hero-bar-segment">
              <div className="hero-bar-fill" />
            </div>
            <div className="hero-bar-segment">
              <div className="hero-bar-fill" />
            </div>
          </div>

          <button className="hero-control-btn" type="button" data-bs-target="#heroRidersCarousel" data-bs-slide="next">
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

// Render carousel + ticker + value tiles together
export function HeroWithExtras() {
  return (
    <>
      <Hero />
      <TickerRibbon />
      <ValueProposition />
    </>
  );
}
