import {
  findListingByTitle,
  listPendingListings,
  setListingPromotion,
  updateListingStatus,
} from "./listingEngine";
import type { ListingReport, PromotionType } from "./types";

const REPORTS_KEY = "sarathi.marketplace.reports";

let reportStore: ListingReport[] = [];
let reportsHydrated = false;

const hydrateReports = (): void => {
  if (reportsHydrated) return;
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    reportStore = raw ? (JSON.parse(raw) as ListingReport[]) : [];
  } catch {
    reportStore = [];
  }
  reportsHydrated = true;
};

const persistReports = (): void => {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reportStore.slice(0, 100)));
};

export const reportListing = (
  listingId: string,
  listingTitle: string,
  reason: string
): ListingReport => {
  hydrateReports();
  const report: ListingReport = {
    id: crypto.randomUUID(),
    listingId,
    listingTitle,
    reason: reason.trim(),
    reportedAt: Date.now(),
    status: "open",
  };
  reportStore.unshift(report);
  persistReports();
  return report;
};

export const listOpenReports = (): ListingReport[] => {
  hydrateReports();
  return reportStore.filter((r) => r.status === "open");
};

export const moderateReport = (
  reportId: string,
  status: "reviewed" | "dismissed"
): ListingReport | null => {
  hydrateReports();
  const index = reportStore.findIndex((r) => r.id === reportId);
  if (index < 0) return null;
  reportStore[index] = { ...reportStore[index], status };
  persistReports();
  return reportStore[index];
};

export const approveListing = (title: string): string | null => {
  const listing = findListingByTitle(title);
  if (!listing) return null;
  updateListingStatus(listing.id, "approved");
  return `Approved listing: ${listing.title}`;
};

export const rejectListing = (title: string): string | null => {
  const listing = findListingByTitle(title);
  if (!listing) return null;
  updateListingStatus(listing.id, "rejected");
  return `Rejected listing: ${listing.title}`;
};

export const suspendListing = (title: string): string | null => {
  const listing = findListingByTitle(title);
  if (!listing) return null;
  updateListingStatus(listing.id, "suspended");
  return `Suspended listing: ${listing.title}`;
};

export const featureListing = (title: string): string | null => {
  const listing = findListingByTitle(title);
  if (!listing) return null;
  setListingPromotion(listing.id, "featured" as PromotionType);
  return `Featured listing: ${listing.title}`;
};

export const listPendingForModeration = (): string => {
  const pending = listPendingListings();
  if (pending.length === 0) return "No pending listings for moderation.";
  return pending
    .map((l) => `- [pending] ${l.title} by ${l.provider}`)
    .join("\n");
};

export const parseModerationCommand = (
  message: string
): { action: string; payload: string } | null => {
  const approveMatch = message.match(/^approve\s+listing\s*[:\-]?\s*(.+)$/i);
  if (approveMatch) return { action: "approve", payload: approveMatch[1].trim() };

  const rejectMatch = message.match(/^reject\s+listing\s*[:\-]?\s*(.+)$/i);
  if (rejectMatch) return { action: "reject", payload: rejectMatch[1].trim() };

  const suspendMatch = message.match(/^suspend\s+listing\s*[:\-]?\s*(.+)$/i);
  if (suspendMatch) return { action: "suspend", payload: suspendMatch[1].trim() };

  const featureMatch = message.match(/^feature\s+listing\s*[:\-]?\s*(.+)$/i);
  if (featureMatch) return { action: "feature", payload: featureMatch[1].trim() };

  const pendingMatch = message.match(/^list\s+pending\s+listings?$/i);
  if (pendingMatch) return { action: "pending", payload: "" };

  const reportsMatch = message.match(/^list\s+(?:open\s+)?reports?$/i);
  if (reportsMatch) return { action: "reports", payload: "" };

  return null;
};

export const parseReportCommand = (
  message: string
): { listingTitle: string; reason: string } | null => {
  const match = message.match(/^report\s+listing\s*[:\-]?\s*(.+)$/i);
  if (!match) return null;
  const parts = match[1].split(/[:\-]/);
  return {
    listingTitle: parts[0]?.trim() ?? match[1].trim(),
    reason: parts.slice(1).join(" ").trim() || "User reported concern",
  };
};
