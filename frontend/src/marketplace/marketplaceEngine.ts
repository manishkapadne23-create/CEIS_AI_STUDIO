import { formatCategoriesForPrompt, resolveCategoryFromText } from "./categoryManager";
import {
  createListing,
  findListingByTitle,
  formatListingDetails,
  formatListingSummary,
  getSavedListings,
  recordListingContact,
  recordListingView,
  saveListing,
} from "./listingEngine";
import {
  approveListing,
  featureListing,
  listOpenReports,
  listPendingForModeration,
  parseModerationCommand,
  parseReportCommand,
  rejectListing,
  reportListing,
  suspendListing,
} from "./listingModeration";
import {
  createPayment,
  formatPaymentOptionsForPrompt,
  formatPaymentSummary,
} from "./paymentManager";
import { formatPromotionForPrompt } from "./promotionManager";
import {
  formatSearchResultsForPrompt,
  isMarketplaceQuery,
  searchFromMessage,
  searchListings,
} from "./searchEngine";
import type {
  MarketplaceEngineInput,
  MarketplaceEngineResult,
  MarketplaceExtensionHooks,
} from "./types";

let extensionHooks: MarketplaceExtensionHooks = {};

export const setMarketplaceExtensionHooks = (
  hooks: MarketplaceExtensionHooks
): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getMarketplaceExtensionHooks = (): MarketplaceExtensionHooks =>
  extensionHooks;

const parseListingCommand = (
  message: string
): { action: string; payload: string } | null => {
  const viewMatch = message.match(
    /^(?:view|show|details?\s+(?:for|of))\s+listing\s*[:\-]?\s*(.+)$/i
  );
  if (viewMatch) return { action: "view", payload: viewMatch[1].trim() };

  const saveMatch = message.match(/^save\s+listing\s*[:\-]?\s*(.+)$/i);
  if (saveMatch) return { action: "save", payload: saveMatch[1].trim() };

  const contactMatch = message.match(
    /^(?:contact|call|email)\s+(?:listing|provider)\s*[:\-]?\s*(.+)$/i
  );
  if (contactMatch) return { action: "contact", payload: contactMatch[1].trim() };

  const createMatch = message.match(
    /^(?:create|submit|add)\s+listing\s*[:\-]?\s*(.+)$/i
  );
  if (createMatch) return { action: "create", payload: createMatch[1].trim() };

  const upgradeMatch = message.match(
    /^upgrade\s+listing\s+(?:to\s+)?(featured|premium)\s*[:\-]?\s*(.+)$/i
  );
  if (upgradeMatch) {
    return {
      action: "upgrade",
      payload: `${upgradeMatch[1]}:${upgradeMatch[2].trim()}`,
    };
  }

  const listMatch = message.match(
    /^(?:list|show|browse)\s+(?:marketplace|listings?|saved\s+listings?)$/i
  );
  if (listMatch) {
    return {
      action: /\bsaved\b/i.test(message) ? "saved" : "browse",
      payload: "",
    };
  }

  const searchMatch = message.match(
    /^(?:search|find)\s+(?:marketplace|listings?|services?)\s*(?:for\s+)?(.+)?$/i
  );
  if (searchMatch) {
    return { action: "search", payload: searchMatch[1]?.trim() ?? "" };
  }

  return null;
};

