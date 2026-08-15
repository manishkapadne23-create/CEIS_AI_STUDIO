import type { MarketplaceCategory, MarketplaceCategoryId } from "./types";

const DEFAULT_CATEGORIES: MarketplaceCategory[] = [
  { id: "engineering-consultancy", name: "Engineering Consultancy", description: "Professional engineering consultancy services", listingFee: 500, featuredUpgradeFee: 1500, premiumPromotionFee: 3000, active: true },
  { id: "engineering-software", name: "Engineering Software", description: "CAD, analysis, BIM and engineering software", listingFee: 800, featuredUpgradeFee: 2000, premiumPromotionFee: 4000, active: true },
  { id: "training-institutes", name: "Training Institutes", description: "Engineering training and certification institutes", listingFee: 600, featuredUpgradeFee: 1800, premiumPromotionFee: 3500, active: true },
  { id: "online-courses", name: "Online Courses", description: "Online engineering courses and e-learning", listingFee: 400, featuredUpgradeFee: 1200, premiumPromotionFee: 2500, active: true },
  { id: "engineering-books", name: "Engineering Books", description: "Technical books and reference publications", listingFee: 300, featuredUpgradeFee: 900, premiumPromotionFee: 1800, active: true },
  { id: "engineering-equipment", name: "Engineering Equipment", description: "Survey, testing and construction equipment", listingFee: 700, featuredUpgradeFee: 2000, premiumPromotionFee: 3800, active: true },
  { id: "survey-services", name: "Survey Services", description: "Land, topographic and geodetic survey", listingFee: 500, featuredUpgradeFee: 1500, premiumPromotionFee: 3000, active: true },
  { id: "testing-laboratories", name: "Testing Laboratories", description: "Material and soil testing laboratories", listingFee: 600, featuredUpgradeFee: 1800, premiumPromotionFee: 3500, active: true },
  { id: "design-consultants", name: "Design Consultants", description: "Structural, geotechnical and MEP design", listingFee: 600, featuredUpgradeFee: 1800, premiumPromotionFee: 3500, active: true },
  { id: "freelance-engineering", name: "Freelance Engineering Services", description: "Independent engineering professionals", listingFee: 300, featuredUpgradeFee: 900, premiumPromotionFee: 1800, active: true },
  { id: "technical-writing", name: "Technical Writing", description: "DPR, specifications and technical documentation", listingFee: 400, featuredUpgradeFee: 1200, premiumPromotionFee: 2500, active: true },
  { id: "cad-bim-services", name: "CAD/BIM Services", description: "CAD drafting and BIM modeling services", listingFee: 500, featuredUpgradeFee: 1500, premiumPromotionFee: 3000, active: true },
  { id: "gis-services", name: "GIS Services", description: "Geographic information system services", listingFee: 500, featuredUpgradeFee: 1500, premiumPromotionFee: 3000, active: true },
  { id: "drone-survey", name: "Drone Survey", description: "UAV-based survey and mapping", listingFee: 600, featuredUpgradeFee: 1800, premiumPromotionFee: 3500, active: true },
  { id: "quantity-survey", name: "Quantity Survey", description: "Cost estimation and quantity surveying", listingFee: 500, featuredUpgradeFee: 1500, premiumPromotionFee: 3000, active: true },
  { id: "legal-arbitration", name: "Legal & Arbitration Services", description: "Construction law and dispute resolution", listingFee: 800, featuredUpgradeFee: 2400, premiumPromotionFee: 4500, active: true },
  { id: "recruitment-agencies", name: "Recruitment Agencies", description: "Engineering talent recruitment", listingFee: 700, featuredUpgradeFee: 2000, premiumPromotionFee: 3800, active: true },
];

let categoryStore: MarketplaceCategory[] = [...DEFAULT_CATEGORIES];

export const listCategories = (): MarketplaceCategory[] =>
  categoryStore.filter((c) => c.active);

export const getCategory = (
  categoryId: MarketplaceCategoryId
): MarketplaceCategory | null =>
  categoryStore.find((c) => c.id === categoryId) ?? null;

export const getCategoryName = (categoryId: MarketplaceCategoryId): string =>
  getCategory(categoryId)?.name ?? categoryId;

export const resolveCategoryFromText = (
  text: string
): MarketplaceCategoryId | null => {
  const normalized = text.toLowerCase();
  for (const category of categoryStore) {
    if (
      normalized.includes(category.id.replace(/-/g, " ")) ||
      normalized.includes(category.name.toLowerCase())
    ) {
      return category.id;
    }
  }
  if (/consult/i.test(normalized)) return "engineering-consultancy";
  if (/software|cad|bim/i.test(normalized)) return "engineering-software";
  if (/training|institute/i.test(normalized)) return "training-institutes";
  if (/course|online/i.test(normalized)) return "online-courses";
  if (/survey|drone/i.test(normalized)) return "survey-services";
  if (/test|lab/i.test(normalized)) return "testing-laboratories";
  if (/freelance/i.test(normalized)) return "freelance-engineering";
  if (/recruit/i.test(normalized)) return "recruitment-agencies";
  return null;
};

export const updateCategoryPricing = (
  categoryId: MarketplaceCategoryId,
  fees: Partial<Pick<MarketplaceCategory, "listingFee" | "featuredUpgradeFee" | "premiumPromotionFee">>
): MarketplaceCategory | null => {
  const index = categoryStore.findIndex((c) => c.id === categoryId);
  if (index < 0) return null;
  categoryStore[index] = { ...categoryStore[index], ...fees };
  return categoryStore[index];
};

export const formatCategoriesForPrompt = (): string =>
  listCategories()
    .map((c) => `- ${c.name} (listing: ₹${c.listingFee})`)
    .join("\n");
