import React, { createContext, useContext, useState, useEffect } from "react";
import initialProducts from "../data/products";

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // Load products from localStorage or use initial data
  useEffect(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem("products", JSON.stringify(initialProducts));
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(), // Simple ID generation
      // Convert sizeStock object to array for MongoDB compatibility
      sizeStock: product.sizeStock ? Object.entries(product.sizeStock).map(([size, stock]) => ({ size, stock })) : [],
      // Ensure images is an array
      images: Array.isArray(product.images) ? product.images : []
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id, updatedProduct) => {
    // Convert sizeStock object to array for MongoDB compatibility
    const productWithSizeStock = {
      ...updatedProduct,
      sizeStock: updatedProduct.sizeStock ? Object.entries(updatedProduct.sizeStock).map(([size, stock]) => ({ size, stock })) : [],
      // Ensure images is an array
      images: Array.isArray(updatedProduct.images) ? updatedProduct.images : []
    };
    setProducts(products.map((p) => (p.id === id ? { ...p, ...productWithSizeStock } : p)));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const getProduct = (id) => {
    return products.find((p) => p.id === parseInt(id) || p.id === id);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
