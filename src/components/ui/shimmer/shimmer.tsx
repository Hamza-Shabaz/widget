// components/ShimmerMessage.tsx
import React from "react";
import "./shimmer.css";

const ShimmerMessage = () => {
  return (
    <div className="shimmer-message rounded-xl p-2 bg-gray-300 self-start">
      <div className="shimmer-line w-48 h-4 mb-2"></div>
      <div className="shimmer-line w-32 h-4"></div>
    </div>
  );
};

export default ShimmerMessage;
