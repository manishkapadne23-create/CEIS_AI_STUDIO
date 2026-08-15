import { getCategoryName } from "./categoryManager";
import type {
  AdvertisementStatus,
  CreateListingInput,
  EngineeringListing,
  PromotionType,
} from "./types";

const STORAGE_KEY = "sarathi.marketplace.listings";
const SAVED_KEY = "sarathi.marketplace.saved";

let listingStore: EngineeringListing[] = [];
let savedListingIds: Set<string> = new Set();
let hydrated = false;

const SEED_LISTINGS: EngineeringListing[] = [
  {
    id: "seed-structural-consult",
    title: "Structural Design Consultancy — Metro Projects",
    categoryId: "design-consultants",
    categoryName: "Design Consultants",
    description: "Specialized structural design for metro, bridges and high-rise buildings. IRC and IS code compliant.",
    provider: "MetroStruct Consultants Pvt Ltd",
    location: "Mumbai, Maharashtra",
    pricing: "₹50,000 – ₹5,00,000 per project",
    website: "https://example.com/metrostruct",
    email: "contact@metrostruct.example",
    phone: "+91 98765 43210",
    applyContactLink: "https://example.com/metrostruct/apply",
    validityUntil: "2027-12-31",
    advertisementStatus: "approved",
    promotionType: "featured",
    verifiedBusiness: true,
    disciplineId: "structural",
    disciplineName: "Structural Engineering",
    viewCount: 142,
    contactCount: 28,
    savedByUser: false,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: "seed-survey-drone",
    title: "Drone Survey & Aerial Mapping Services",
    categoryId: "drone-survey",
    categoryName: "Drone Survey",
    description: "DGCA-compliant drone survey for highways, dams, mining and urban mapping. Orthomosaic and DTM deliverables.",
    provider: "SkyMap Geospatial",
    location: "Hyderabad, Telangana",
    pricing: "₹15,000 per sq km",
    website: "https://example.com/skymap",
    email: "info@skymap.example",
    phone: "+91 91234 56789",
    applyContactLink: null,
    validityUntil: "2027-06-30",
    advertisementStatus: "approved",
    promotionType: "premium",
    verifiedBusiness: true,
    disciplineId: "surveying",
    disciplineName: "Surveying",
    viewCount: 89,
    contactCount: 15,
    savedByUser: false,
    createdAt: Date.now() - 86400000 * 45,
    updatedAt: Date.now() - 86400000 * 10,
  },
  {
    id: "seed-geo-software",
    title: "GeoTech Analysis Suite — Slope Stability & FEM",
    categoryId: "engineering-software",
    categoryName: "Engineering Software",
    description: "Geotechnical analysis software for slope stability, settlement and finite element modeling.",
    provider: "GeoSoft India",
    location: "Bengaluru, Karnataka",
    pricing: "₹1,20,000/year subscription",
    website: "https://example.com/geosoft",
    email: "sales@geosoft.example",
    phone: "+91 99887 76655",
    applyContactLink: "https://example.com/geosoft/trial",
    validityUntil: "2027-03-31",
    advertisementStatus: "approved",
    promotionType: "standard",
    verifiedBusiness: false,
    disciplineId: "geotechnical",
    disciplineName: "Geotechnical Engineering",
    viewCount: 56,
    contactCount: 9,
    savedByUser: false,
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 3,
  },
];

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    listingStore = raw ? (JSON.parse(raw) as EngineeringListing[]) : [...SEED_LISTINGS];
    const savedRaw = localStorage.getItem(SAVED_KEY);
    savedListingIds = new Set(
      savedRaw ? (JSON.parse(savedRaw) as string[]) : []
    );
  } catch {
    listingStore = [...SEED_LISTINGS];
    savedListingIds = new Set();
  }
  hydrated = true;
};

const persist = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listingStore.slice(0, 500)));
  localStorage.setItem(SAVED_KEY, JSON.stringify([...savedListingIds]));
};

export const createListing = (input: CreateListingInput): EngineeringListing => {
  hydrate();
  const now = Date.now();
  const listing: EngineeringListing = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    categoryId: input.categoryId,
    categoryName: getCategoryName(input.categoryId),
    description: input.description.trim(),
    provider: input.provider.trim(),
    location: input.location.trim(),
    pricing: input.pricing ?? null,
    website: input.website ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
    applyContactLink: input.applyContactLink ?? null,
    validityUntil: input.validityUntil ?? null,
    advertisementStatus: "pending",
    promotionType: "standard",
    verifiedBusiness: false,
    disciplineId: input.disciplineId ?? null,
    disciplineName: input.disciplineName ?? null,
    viewCount: 0,
    contactCount: 0,
    savedByUser: false,
    createdAt: now,
    updatedAt: now,
  };
  listingStore.unshift(listing);
  persist();
  return listing;
};

