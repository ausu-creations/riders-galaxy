import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import TripReady from "../pages/TripReady";
import ProductPage from "../pages/ProductPage";
import Wishlist from "../pages/Wishlist";
import Checkout from "../pages/Checkout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/trip-ready" element={<TripReady />} />
      <Route path="/shop/product/:id" element={<ProductPage />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}