/** Run Engineering Marketplace & Services Exchange for a user turn. */
export const runMarketplaceEngine = (
  input: MarketplaceEngineInput
): MarketplaceEngineResult => {
  let listingAction: string | null = null;
  let moderationAction: string | null = null;
  let paymentAction: string | null = null;
  let searchResult = null;

  const listingCommand = parseListingCommand(input.userMessage);
  if (listingCommand) {
    switch (listingCommand.action) {
      case "view": {
        const listing = findListingByTitle(listingCommand.payload);
        if (listing) {
          recordListingView(listing.id);
          listingAction = formatListingDetails(listing);
        } else {
          listingAction = `Listing not found: ${listingCommand.payload}`;
        }
        break;
      }
      case "save": {
        const listing = findListingByTitle(listingCommand.payload);
        if (listing) {
          saveListing(listing.id);
          listingAction = `Saved listing: ${listing.title}`;
        }
        break;
      }
      case "contact": {
        const listing = findListingByTitle(listingCommand.payload);
        if (listing) {
          recordListingContact(listing.id);
          listingAction = [
            `Contact ${listing.provider}:`,
            listing.email ? `Email: ${listing.email}` : "",
            listing.phone ? `Phone: ${listing.phone}` : "",
            listing.website ? `Website: ${listing.website}` : "",
            listing.applyContactLink
              ? `Apply: ${listing.applyContactLink}`
              : "",
          ]
            .filter(Boolean)
            .join("\n");
        }
        break;
      }
      case "create": {
        const categoryId =
          resolveCategoryFromText(listingCommand.payload) ??
          "engineering-consultancy";
        const listing = createListing({
          title: listingCommand.payload,
          categoryId,
          description: `Listing submitted via Sarathi AI marketplace.`,
          provider: "Submitted by user",
          location: "India",
          disciplineId: input.disciplineId,
          disciplineName: input.disciplineName,
        });
        const payment = createPayment(listing.id, "one-time-listing", categoryId);
        listingAction = `Listing submitted for approval: ${listing.title} (status: pending)`;
        paymentAction = formatPaymentSummary(listing, payment.productType);
        break;
      }
      case "upgrade": {
        const [tier, title] = listingCommand.payload.split(":");
        const listing = findListingByTitle(title);
        if (listing) {
          const productType =
            tier === "premium" ? "premium-promotion" : "featured-upgrade";
          const payment = createPayment(
            listing.id,
            productType,
            listing.categoryId
          );
          paymentAction = formatPaymentSummary(listing, payment.productType);
          listingAction = `Upgrade to ${tier} initiated for: ${listing.title}`;
        }
        break;
      }
      case "saved": {
        const saved = getSavedListings();
        listingAction =
          saved.length > 0
            ? `Saved listings:\n${saved.map((l) => `- ${formatListingSummary(l)}`).join("\n")}`
            : "No saved listings yet.";
        break;
      }
      case "browse": {
        searchResult = searchListings({ sort: "newest", limit: 8 });
        listingAction = formatSearchResultsForPrompt(searchResult);
        break;
      }
      case "search": {
        searchResult = searchFromMessage(
          listingCommand.payload || input.userMessage,
          input.disciplineId,
          input.disciplineName
        );
        listingAction = formatSearchResultsForPrompt(searchResult);
        break;
      }
    }
  }

  const moderationCommand = parseModerationCommand(input.userMessage);
  if (moderationCommand) {
    switch (moderationCommand.action) {
      case "approve":
        moderationAction =
          approveListing(moderationCommand.payload) ??
          `Listing not found: ${moderationCommand.payload}`;
        break;
      case "reject":
        moderationAction =
          rejectListing(moderationCommand.payload) ??
          `Listing not found: ${moderationCommand.payload}`;
        break;
      case "suspend":
        moderationAction =
          suspendListing(moderationCommand.payload) ??
          `Listing not found: ${moderationCommand.payload}`;
        break;
      case "feature":
        moderationAction =
          featureListing(moderationCommand.payload) ??
          `Listing not found: ${moderationCommand.payload}`;
        break;
      case "pending":
        moderationAction = listPendingForModeration();
        break;
      case "reports": {
        const reports = listOpenReports();
        moderationAction =
          reports.length > 0
            ? reports
                .map((r) => `- ${r.listingTitle}: ${r.reason}`)
                .join("\n")
            : "No open reports.";
        break;
      }
    }
  }

  const reportCommand = parseReportCommand(input.userMessage);
  if (reportCommand) {
    const listing = findListingByTitle(reportCommand.listingTitle);
    if (listing) {
      reportListing(listing.id, listing.title, reportCommand.reason);
      listingAction = `Report submitted for: ${listing.title}`;
    }
  }

  if (!searchResult && isMarketplaceQuery(input.userMessage)) {
    searchResult = searchFromMessage(
      input.userMessage,
      input.disciplineId,
      input.disciplineName
    );
    if (!listingAction) {
      listingAction = formatSearchResultsForPrompt(searchResult);
    }
  }

  const active =
    isMarketplaceQuery(input.userMessage) ||
    listingAction !== null ||
    moderationAction !== null ||
    paymentAction !== null;

  const extensionNotes: string[] = [];
  if (extensionHooks.institutionPartnershipId) {
    extensionNotes.push(
      `Institution partnership: ${extensionHooks.institutionPartnershipId}`
    );
  }
  if (extensionHooks.corporatePartnershipId) {
    extensionNotes.push(
      `Corporate partnership: ${extensionHooks.corporatePartnershipId}`
    );
  }
  if (extensionHooks.engineeringVendorId) {
    extensionNotes.push(
      `Engineering vendor: ${extensionHooks.engineeringVendorId}`
    );
  }
  if (extensionHooks.globalExpansionRegion) {
    extensionNotes.push(
      `Global region: ${extensionHooks.globalExpansionRegion}`
    );
  }
  if (extensionHooks.pmisVendorIntegrationId) {
    extensionNotes.push(
      `PMIS vendor: ${extensionHooks.pmisVendorIntegrationId}`
    );
  }

  const featuredPreview = searchListings({ sort: "featured", limit: 3 });

  const promptAugmentation = [
    "========================================",
    "Engineering Marketplace & Services Exchange (EMSE)",
    "========================================",
    "Sarathi AI is a neutral technology platform — NOT a service provider.",
    "Engineers discover services, tools and providers through verified listings.",
    "",
    listingAction ? `LISTING ACTION:\n${listingAction}` : "",
    moderationAction ? `MODERATION:\n${moderationAction}` : "",
    paymentAction ? `PAYMENT:\n${paymentAction}` : "",
    "",
    "MARKETPLACE CATEGORIES:",
    formatCategoriesForPrompt(),
    "",
    "PROMOTION TYPES:",
    formatPromotionForPrompt(),
    "",
    featuredPreview.listings.length > 0
      ? `FEATURED LISTINGS:\n${featuredPreview.listings.map((l) => `- ${formatListingSummary(l)}`).join("\n")}`
      : "",
    "",
    formatPaymentOptionsForPrompt(),
    "",
    "EMSE COMMANDS:",
    "- Search marketplace [keyword] | List marketplace | View listing [title]",
    "- Save listing [title] | Contact listing [title] | Report listing [title: reason]",
    "- Create listing [title] | Upgrade listing to featured [title]",
    "- Admin: Approve listing [title] | Feature listing [title] | List pending listings",
    extensionNotes.length > 0
      ? `\nFuture: ${extensionNotes.join("; ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const summaryText = [
    active ? "marketplace-active" : "",
    searchResult ? `${searchResult.totalCount} listings` : "",
    listingAction ? "action" : "",
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    active,
    searchResult,
    listingAction,
    moderationAction,
    paymentAction,
    promptAugmentation,
    summaryText,
  };
};

export const formatMarketplaceForPrompt = (
  result: MarketplaceEngineResult
): string => result.promptAugmentation;
