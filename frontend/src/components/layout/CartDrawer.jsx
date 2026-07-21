import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

export default function CartDrawer() {
  const { cartItems, total, isCartOpen, closeCart, setQuantity, removeItem, clearCart } = useCart();

  return (
    <div className={`cart-drawer ${isCartOpen ? "open" : ""}`}> 
      <div className="cart-drawer-backdrop" onClick={closeCart}></div>
      <aside className="cart-drawer-panel">
        <div className="cart-drawer-header">
          <div>
            <h4>Your Cart</h4>
            <p className="text-muted">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>
          </div>
          <button className="btn-close" onClick={closeCart} aria-label="Close cart"></button>
        </div>

        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <p>Your cart is empty.</p>
              <Link to="/shop" className="btn btn-outline-primary" onClick={closeCart}>
                Continue shopping
              </Link>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img src={item.image} alt={item.title} className="cart-item-image" />
                  <div className="cart-item-details">
                    <p className="cart-item-title">{item.title}</p>
                    <p className="text-muted">${item.price.toFixed(2)}</p>
                    <div className="cart-qty-control">
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => setQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => setQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button className="btn btn-link btn-sm cart-remove-btn" onClick={() => removeItem(item.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cart-drawer-footer">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <strong>Total</strong>
            <strong>${total.toFixed(2)}</strong>
          </div>
          <Link to="/checkout" className="btn btn-primary w-100 mb-2" onClick={closeCart}>
            Checkout
          </Link>
          <button className="btn btn-outline-secondary w-100" onClick={clearCart} disabled={cartItems.length === 0}>
            Clear cart
          </button>
        </div>
      </aside>
    </div>
  );
}
