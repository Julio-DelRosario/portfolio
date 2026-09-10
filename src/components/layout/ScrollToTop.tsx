"use client";

import { useEffect } from "react";

export function ScrollToTop() {
  useEffect(() => {
    // Force immediate scroll to top, bypassing CSS scroll-behavior: smooth
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    
    // Restore smooth scrolling for anchor links after the jump completes
    const timer = setTimeout(() => {
      document.documentElement.style.scrollBehavior = '';
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  return null;
}
