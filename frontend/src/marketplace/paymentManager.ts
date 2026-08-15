import { getCategory } from "./categoryManager";
import type {
  EngineeringListing,
  MarketplacePayment,
  PaymentProductType,
  PromotionType,
} from "./types";

const STORAGE_KEY = "sarathi.marketplace.payments";

let paymentStore: MarketplacePayment[] = [];
let hydrated = false;

const PRODUCT_AMOUNTS: Record<PaymentProductType, number> = {
  "one-time-listing": 500,
  "featured-upgrade": 1500,
  "premium-promotion": 3000,
  "banner-advertisement": 5000,
};

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    paymentStore = raw ? (JSON.parse(raw) as MarketplacePayment[]) : [];
  } catch {
    paymentStore = [];
  }
  hydrated = true;
};

const persist = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(paymentStore.slice(0, 200)));
};

export const getPaymentAmount = (
  productType: PaymentProductType,
  categoryId?: string
): number => {
  if (categoryId) {
    const category = getCategory(categoryId as Parameters<typeof getCategory>[0]);
    if (category) {
      switch (productType) {
        case "one-time-listing":
          return category.listingFee;
        case "featured-upgrade":
          return category.featuredUpgradeFee;
        case "premium-promotion":
          return category.premiumPromotionFee;
        default:
          break;
      }
    }
  }
  return PRODUCT_AMOUNTS[productType];
};

export const createPayment = (
  listingId: string,
  productType: PaymentProductType,
  categoryId?: string
): MarketplacePayment => {
  hydrate();
  const payment: MarketplacePayment = {
    id: crypto.randomUUID(),
    listingId,
    productType,
    amount: getPaymentAmount(productType, categoryId),
    currency: "INR",
    status: "pending",
    createdAt: Date.now(),
  };
  paymentStore.unshift(payment);
  persist();
  return payment;
};

export const completePayment = (paymentId: string): MarketplacePayment | null => {
  hydrate();
  const index = paymentStore.findIndex((p) => p.id === paymentId);
  if (index < 0) return null;
  paymentStore[index] = { ...paymentStore[index], status: "completed" };
  persist();
  return paymentStore[index];
};

export const listPaymentsForListing = (listingId: string): MarketplacePayment[] => {
  hydrate();
  return paymentStore.filter((p) => p.listingId === listingId);
};

export const resolvePromotionFromPayment = (
  productType: PaymentProductType
): PromotionType | null => {
  switch (productType) {
    case "featured-upgrade":
      return "featured";
    case "premium-promotion":
      return "premium";
    case "banner-advertisement":
      return "homepage-banner";
    default:
      return null;
  }
};

export const formatPaymentOptionsForPrompt = (): string =>
  [
    "PAYMENT OPTIONS:",
    "- One-time Listing Fee — publish a standard listing",
    "- Featured Listing Upgrade — highlight in category results",
    "- Premium Promotion — top placement with verified badge",
    "- Banner Advertisement — homepage or category banner",
  ].join("\n");

export const formatPaymentSummary = (
  listing: EngineeringListing,
  productType: PaymentProductType
): string => {
  const amount = getPaymentAmount(productType, listing.categoryId);
  return `Payment initiated: ${productType} for "${listing.title}" — ₹${amount} (pending)`;
};
