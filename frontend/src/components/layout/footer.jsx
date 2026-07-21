import React from "react";
import Logo from "../../assets/images/logo.png";

export default function Footer() {
	return (
		<footer className="main-site-footer pb-3">
			<div className="newsletter-strip p-4 p-md-5 border-opacity-25 mb-5">
				<div className="row align-items-center g-4">
					<div className="col-lg-7">
						<span className="text-uppercase text-warning fw-bold tracking-wider fs-7 d-block mb-1 font-barlow">JOIN THE TRIBE</span>
						<h3 className="display-6 fw-black text-black text-uppercase m-0 font-barlow tracking-wide leading-tight">GET 10% OFF YOUR FIRST RIDE</h3>
						<p className="text-muted m-0 fs-6 fw-normal mt-1">Sign up for launches, offers and adventure stories.</p>
					</div>
					<div className="col-lg-5">
						<form className="newsletter-form d-flex w-100" id="footer-newsletter">
							<input type="email" className="form-control bg-transparent text-white rounded-0 border-secondary px-3" placeholder="Enter your email" required autoComplete="email" />
							<button type="submit" className="btn btn-subscribe text-uppercase font-barlow fw-black px-4 rounded-0 text-nowrap d-flex align-items-center gap-2">
								SUBSCRIBE
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
									<path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.26.41.192-.483.18-.453 5.464-14.534zm-1.89 1.394-5.597 5.597-2.78-1.768 8.377-3.829z" />
								</svg>
							</button>
						</form>
					</div>
				</div>
			</div>

			<div className="container">
				<div className="row g-4 mb-4 pt-2">
					<div className="col-lg-4 col-md-12">
						<div className="footer-brand-block mb-3">
							<div className="d-flex align-items-center gap-2 brand-wrapper-box">
								<img src={Logo} className="w-50" alt="" />
							</div>
							<span className="text-muted text-uppercase tracking-widest fs-8 font-barlow d-block mt-1 ps-5">FUEL YOUR RIDE</span>
						</div>
						<p className="text-muted fs-7 fw-normal lh-base pe-lg-4 mt-3">Premium motorcycle accessories, high-altitude touring gear, and precision performance components curated for enthusiasts.</p>
					</div>

					<div className="col-lg-2 col-md-4 col-6">
						<h4 className="text-white text-uppercase font-barlow fw-black tracking-wide fs-6 mb-3">Shop</h4>
						<ul className="list-unstyled footer-links-list d-flex flex-column gap-2 fs-6">
							<li><a href="/shop?category=helmets&q=Helmets" className="text-decoration-none text-muted">Helmets</a></li>
							<li><a href="/shop?category=riding%20jackets&q=Riding%20Jackets" className="text-decoration-none text-muted">Riding Gear</a></li>
							<li><a href="/shop?category=luggage-systems&q=Luggage%20Systems" className="text-decoration-none text-muted">Luggage Systems</a></li>
							<li><a href="/shop?category=crash-gaurds&q=Crash%20Gaurds" className="text-decoration-none text-muted">Bike Protection</a></li>
							<li><a href="/shop?category=exhausts&q=Exhausts" className="text-decoration-none text-muted">Performance Parts</a></li>
						</ul>
					</div>

					<div className="col-lg-3 col-md-4 col-6">
						<h4 className="text-white text-uppercase font-barlow fw-black tracking-wide fs-6 mb-3">Support</h4>
						<ul className="list-unstyled footer-links-list d-flex flex-column gap-2 fs-6">
							<li><a href="/shop" className="text-decoration-none text-muted">Track Order</a></li>
							<li><a href="/shop" className="text-decoration-none text-muted">Contact Us</a></li>
							<li><a href="/shop" className="text-decoration-none text-muted">Shipping Policy</a></li>
							<li><a href="/shop" className="text-decoration-none text-muted">Returns & Refunds</a></li>
							<li><a href="/shop" className="text-decoration-none text-muted">FAQs</a></li>
						</ul>
					</div>

					<div className="col-lg-3 col-md-4 col-12">
						<h4 className="text-white text-uppercase font-barlow fw-black tracking-wide fs-6 mb-3">Company</h4>
						<ul className="list-unstyled footer-links-list d-flex flex-column gap-2 fs-6">
							<li><a href="/shop" className="text-decoration-none text-muted">About Us</a></li>
							<li><a href="/shop" className="text-decoration-none text-muted">Store Locator</a></li>
							<li><a href="/shop" className="text-decoration-none text-muted">Blogs & Stories</a></li>
							<li><a href="/shop" className="text-decoration-none text-muted">Careers</a></li>
							<li><a href="/shop" className="text-decoration-none text-muted">Terms of Service</a></li>
						</ul>
					</div>
				</div>

				<hr className="border-secondary border-opacity-25 my-4" />

				<div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
					<span className="text-muted fs-7">© 2026 BITTU HELMET. All Rights Reserved.</span>
				</div>
			</div>
		</footer>
	);
}
