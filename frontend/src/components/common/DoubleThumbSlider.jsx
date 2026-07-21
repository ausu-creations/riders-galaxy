import React, { useRef, useEffect } from "react";

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

export default function DoubleThumbSlider({ min = 0, max = 1000, values = { min: 0, max: 1000 }, onChange }) {
  const trackRef = useRef(null);
  const activeRef = useRef(null);

  useEffect(() => {
    function onPointerMove(e) {
      if (!activeRef.current) return;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX) ?? 0;
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      const value = Math.round((min + ratio * (max - min)) * 100) / 100;

      if (activeRef.current === "min") {
        const newMin = Math.min(value, values.max);
        onChange({ min: newMin, max: values.max });
      } else if (activeRef.current === "max") {
        const newMax = Math.max(value, values.min);
        onChange({ min: values.min, max: newMax });
      }
    }

    function onPointerUp() {
      activeRef.current = null;
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    }

    if (activeRef.current) {
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    }

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };
  }, [min, max, values, onChange]);

  const pct = (v) => ((v - min) / (max - min)) * 100;

  return (
    <div>
      <div style={{ height: 36 }}>
        <div
          ref={trackRef}
          style={{
            position: "relative",
            height: 6,
            background: "#e9ecef",
            borderRadius: 9999,
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
            onPointerDown={() => (activeRef.current = "min")}
            style={{
              position: "absolute",
              top: "50%",
              transform: "translate(-50%, -50%)",
              left: `${pct(values.min)}%`,
              width: 20,
              height: 20,
              borderRadius: 9999,
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              border: "3px solid #dc3545",
              touchAction: "none",
            }}
          />

          <div
            role="slider"
            tabIndex={0}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={values.max}
            onPointerDown={() => (activeRef.current = "max")}
            style={{
              position: "absolute",
              top: "50%",
              transform: "translate(-50%, -50%)",
              left: `${pct(values.max)}%`,
              width: 20,
              height: 20,
              borderRadius: 9999,
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              border: "3px solid #dc3545",
              touchAction: "none",
            }}
          />
        </div>
      </div>
      <div className="d-flex justify-content-between small text-muted">
        <span>Min: {values.min}</span>
        <span>Max: {values.max}</span>
      </div>
    </div>
  );
}
