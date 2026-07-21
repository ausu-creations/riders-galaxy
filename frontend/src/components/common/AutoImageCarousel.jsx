import React, { useEffect, useState } from "react";

export default function AutoImageCarousel({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="auto-image-carousel">
      <div className="carousel-image-wrapper mb-3">
        <img
          src={images[activeIndex]}
          alt={`Slide ${activeIndex + 1}`}
          className="carousel-image img-fluid"
        />
      </div>
      {images.length > 1 && (
        <div className="d-flex gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className={`btn p-0 border ${activeIndex === idx ? "border-primary" : "border-secondary"}`}
              onClick={() => setActiveIndex(idx)}
              style={{ width: 80, height: 80, overflow: "hidden", borderRadius: 8 }}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="img-fluid" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
