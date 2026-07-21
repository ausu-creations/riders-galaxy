import React from "react";

export default function TickerRibbon() {
  return (
    <div className="ticker-ribbon py-3">
      <div className="ticker-track">
        <div className="ticker-group">
          <span>⚡ MONSOON GEAR</span>
          <span>⚡ ₹500 OFF FIRST ORDER</span>
          <span>⚡ FREE SHIPPING PAN INDIA</span>
          <span>⚡ AUTHORIZED DEALER</span>
          <span>⚡ LADAKH READY</span>
        </div>

        <div className="ticker-group" aria-hidden="true">
          <span>⚡ MONSOON GEAR</span>
          <span>⚡ ₹500 OFF FIRST ORDER</span>
          <span>⚡ FREE SHIPPING PAN INDIA</span>
          <span>⚡ AUTHORIZED DEALER</span>
          <span>⚡ LADAKH READY</span>
        </div>
      </div>
    </div>
  );
}
