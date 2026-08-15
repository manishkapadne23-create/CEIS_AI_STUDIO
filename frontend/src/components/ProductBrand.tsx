import React from "react";
import {
  PRODUCT_BRAND,
  type ProductBrandSize,
} from "../branding/productBrand";

interface ProductBrandProps {
  size?: ProductBrandSize;
  className?: string;
  align?: "left" | "center";
}

const sizeStyles: Record<
  ProductBrandSize,
  { owner: string; title: string; subtitle: string }
> = {
  sm: {
    owner: "text-[10px] font-medium tracking-wide text-slate-400",
    title: "text-base font-bold leading-tight text-white",
    subtitle: "text-[10px] text-slate-500",
  },
  md: {
    owner: "text-xs font-medium tracking-wide text-cyan-300/80",
    title: "text-xl font-bold leading-tight text-white",
    subtitle: "text-xs text-slate-400",
  },
  lg: {
    owner: "text-sm font-medium tracking-wide text-cyan-300/80",
    title: "text-2xl font-bold leading-tight text-white",
    subtitle: "text-sm text-slate-400",
  },
  splash: {
    owner: "text-base font-medium tracking-wide text-cyan-300/80",
    title: "text-5xl font-bold leading-tight text-white sm:text-6xl",
    subtitle: "text-lg text-slate-400",
  },
};

const ProductBrand: React.FC<ProductBrandProps> = ({
  size = "md",
  className = "",
  align = "left",
}) => {
  const styles = sizeStyles[size];
  const alignment = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`${alignment} ${className}`}>
      <p className={styles.owner}>{PRODUCT_BRAND.owner}</p>
      <p className={`${styles.title} mt-0.5`}>{PRODUCT_BRAND.title}</p>
      <p className={`${styles.subtitle} mt-0.5`}>{PRODUCT_BRAND.subtitle}</p>
    </div>
  );
};

export default ProductBrand;
