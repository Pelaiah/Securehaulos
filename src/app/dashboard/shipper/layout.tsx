'use client';
import React, { Children, cloneElement } from 'react';

// This layout is now handled by the main dashboard layout.
// This file is kept to avoid breaking Next.js routing, but it just passes children through.
export default function ShipperDashboardLayout({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) {
    // Pass props down to child pages
    const childrenWithProps = Children.map(children, child => {
    if (React.isValidElement(child)) {
      return cloneElement(child, props as any);
    }
    return child;
  });
  return <>{childrenWithProps}</>;
}
