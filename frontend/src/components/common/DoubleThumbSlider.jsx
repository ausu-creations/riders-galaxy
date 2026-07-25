import React, { useRef, useEffect, useState } from "react";

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

export default function DoubleThumbSlider({ min = 0, max = 1000, values = { min: 0, max: 1000 }, onChange }) {
  const trackRef = useRef(null);
  const activeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (thumb) => (e) => {
    e.preventDefault();
    activeRef.current = thumb;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!activeRef.current || !isDragging) return;
    const track = trackRef.current;
    if (!track) return;
    
    const rect = track.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX) ?? 0;
    
    // Calculate position with better accuracy
    const position = clientX - rect.left;
    const width = rect.width;
    
    // Clamp position to track bounds
    const clampedPosition = Math.max(0, Math.min(position, width));
    
    // Calculate ratio (0 to 1)
    const ratio = clampedPosition / width;
    
    // Calculate value with better precision
    const value = Math.round(min + ratio * (max - min));

    if (activeRef.current === "min") {
      const newMin = Math.min(value, values.max - 1); // Ensure min is at least 1 less than max
      onChange({ min: newMin, max: values.max });
    } else if (activeRef.current === "max") {
      const newMax = Math.max(value, values.min + 1); // Ensure max is at least 1 more than min
      onChange({ min: values.min, max: newMax });
    }
  };

  const handlePointerUp = () => {
    activeRef.current = null;
    setIsDragging(false);
  };

  const handleTrackClick = (e) => {
    if (isDragging) return; // Don't interfere with dragging
    
    const track = trackRef.current;
    if (!track) return;
    
    const rect = track.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX) ?? 0;
    
    // Calculate position
    const position = clientX - rect.left;
    const width = rect.width;
    const clampedPosition = Math.max(0, Math.min(position, width));
    const ratio = clampedPosition / width;
    const value = Math.round(min + ratio * (max - min));
    
    // Determine which thumb is closer to the click
    const minDistance = Math.abs(value - values.min);
    const maxDistance = Math.abs(value - values.max);
    
    if (minDistance < maxDistance) {
      // Move min thumb
      const newMin = Math.min(value, values.max - 1);
      onChange({ min: newMin, max: values.max });
    } else {
      // Move max thumb
      const newMax = Math.max(value, values.min + 1);
      onChange({ min: values.min, max: newMax });
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
      document.addEventListener("touchmove", handlePointerMove, { passive: false });
      document.addEventListener("touchend", handlePointerUp);
    }

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("touchmove", handlePointerMove);
      document.removeEventListener("touchend", handlePointerUp);
    };
  }, [isDragging, min, max, values, onChange]);

  const pct = (v) => ((v - min) / (max - min)) * 100;

  return (
    <div>
      <div style={{ height: 40 }}>
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          style={{
            position: "relative",
            height: 8,
            background: "#e9ecef",
            borderRadius: 9999,
            cursor: "pointer"
          }}
        >
          <div
            style={{
              position: "absolute",
              left: `${pct(values.min)}%`,
              right: `${100 - pct(values.max)}%`,
              top: 0,
              bottom: 0,
              background: "#dc3545",
              borderRadius: 9999,
            }}
          />

          <div
            role="slider"
            tabIndex={0}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={values.min}
            onPointerDown={handlePointerDown("min")}
            onMouseDown={handlePointerDown("min")}
            onTouchStart={handlePointerDown("min")}
            style={{
              position: "absolute",
              top: "50%",
              transform: "translate(-50%, -50%)",
              left: `${pct(values.min)}%`,
              width: 24,
              height: 24,
              borderRadius: 9999,
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              border: "3px solid #dc3545",
              touchAction: "none",
              cursor: "grab",
              zIndex: isDragging && activeRef.current === "min" ? 10 : 1,
              transition: isDragging ? "none" : "transform 0.1s ease"
            }}
          />

          <div
            role="slider"
            tabIndex={0}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={values.max}
            onPointerDown={handlePointerDown("max")}
            onMouseDown={handlePointerDown("max")}
            onTouchStart={handlePointerDown("max")}
            style={{
              position: "absolute",
              top: "50%",
              transform: "translate(-50%, -50%)",
              left: `${pct(values.max)}%`,
              width: 24,
              height: 24,
              borderRadius: 9999,
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              border: "3px solid #dc3545",
              touchAction: "none",
              cursor: "grab",
              zIndex: isDragging && activeRef.current === "max" ? 10 : 1,
              transition: isDragging ? "none" : "transform 0.1s ease"
            }}
          />
        </div>
      </div>
      <div className="d-flex justify-content-between small text-muted mt-2">
        <div className="d-flex align-items-center gap-2">
          <span>Min:</span>
          <input
            type="number"
            value={values.min}
            onChange={(e) => {
              const val = Math.max(min, Math.min(Number(e.target.value), values.max));
              onChange({ min: val, max: values.max });
            }}
            style={{
              width: '80px',
              padding: '4px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.85rem'
            }}
            min={min}
            max={max}
          />
        </div>
        <br />
        <div className="d-flex align-items-center gap-2">
          <span>Max:</span>
          <input
            type="number"
            value={values.max}
            onChange={(e) => {
              const val = Math.max(values.min, Math.min(Number(e.target.value), max));
              onChange({ min: values.min, max: val });
            }}
            style={{
              width: '80px',
              padding: '4px 8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.85rem'
            }}
            min={min}
            max={max}
          />
        </div>
      </div>
    </div>
  );
}
