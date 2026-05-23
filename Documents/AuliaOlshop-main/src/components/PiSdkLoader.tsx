"use client";

import { useEffect } from "react";

export default function PiSdkLoader() {
  useEffect(() => {
    // Load Pi SDK dynamically
    const script = document.createElement("script");
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.async = true;
    
    script.onload = () => {
      // Initialize Pi SDK after it loads
      if (typeof window !== "undefined" && window.Pi) {
        window.Pi.init({ version: "2.0" });
        console.log("Pi SDK initialized successfully");
      }
    };
    
    script.onerror = () => {
      console.error("Failed to load Pi SDK");
    };
    
    document.head.appendChild(script);
    
    // Cleanup
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);
  
  return null;
}
