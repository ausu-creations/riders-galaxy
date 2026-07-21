import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import { useCart } from "../context/CartContext";

const STATE_FALLBACK = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Gujarat",
  "Karnataka",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];

const CITY_FALLBACK = {
  "Andhra Pradesh": ["Vijayawada", "Visakhapatnam", "Tirupati"],
  Assam: ["Guwahati", "Dibrugarh", "Jorhat"],
  Bihar: ["Patna", "Gaya", "Purnia"],
  Gujarat: ["Ahmedabad", "Vadodara", "Surat"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangalore"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela"],
  Punjab: ["Chandigarh", "Ludhiana", "Amritsar"],
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad"],
  "Uttar Pradesh": ["Noida", "Lucknow", "Varanasi"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur"],
};

export default function Checkout() {
  const { cartItems, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    phone: "",
    address: "",
    postal: "",
    state: "",
    city: "",
    company: "",
    delivery: "standard",
    payment: "cod",
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    async function loadStates() {
      setFetchError("");
      try {
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: "India" }),
        });
        const data = await response.json();
        if (data?.data?.states?.length) {
          setStates(data.data.states.map((state) => state.name));
          return;
        }
      } catch (error) {
        console.warn("State fetch failed", error);
      }
      setFetchError("Could not load state list. Using fallback data.");
      setStates(STATE_FALLBACK);
    }

    loadStates().finally(() => setLoadingStates(false));
  }, []);

  useEffect(() => {
    if (!form.state) {
      setCities([]);
      return;
    }

    async function loadCities() {
      setFetchError("");
      setLoadingCities(true);
      try {
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: "India", state: form.state }),
        });
        const data = await response.json();
        if (data?.data?.length) {
          setCities(data.data);
          return;
        }
      } catch (error) {
        console.warn("City fetch failed", error);
      } finally {
        setLoadingCities(false);
      }

      setFetchError("Could not load cities. Using fallback data.");
      setCities(CITY_FALLBACK[form.state] || []);
      setLoadingCities(false);
    }

    loadCities();
  }, [form.state]);

  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitOrder(event) {
    event.preventDefault();
    if (cartItems.length === 0) return;
    setOrderPlaced(true);
    clearCart();
  }

  return (
    <>
      <Header />

      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <p className="text-uppercase text-muted mb-1">Checkout</p>
            <h1 className="fw-black">Complete your order</h1>
          </div>
          <div className="text-end">
            <p className="mb-1">India only</p>
            <p className="text-muted mb-0">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {orderPlaced ? (
          <div className="alert alert-success">
            <h4 className="alert-heading">Order placed!</h4>
            <p>Your order has been confirmed. We will email your order details shortly.</p>
            <Link to="/" className="btn btn-primary">
              Continue shopping
            </Link>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="alert alert-info">
            <h5>Your cart is empty.</h5>
            <p>Add items from the shop before checking out.</p>
            <Link to="/shop" className="btn btn-primary">
              Browse products
            </Link>
          </div>
        ) : (
          <form onSubmit={submitOrder}>
            <div className="row gx-4 gy-4">
              <div className="col-lg-7">
                <section className="checkout-card p-4 mb-4">
                  <h5 className="mb-4">Contact information</h5>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label">Email address</label>
                      <input
                        className="form-control"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleFieldChange}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone number</label>
                      <input
                        className="form-control"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleFieldChange}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                  </div>

                  <h5 className="mb-4">Shipping address</h5>
                  <div className="row g-3 mb-3">
                    <div className="col-12">
                      <label className="form-label">Full name</label>
                      <input
                        className="form-control"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleFieldChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <input
                        className="form-control"
                        name="address"
                        value={form.address}
                        onChange={handleFieldChange}
                        placeholder="Street address, building and floor"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Postal code</label>
                      <input
                        className="form-control"
                        name="postal"
                        value={form.postal}
                        onChange={handleFieldChange}
                        placeholder="PIN code"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">State</label>
                      <select
                        className="form-select"
                        name="state"
                        value={form.state}
                        onChange={handleFieldChange}
                        required
                        disabled={loadingStates}
                      >
                        <option value="">Select state</option>
                        {states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">City</label>
                      <select
                        className="form-select"
                        name="city"
                        value={form.city}
                        onChange={handleFieldChange}
                        required
                        disabled={!form.state || loadingCities}
                      >
                        <option value="">Select city</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Company (optional)</label>
                    <input
                      className="form-control"
                      name="company"
                      value={form.company}
                      onChange={handleFieldChange}
                      placeholder="Company name"
                    />
                  </div>

                  <h5 className="mb-4">Delivery method</h5>
                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <label className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="delivery"
                          value="standard"
                          checked={form.delivery === "standard"}
                          onChange={handleFieldChange}
                        />
                        <span className="form-check-label ms-2">
                          Standard delivery — free, 3-5 working days
                        </span>
                      </label>
                    </div>
                    <div className="col-12">
                      <label className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="delivery"
                          value="express"
                          checked={form.delivery === "express"}
                          onChange={handleFieldChange}
                        />
                        <span className="form-check-label ms-2">
                          Express delivery — ₹199, 1-2 working days
                        </span>
                      </label>
                    </div>
                  </div>

                  <h5 className="mb-4">Payment method</h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={form.payment === "cod"}
                          onChange={handleFieldChange}
                        />
                        <span className="form-check-label ms-2">Cash on delivery</span>
                      </label>
                    </div>
                    <div className="col-12">
                      <label className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="payment"
                          value="online"
                          checked={form.payment === "online"}
                          onChange={handleFieldChange}
                        />
                        <span className="form-check-label ms-2">Online payment</span>
                      </label>
                    </div>
                  </div>
                </section>
              </div>

              <div className="col-lg-5">
                <section className="checkout-card p-4 mb-4">
                  <h5 className="mb-4">Order summary</h5>
                  <div className="mb-3 text-muted">{cartItems.length} product{cartItems.length !== 1 ? "s" : ""}</div>
                  <div className="d-flex flex-column gap-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="d-flex gap-3 align-items-center">
                        <img src={item.image} alt={item.title} width="64" height="64" className="rounded-3 object-fit-cover" />
                        <div className="flex-grow-1">
                          <div className="fw-bold">{item.title}</div>
                          <div className="text-muted">Qty {item.quantity}</div>
                        </div>
                        <div className="text-end fw-bold">₹{(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  <hr className="my-4" />

                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <strong>₹{total.toFixed(2)}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Delivery</span>
                    <strong>{form.delivery === "express" ? "₹199.00" : "Free"}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-4">
                    <span>Payment</span>
                    <strong>{form.payment === "online" ? "Online" : "Cash on delivery"}</strong>
                  </div>
                  <div className="d-flex justify-content-between fs-5 fw-bold mb-3">
                    <span>Total</span>
                    <span>
                      ₹{(total + (form.delivery === "express" ? 199 : 0)).toFixed(2)}
                    </span>
                  </div>
                  {fetchError && <div className="alert alert-warning">{fetchError}</div>}
                  <button type="submit" className="btn btn-primary w-100 mb-3">
                    Place order
                  </button>
                  <button type="button" className="btn btn-outline-secondary w-100" onClick={() => navigate(-1)}>
                    Edit cart
                  </button>
                </section>
              </div>
            </div>
          </form>
        )}
      </div>

      <Footer />
    </>
  );
}
