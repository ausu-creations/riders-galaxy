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
        
        // Log specific Axor products to check image data
        const axorProducts = productsWithId.filter(p => p.brand === 'Axor');
        if (axorProducts.length > 0) {
          console.log('Axor products from API:', axorProducts.map(p => ({
            title: p.title,
            image: p.image,
            hasColorImages: !!p.colorImages,
            colorImagesKeys: p.colorImages ? Object.keys(p.colorImages) : [],
            imagesCount: p.images?.length || 0
          })));
        }
        
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
      // Convert sizeStock to array for MongoDB compatibility (already array from form)
      const productData = {
        ...product,
        sizeStock: Array.isArray(product.sizeStock) ? product.sizeStock : [],
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
      // Convert sizeStock to array for MongoDB compatibility (already array from form)
      const productData = {
        ...updatedProduct,
        sizeStock: Array.isArray(updatedProduct.sizeStock) ? updatedProduct.sizeStock : [],
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
      console.error('Error details:', error.response?.data);
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

  // Helper function to get images for a specific color
  const getImagesForColor = (product, color) => {
    if (product.colorImages && product.colorImages[color]) {
      return product.colorImages[color];
    }
    return [product.image]; // Return default image in array if no color-specific images
  };

  // Helper function to get first image for a specific color
  const getImageForColor = (product, color) => {
    const images = getImagesForColor(product, color);
    return images && images.length > 0 ? images[0] : product.image;
  };

  // Helper function to get stock for a specific color and size
  const getStockForColorSize = (product, color, size) => {
    if (product.colorSizeStock && product.colorSizeStock[color]) {
      const sizeStockArray = product.colorSizeStock[color];
      const sizeItem = sizeStockArray.find(item => item.size === size);
      return sizeItem ? sizeItem.stock : 0;
    }
    // Fall back to legacy sizeStock
    if (product.sizeStock && product.sizeStock.length > 0) {
      const sizeItem = product.sizeStock.find(item => item.size === size);
      return sizeItem ? sizeItem.stock : 0;
    }
    return product.stock || 0;
  };

  // Helper function to get total stock for a specific color
  const getStockForColor = (product, color) => {
    if (product.colorSizeStock && product.colorSizeStock[color]) {
      const sizeStockArray = product.colorSizeStock[color];
      return sizeStockArray.reduce((total, item) => total + item.stock, 0);
    }
    // Fall back to total stock
    return product.stock || 0;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        getImageForColor,
        getImagesForColor,
        getStockForColorSize,
        getStockForColor,
        loading,
        fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
