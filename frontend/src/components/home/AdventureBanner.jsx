import React from "react";
import ladakh from "../../assets/images/ladakh-ride.png";

export default function AdventureBanner() {
  return (
    <section className="adventure-section py-5">
      <div className="container">
        <div className="adventure-banner mb-4 border border-secondary border-opacity-25">
          <div
            className="adventure-bg-img"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(5, 9, 21, 0.689) 40%, rgba(11, 24, 63, 0.257) 100%), url(" +
                ladakh +
                ")",
            }}
          />

          <div className="adventure-content p-4 p-md-5 text-white col-xl-7 col-lg-9">
            <span className="text-uppercase text-warning fw-bold tracking-wider fs-7 mb-2 d-inline-block font-barlow">
              🏔️ Ladakh &amp; Spiti Special
            </span>
            <h2 className="display-4 fw-black text-uppercase main-banner-title mb-3">
              Conquer The <span className="text-danger">Himalayas</span>
            </h2>
            <p className="lead text-secondary-white mb-4 fs-6 fw-normal lh-base">
              Complete gear checklists, altitude-tested essentials, and expert advice for your next high-altitude adventure.
            </p>
            <a href="#" className="btn btn-trip-ready px-4 py-3 text-uppercase fw-bold text-decoration-none">
              Trip Ready Gear <span className="arrow-icon ms-1">→</span>
            </a>
          </div>
        </div>

        <div className="consultation-strip p-4 rounded-1 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4 border border-secondary border-opacity-25">
          <div className="strip-text-content">
            <span className="text-uppercase text-warning fw-bold tracking-wider fs-7 d-block mb-1 font-barlow">
              Personal Consultation
            </span>
            <h3 className="h4 fw-black text-black text-uppercase m-0 strip-main-title">
              Need help or suggestions for your new Gears?
            </h3>
            <p className="text-muted m-0 fs-6 fw-normal mt-1">Get expert advice from our resident rider Abhishek.</p>
          </div>

          <div className="strip-action-content">
            <a
              href="tel:+918272815720"
              className="btn btn-call-ankur px-4 py-3 text-uppercase fw-black text-nowrap d-flex align-items-center gap-2"
              id="consultation-cta"
            >
              📞 Call Abhishek
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
