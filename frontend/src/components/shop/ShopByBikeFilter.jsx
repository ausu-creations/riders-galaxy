import React, { useState, useEffect } from "react";
import api from "../../utils/api";

// Shop by Bike filter component with dynamic bike data from backend
export default function ShopByBikeFilter({ selectedBikes, setSelectedBikes }) {
  const [bikesData, setBikesData] = useState({});
  const [expandedBrands, setExpandedBrands] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bikes');
      if (response.bikes) {
        setBikesData(response.bikes);
      }
    } catch (error) {
      console.error('Error fetching bikes:', error);
      // Fallback to empty object if API fails
      setBikesData({});
    } finally {
      setLoading(false);
    }
  };

  const toggleBrand = (brand) => {
    setExpandedBrands(prev => ({
      ...prev,
      [brand]: !prev[brand]
    }));
  };

  const toggleBike = (brand, bikeModel) => {
    const bikeKey = `${brand}-${bikeModel}`;
    if (selectedBikes.includes(bikeKey)) {
      setSelectedBikes(selectedBikes.filter(b => b !== bikeKey));
    } else {
      setSelectedBikes([...selectedBikes, bikeKey]);
    }
  };

  const getSelectedCount = () => selectedBikes.length;

  const clearSelection = () => {
    setSelectedBikes([]);
    setExpandedBrands({});
  };

  if (loading) {
    return (
      <div className="mb-4">
        <h5 className="mb-3">Shop by Bike</h5>
        <div style={{ color: '#666', fontSize: '0.9rem' }}>Loading bikes...</div>
      </div>
    );
  }

  if (Object.keys(bikesData).length === 0) {
    return (
      <div className="mb-4">
        <h5 className="mb-3">Shop by Bike</h5>
        <div style={{ color: '#666', fontSize: '0.9rem' }}>No bikes available</div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Shop by Bike</h5>
        {getSelectedCount() > 0 && (
          <button
            onClick={clearSelection}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              fontSize: '0.75rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Clear ({getSelectedCount()})
          </button>
        )}
      </div>

      <div className="bike-filter-container">
        {Object.keys(bikesData).map((brand) => (
          <div key={brand} className="bike-brand-group mb-3">
            <label className="form-check d-flex align-items-center mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                checked={expandedBrands[brand] || false}
                onChange={() => toggleBrand(brand)}
                style={{ cursor: 'pointer' }}
              />
              <span className="form-check-label ms-2" style={{ cursor: 'pointer', fontSize: '0.95rem' }}>
                {brand}
              </span>
            </label>

            {expandedBrands[brand] && (
              <div
                className="bike-models-list ms-4"
                style={{
                  paddingLeft: '16px',
                  borderLeft: '2px solid #e0e0e0',
                  marginTop: '8px'
                }}
              >
                {bikesData[brand].map((bikeModel) => {
                  const bikeKey = `${brand}-${bikeModel}`;
                  return (
                    <div key={bikeKey} className="bike-model-item mb-1">
                      <label className="form-check" style={{ cursor: 'pointer' }}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectedBikes.includes(bikeKey)}
                          onChange={() => toggleBike(brand, bikeModel)}
                          style={{ fontSize: '0.85rem' }}
                        />
                        <span className="form-check-label ms-2" style={{ fontSize: '0.85rem' }}>
                          {bikeModel}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}