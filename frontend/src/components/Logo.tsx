import React from "react";
import ProductBrand from "./ProductBrand";
import type { ProductBrandSize } from "../branding/productBrand";

interface LogoProps {
  size?: ProductBrandSize;
  showIcon?: boolean;
  className?: string;
  align?: "left" | "center";
}

const Logo: React.FC<LogoProps> = ({
  size = "md",
  showIcon = true,
  className = "",
  align = "left",
}) => (
  <div
    className={`flex items-center gap-3 ${
      align === "center" ? "justify-center" : ""
    } ${className}`}
  >
    {showIcon ? (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-lg font-semibold text-white shadow-lg shadow-cyan-500/20">
        S
      </div>
    ) : null}
    <ProductBrand size={size} align={align} />
  </div>
);

export default Logo;
