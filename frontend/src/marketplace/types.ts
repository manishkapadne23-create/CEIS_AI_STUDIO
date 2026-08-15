export type MarketplaceCategoryId =
  | "engineering-consultancy"
  | "engineering-software"
  | "training-institutes"
  | "online-courses"
  | "engineering-books"
  | "engineering-equipment"
  | "survey-services"
  | "testing-laboratories"
  | "design-consultants"
  | "freelance-engineering"
  | "technical-writing"
  | "cad-bim-services"
  | "gis-services"
  | "drone-survey"
  | "quantity-survey"
  | "legal-arbitration"
  | "recruitment-agencies";

export type PromotionType =
  | "standard"
  | "featured"
  | "premium"
  | "homepage-banner"
  | "category-banner";

export type AdvertisementStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended";

export type ListingSortFilter =
  | "newest"
  | "featured"
  | "verified"
  | "most-viewed"
  | "most-contacted";

export type PaymentProductType =
  | "one-time-listing"
  | "featured-upgrade"
  | "premium-promotion"
  | "banner-advertisement";

export interface MarketplaceCategory {
  id: MarketplaceCategoryId;
  name: string;
  description: string;
  listingFee: number;
  featuredUpgradeFee: number;
  premiumPromotionFee: number;
  active: boolean;
}

export interface EngineeringListing {
  id: string;
  title: string;
  categoryId: MarketplaceCategoryId;
  categoryName: string;
  description: string;
  provider: string;
  location: string;
  pricing: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  applyContactLink: string | null;
  validityUntil: string | null;
  advertisementStatus: AdvertisementStatus;
  promotionType: PromotionType;
  verifiedBusiness: boolean;
  disciplineId: string | null;
  disciplineName: string | null;
  viewCount: number;
  contactCount: number;
  savedByUser: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ListingReport {
  id: string;
  listingId: string;
  listingTitle: string;
  reason: string;
  reportedAt: number;
  status: "open" | "reviewed" | "dismissed";
}

export interface MarketplacePayment {
  id: string;
  listingId: string;
  productType: PaymentProductType;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  createdAt: number;
}

export interface MarketplaceSearchQuery {
  keyword?: string;
  disciplineId?: string | null;
  disciplineName?: string | null;
  location?: string;
  categoryId?: MarketplaceCategoryId;
  provider?: string;
  sort?: ListingSortFilter;
  limit?: number;
}

export interface MarketplaceSearchResult {
  query: MarketplaceSearchQuery;
  listings: EngineeringListing[];
  totalCount: number;
}

export interface MarketplaceEngineInput {
  userMessage: string;
  conversationId: string;
  disciplineId: string | null;
  disciplineName: string | null;
}

export interface MarketplaceEngineResult {
  active: boolean;
  searchResult: MarketplaceSearchResult | null;
  listingAction: string | null;
  moderationAction: string | null;
  paymentAction: string | null;
  promptAugmentation: string;
  summaryText: string;
}

export interface MarketplaceExtensionHooks {
  institutionPartnershipId?: string | null;
  corporatePartnershipId?: string | null;
  engineeringVendorId?: string | null;
  globalExpansionRegion?: string | null;
  pmisVendorIntegrationId?: string | null;
}

export interface CreateListingInput {
  title: string;
  categoryId: MarketplaceCategoryId;
  description: string;
  provider: string;
  location: string;
  pricing?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  applyContactLink?: string | null;
  validityUntil?: string | null;
  disciplineId?: string | null;
  disciplineName?: string | null;
}
