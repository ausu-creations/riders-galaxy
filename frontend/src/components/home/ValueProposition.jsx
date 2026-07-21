import React from "react";

export default function ValueProposition() {
  return (
    <div className="container pt-4">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-5">
        <div className="col">
          <div className="prop-tile d-flex align-items-center gap-3 p-3 rounded-1 border border-secondary border-opacity-25 h-100">
            <div className="prop-icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffc906" className="bi bi-truck" viewBox="0 0 16 16">
                <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.737 11H10.5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732-1h.768a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-.768A2 2 0 0 1 12 10M12 6.5a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 .39.195l1.482 1.85a.5.5 0 0 1-.39.805H12.5a.5.5 0 0 1-.5-.5z"/>
              </svg>
            </div>
            <div className="prop-text">
              <h4 className="h6 fw-black text-black text-uppercase m-0 font-barlow tracking-wide">Free Shipping</h4>
              <span className="text-muted fs-8 d-block mt-0.5">Orders above ₹2,999</span>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="prop-tile d-flex align-items-center gap-3 p-3 rounded-1 border border-secondary border-opacity-25 h-100">
            <div className="prop-icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffc906" className="bi bi-shield-check" viewBox="0 0 16 16">
                <path d="M5.338 1.59a6.1 6.1 0 0 0-2.837.856.48.48 0 0 0-.24.41v4.23c0 3.22 2.05 6.16 5.2 7.1a.48.48 0 0 0 .285 0c3.15-.94 5.2-3.88 5.2-7.1V2.856a.48.48 0 0 0-.24-.41 6.1 6.1 0 0 0-2.83-.856L8 1.078zM7.318 8.94a.5.5 0 0 1-.772-.082L4.835 6.54a.5.5 0 0 1 .788-.616l1.317 1.685 3.197-4.39a.5.5 0 0 1 .808.592z"/>
              </svg>
            </div>
            <div className="prop-text">
              <h4 className="h6 fw-black text-black text-uppercase m-0 font-barlow tracking-wide">100% Genuine</h4>
              <span className="text-muted fs-8 d-block mt-0.5">Authorized dealer</span>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="prop-tile d-flex align-items-center gap-3 p-3 rounded-1 border border-secondary border-opacity-25 h-100">
            <div className="prop-icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffc906" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.445 2.518a.25.25 0 0 0 0 .384l2.143 2.176A.25.25 0 0 0 8 4.466"/>
              </svg>
            </div>
            <div className="prop-text">
              <h4 className="h6 fw-black text-black text-uppercase m-0 font-barlow tracking-wide">Easy Returns</h4>
              <span className="text-muted fs-8 d-block mt-0.5">7-day return policy</span>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="prop-tile d-flex align-items-center gap-3 p-3 rounded-1 border border-secondary border-opacity-25 h-100">
            <div className="prop-icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffc906" className="bi bi-credit-card-2-front" viewBox="0 0 16 16">
                <path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
                <path d="M2 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5M12 8.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0"/>
              </svg>
            </div>
            <div className="prop-text">
              <h4 className="h6 fw-black text-black text-uppercase m-0 font-barlow tracking-wide">Secure Payments</h4>
              <span className="text-muted fs-8 d-block mt-0.5">UPI / Cards / EMI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
