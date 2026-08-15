import type { EngineeringListing, PromotionType } from "./types";

const PROMOTION_RANK: Record<PromotionType, number> = {
  "homepage-banner": 5,
  premium: 4,
  featured: 3,
  "category-banner": 2,
  standard: 1,
};

export const PROMOTION_LABELS: Record<PromotionType, string> = {
  standard: "Standard Listing",
  featured: "Featured Listing",
  premium: "Premium Listing",
  "homepage-banner": "Homepage Banner",
  "category-banner": "Category Banner",
};

export const getPromotionRank = (type: PromotionType): number =>
  PROMOTION_RANK[type];

export const sortByPromotion = (
  listings: EngineeringListing[]
): EngineeringListing[] =>
  [...listings].sort(
    (a, b) => getPromotionRank(b.promotionType) - getPromotionRank(a.promotionType)
  );

export const getFeaturedListings = (
  listings: EngineeringListing[]
): EngineeringListing[] =>
  listings.filter(
    (l) =>
      l.promotionType === "featured" ||
      l.promotionType === "premium" ||
      l.promotionType === "homepage-banner" ||
      l.promotionType === "category-banner"
  );

export const canUpgradePromotion = (
  current: PromotionType,
  target: PromotionType
): boolean => getPromotionRank(target) > getPromotionRank(current);

export const formatPromotionForPrompt = (): string =>
  Object.entries(PROMOTION_LABELS)
    .map(([id, label]) => `- ${label} (${id})`)
    .join("\n");
