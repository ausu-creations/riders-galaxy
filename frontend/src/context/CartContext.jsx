import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";

const CartContext = createContext(null);

function getInitialCart() {
  try {
    const saved = window.localStorage.getItem("rg-cart");
    return saved ? JSON.parse(saved) : { items: [] };
  } catch (error) {
    return { items: [] };
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action.payload;
      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: Math.max(quantity, 1),
          },
        ],
      };
    }

    case "SET_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity < 1) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      return state;
  }
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

export function CartProvider({ children }) {
  const [cartState, dispatch] = useReducer(cartReducer, { items: [] }, getInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem("rg-cart", JSON.stringify(cartState));
    } catch (error) {
      // ignore write errors
    }
  }, [cartState]);

  const itemCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(
    () => ({
      cartItems: cartState.items,
      itemCount,
      total,
      isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      toggleCart: () => setIsCartOpen((current) => !current),
      addItem: (product, quantity = 1) => dispatch({ type: "ADD_ITEM", payload: { product, quantity } }),
      removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
      setQuantity: (id, quantity) => dispatch({ type: "SET_QUANTITY", payload: { id, quantity } }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
    }),
    [cartState, itemCount, total, isCartOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
