import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
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
  const [loading, setLoading] = useState(true);

  // Load products from backend API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      if (response.products && response.products.length > 0) {
        // Convert MongoDB _id to id for frontend compatibility
        const productsWithId = response.products.map(p => ({
          ...p,
          id: p._id || p.id
        }));
        setProducts(productsWithId);
      } else {
        // Fallback to initial products if backend is empty
        setProducts(initialProducts);
      }
    } catch (error) {
      console.error('Error fetching products from backend:', error);
      // Fallback to initial products on error
      setProducts(initialProducts);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product) => {
    try {
      // Convert sizeStock object to array for MongoDB compatibility
      const productData = {
        ...product,
        sizeStock: product.sizeStock ? Object.entries(product.sizeStock).map(([size, stock]) => ({ size, stock })) : [],
        // Ensure images is an array
        images: Array.isArray(product.images) ? product.images : []
      };

      const response = await api.post('/products', productData);
      const newProduct = {
        ...response.product,
        id: response.product._id || response.product.id
      };
      setProducts([...products, newProduct]);
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      // Convert sizeStock object to array for MongoDB compatibility
      const productData = {
        ...updatedProduct,
        sizeStock: updatedProduct.sizeStock ? Object.entries(updatedProduct.sizeStock).map(([size, stock]) => ({ size, stock })) : [],
        // Ensure images is an array
        images: Array.isArray(updatedProduct.images) ? updatedProduct.images : []
      };

      const response = await api.put(`/products/${id}`, productData);
      const updatedProductData = {
        ...response.product,
        id: response.product._id || response.product.id
      };
      setProducts(products.map((p) => (p.id === id ? updatedProductData : p)));
      return updatedProductData;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
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
        loading,
        fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