export const getListing = (listingId: string): EngineeringListing | null => {
  hydrate();
  const listing = listingStore.find((l) => l.id === listingId);
  if (!listing) return null;
  return { ...listing, savedByUser: savedListingIds.has(listingId) };
};

export const findListingByTitle = (title: string): EngineeringListing | null => {
  hydrate();
  const normalized = title.toLowerCase();
  const listing =
    listingStore.find((l) => l.title.toLowerCase().includes(normalized)) ??
    null;
  if (!listing) return null;
  return { ...listing, savedByUser: savedListingIds.has(listing.id) };
};

export const listApprovedListings = (): EngineeringListing[] => {
  hydrate();
  return listingStore
    .filter((l) => l.advertisementStatus === "approved")
    .map((l) => ({ ...l, savedByUser: savedListingIds.has(l.id) }));
};

export const listAllListings = (): EngineeringListing[] => {
  hydrate();
  return listingStore.map((l) => ({
    ...l,
    savedByUser: savedListingIds.has(l.id),
  }));
};

export const listPendingListings = (): EngineeringListing[] => {
  hydrate();
  return listingStore.filter((l) => l.advertisementStatus === "pending");
};

export const updateListingStatus = (
  listingId: string,
  status: AdvertisementStatus
): EngineeringListing | null => {
  hydrate();
  const index = listingStore.findIndex((l) => l.id === listingId);
  if (index < 0) return null;
  listingStore[index] = {
    ...listingStore[index],
    advertisementStatus: status,
    updatedAt: Date.now(),
  };
  persist();
  return listingStore[index];
};

export const setListingPromotion = (
  listingId: string,
  promotionType: PromotionType
): EngineeringListing | null => {
  hydrate();
  const index = listingStore.findIndex((l) => l.id === listingId);
  if (index < 0) return null;
  listingStore[index] = {
    ...listingStore[index],
    promotionType,
    updatedAt: Date.now(),
  };
  persist();
  return listingStore[index];
};

export const recordListingView = (listingId: string): void => {
  hydrate();
  const index = listingStore.findIndex((l) => l.id === listingId);
  if (index < 0) return;
  listingStore[index].viewCount += 1;
  listingStore[index].updatedAt = Date.now();
  persist();
};

export const recordListingContact = (listingId: string): void => {
  hydrate();
  const index = listingStore.findIndex((l) => l.id === listingId);
  if (index < 0) return;
  listingStore[index].contactCount += 1;
  listingStore[index].updatedAt = Date.now();
  persist();
};

export const saveListing = (listingId: string): boolean => {
  hydrate();
  if (!listingStore.some((l) => l.id === listingId)) return false;
  savedListingIds.add(listingId);
  persist();
  return true;
};

export const getSavedListings = (): EngineeringListing[] => {
  hydrate();
  return listingStore
    .filter((l) => savedListingIds.has(l.id))
    .map((l) => ({ ...l, savedByUser: true }));
};

export const formatListingDetails = (listing: EngineeringListing): string =>
  [
    `Title: ${listing.title}`,
    `Category: ${listing.categoryName}`,
    `Provider: ${listing.provider}`,
    `Location: ${listing.location}`,
    listing.pricing ? `Pricing: ${listing.pricing}` : "",
    `Status: ${listing.advertisementStatus} | Promotion: ${listing.promotionType}`,
    listing.verifiedBusiness ? "Verified Business: Yes" : "",
    listing.website ? `Website: ${listing.website}` : "",
    listing.email ? `Email: ${listing.email}` : "",
    listing.phone ? `Phone: ${listing.phone}` : "",
    listing.applyContactLink ? `Apply/Contact: ${listing.applyContactLink}` : "",
    `Description: ${listing.description.slice(0, 200)}`,
  ]
    .filter(Boolean)
    .join("\n");

export const formatListingSummary = (listing: EngineeringListing): string =>
  `[${listing.promotionType}] ${listing.title} — ${listing.provider} (${listing.location})`;
