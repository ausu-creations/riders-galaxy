import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product, viewMode = "grid" }) {
  const { addItem, openCart } = useCart();

  const handleAddToCart = () => {
    addItem(product, 1);
    openCart();
  };

  // Check if product is in stock by checking sizeStock or total stock
  const isInStock = () => {
    // If product has sizeStock, check if any size has stock > 0
    if (product.sizeStock && product.sizeStock.length > 0) {
      return product.sizeStock.some(item => item.stock > 0);
    }
    // Fall back to total stock
    return product.stock > 0;
  };

  const hasStock = isInStock();
  const badgeColor = product.tripReady ? '#28a745' : '#007bff';

  if (viewMode === "list") {
    return (
      <div className="product-card-list" style={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div className="row g-0">
          <div className="col-md-4">
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <img
                src={product.image}
                alt={product.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
              />
              {product.tripReady && (
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: badgeColor,
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  Trip Ready
                </span>
              )}
              {!hasStock && (
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#dc3545',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  Out of Stock
                </span>
              )}
            </div>
          </div>
          <div className="col-md-8">
            <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{
                  color: '#666',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {product.brand}
                </span>
              </div>
              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#1a1a2e',
                marginBottom: '8px',
                margin: 0
              }}>
                <Link 
                  to={`/shop/product/${product.id}`}
                  style={{ 
                    color: '#1a1a2e', 
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#007bff'}
                  onMouseLeave={(e) => e.target.style.color = '#1a1a2e'}
                >
                  {product.title}
                </Link>
              </h3>
              <p style={{
                color: '#666',
                fontSize: '0.9rem',
                marginBottom: '12px',
                flex: 1
              }}>
                {product.description?.substring(0, 100)}...
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div>
                  <span style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#1a1a2e'
                  }}>
                    ₹{product.price.toFixed(2)}
                  </span>
                  {hasStock && (
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '0.85rem',
                      color: '#28a745'
                    }}>
                      ({product.stock} in stock)
                    </span>
                  )}
                </div>
                <div>
                  <Link 
                    to={`/shop/product/${product.id}`}
                    className="btn btn-outline-primary btn-sm me-2"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '1px solid #007bff',
                      color: '#007bff',
                      background: 'transparent',
                      textDecoration: 'none'
                    }}
                  >
                    View Details
                  </Link>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleAddToCart}
                    disabled={!hasStock}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      background: hasStock ? '#007bff' : '#6c757d',
                      color: '#fff',
                      cursor: hasStock ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {hasStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card-grid" style={{
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      background: '#fff'
    }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={product.image}
          alt={product.title}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
        />
        {product.tripReady && (
          <span style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: badgeColor,
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            Trip Ready
          </span>
        )}
        {!hasStock && (
          <span style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#dc3545',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            Out of Stock
          </span>
        )}
        <div className="product-actions" style={{
          position: 'absolute',
          bottom: '-50px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          padding: '10px',
          background: 'rgba(255,255,255,0.95)',
          transition: 'bottom 0.3s ease'
        }}>
          <Link
            to={`/shop/product/${product.id}`}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              background: '#1a1a2e',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Quick View
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={!hasStock}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              background: hasStock ? '#007bff' : '#6c757d',
              color: '#fff',
              border: 'none',
              cursor: hasStock ? 'pointer' : 'not-allowed',
              fontSize: '0.85rem'
            }}
          >
            {hasStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{
            color: '#666',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {product.brand}
          </span>
        </div>
        <h3 style={{
          fontSize: '0.95rem',
          fontWeight: '600',
          color: '#1a1a2e',
          marginBottom: '8px',
          margin: 0,
          lineHeight: '1.3',
          height: '2.6em',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          <Link 
            to={`/shop/product/${product.id}`}
            style={{ 
              color: '#1a1a2e', 
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#007bff'}
            onMouseLeave={(e) => e.target.style.color = '#1a1a2e'}
          >
            {product.title}
          </Link>
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <span style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: '#1a1a2e'
          }}>
            ₹{product.price.toFixed(2)}
          </span>
          {hasStock && (
            <span style={{
              fontSize: '0.75rem',
              color: '#28a745',
              fontWeight: '500'
            }}>
              {product.stock} left
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
