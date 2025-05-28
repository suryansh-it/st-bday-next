"use client";

import React from 'react';

const PortalAnimation: React.FC = () => {
  return (
    <div
      id="portal-transition"
      className="fixed inset-0 z-50 flex items-center justify-center portal-fade-animation"
      aria-hidden="true"
    />
  );
};

export default PortalAnimation;
