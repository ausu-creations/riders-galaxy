import React from "react";

export default function DoubleRange({ min = 0, max = 1000, values = { min: 0, max: 1000 }, onChange }) {
  const handleMin = (e) => {
    const v = Number(e.target.value);
    const newMin = Math.min(v, values.max);
    onChange({ min: newMin, max: values.max });
  };

  const handleMax = (e) => {
    const v = Number(e.target.value);
    const newMax = Math.max(v, values.min);
    onChange({ min: values.min, max: newMax });
  };

  return (
    <div className="double-range">
      <div className="d-flex gap-2 align-items-center mb-2">
        <small className="text-muted">{min}</small>
        <div className="flex-grow-1">
          <input type="range" min={min} max={max} value={values.min} onChange={handleMin} className="w-100" />
          <input type="range" min={min} max={max} value={values.max} onChange={handleMax} className="w-100 position-relative" />
        </div>
        <small className="text-muted">{max}</small>
      </div>
      <div className="d-flex justify-content-between small text-muted">
        <span>Min: {values.min}</span>
        <span>Max: {values.max}</span>
      </div>
    </div>
  );
}
