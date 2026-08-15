import React from "react";
import ProductBrand from "./ProductBrand";

interface SplashScreenProps {
  className?: string;
}

/**
 * Branded splash screen shell for future loading / boot flows.
 */
const SplashScreen: React.FC<SplashScreenProps> = ({ className = "" }) => (
  <div
    className={`flex min-h-screen items-center justify-center bg-slate-950 text-white ${className}`}
  >
    <div className="flex flex-col items-center gap-6 px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-2xl font-bold text-white shadow-lg shadow-cyan-500/20">
        S
      </div>
      <ProductBrand size="splash" align="center" />
    </div>
  </div>
);

export default SplashScreen;
