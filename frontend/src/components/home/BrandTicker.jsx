import React from "react";
import RoyalEnfield from "../../assets/images/Royal_Enfield.png";
import Dsg from "../../assets/images/dsg.png";
import Rynox from "../../assets/images/rynox.png";
import Korda from "../../assets/images/korda.png";
import RaidaLogo from "../../assets/images/raida-logo.png";
import LS2 from "../../assets/images/LS2.png";

const brands = [
  { key: "royal-enfield", src: RoyalEnfield, alt: "Royal Enfield" },
  { key: "dsg", src: Dsg, alt: "DSG" },
  { key: "rynox", src: Rynox, alt: "Rynox" },
  { key: "korda", src: Korda, alt: "Korda" },
  { key: "raida", src: RaidaLogo, alt: "Raida" },
  { key: "ls2", src: LS2, alt: "LS2" },
];

export default function BrandTicker() {
  return (
    <section className="brand-section py-5">
      <div className="container-fluid px-0">
        <div className="container mb-4">
          <div className="d-flex justify-content-between align-items-end">
            <div>
              <span className="text-uppercase text-warning fw-bold tracking-wider fs-7 d-block mb-1 font-barlow">TRUSTED PARTNERS</span>
              <h2 className="display-6 fw-black text-black text-uppercase m-0 header-title">SHOP BY BRAND<span className="title-dot"></span></h2>
            </div>
            <div>
              <a href="/shop" className="view-all-link text-uppercase fw-bold text-decoration-none text-black fs-7 font-barlow">ALL BRANDS <span className="arrow-shift">&rarr;</span></a>
            </div>
          </div>
        </div>

        <div className="brand-ticker-container position-relative overflow-hidden w-100 py-2">
          <div className="brand-ticker-track d-flex">
            {brands.concat(brands).map((b, i) => (
              <div className="brand-card-item" data-brand={b.key} key={`${b.key}-${i}`}>
                <a href={`/shop?brand=${encodeURIComponent(b.key)}&q=${encodeURIComponent(b.alt)}`} className="brand-card-inner d-flex align-items-center justify-content-center border-0 border-opacity-25 p-3 text-decoration-none">
                  <img src={b.src} alt={b.alt} className="brand-logo-img img-fluid object-fit-contain" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
