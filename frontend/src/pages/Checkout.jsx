import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: user?.email || "",
    fullName: user?.name || "",
    phone: user?.phone || "",
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
  const [processingPayment, setProcessingPayment] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

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

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
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

    const orderData = {
      items: cartItems.map(item => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
        image: item.image,
      })),
      shippingAddress: {
        name: form.fullName,
        phone: form.phone,
        street: form.address,
        city: form.city,
        state: form.state,
        zipCode: form.postal,
        country: 'India',
      },
      subtotal: total,
      shippingCost: form.delivery === "express" ? 199 : 0,
      total: total + (form.delivery === "express" ? 199 : 0),
      notes: form.company ? `Company: ${form.company}` : '',
      paymentDetails: {
        method: form.payment,
        amount: total + (form.delivery === "express" ? 199 : 0),
        currency: 'INR',
        status: 'pending',
      },
    };

    if (form.payment === "online") {
      handleRazorpayPayment(orderData);
    } else {
      handleCodOrder(orderData);
    }
  }

  const handleRazorpayPayment = async (orderData) => {
    try {
      setProcessingPayment(true);
      
      // Get Razorpay key and create order
      const [keyResponse, paymentResponse] = await Promise.all([
        api.get('/payment/key'),
        api.post('/payment/create-order', { 
          amount: total + (form.delivery === "express" ? 199 : 0),
          currency: 'INR'
        })
      ]);

      const amount = total + (form.delivery === "express" ? 199 : 0);

      const options = {
        key: keyResponse.key,
        amount: paymentResponse.amount,
        currency: paymentResponse.currency,
        name: 'Riders Galaxy',
        description: 'Order Payment',
        order_id: paymentResponse.orderId,
        handler: async function (response) {
          // Verify payment on backend
          const verifyResponse = await api.post('/payment/verify', {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          if (verifyResponse.status === 'success') {
            // Create order with payment details
            const finalOrderData = {
              ...orderData,
              paymentDetails: {
                ...orderData.paymentDetails,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                status: 'completed',
              },
            };

            // If user is not authenticated, create order without userId
            if (!user) {
              const guestOrderData = {
                ...finalOrderData,
                guestInfo: {
                  name: form.fullName,
                  email: form.email,
                  phone: form.phone,
                },
              };
              await api.post('/orders/guest', guestOrderData);
            } else {
              await api.post('/orders', finalOrderData);
            }

            setOrderPlaced(true);
            clearCart();
          }
        },
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: '#e63946',
        },
        modal: {
          ondismiss: function() {
            setProcessingPayment(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setProcessingPayment(false);
    }
  };

  const handleCodOrder = async (orderData) => {
    try {
      const finalOrderData = {
        ...orderData,
        paymentDetails: {
          ...orderData.paymentDetails,
          status: 'pending',
        },
      };

      // If user is not authenticated, create order without userId
      if (!user) {
        const guestOrderData = {
          ...finalOrderData,
          guestInfo: {
            name: form.fullName,
            email: form.email,
            phone: form.phone,
          },
        };
        await api.post('/orders/guest', guestOrderData);
      } else {
        await api.post('/orders', finalOrderData);
      }

      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <>
      <Header />

      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <p className="text-uppercase text-muted mb-1">Checkout</p>
            <h1 className="fw-black">Complete your order</h1>
            {!user && (
              <p className="text-muted">
                <small>
                  No account required! <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => {/* Trigger auth modal */}}>Create an account</span> for order tracking.
                </small>
              </p>
            )}
          </div>
          <div className="text-end">
            <p className="mb-1">India only</p>
            <p className="text-muted mb-0">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {orderPlaced ? (
          <div className="alert alert-success">
            <h4 className="alert-heading">Order placed successfully!</h4>
            <p>Your order has been confirmed. We will contact you shortly.</p>
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
                          value="online"
                          checked={form.payment === "online"}
                          onChange={handleFieldChange}
                        />
                        <span className="form-check-label ms-2">
                          Online payment (UPI, Cards, Net Banking)
                        </span>
                      </label>
                    </div>
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
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 mb-3"
                    disabled={processingPayment}
                  >
                    {processingPayment ? 'Processing...' : 'Place order'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary w-100" 
                    onClick={() => navigate(-1)}
                    disabled={processingPayment}
                  >
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
