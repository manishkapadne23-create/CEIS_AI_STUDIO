import { resolveCategoryFromText } from "./categoryManager";
import { listApprovedListings } from "./listingEngine";
import { getFeaturedListings, sortByPromotion } from "./promotionManager";
import type {
  EngineeringListing,
  ListingSortFilter,
  MarketplaceSearchQuery,
  MarketplaceSearchResult,
} from "./types";

const applySort = (
  listings: EngineeringListing[],
  sort: ListingSortFilter = "newest"
): EngineeringListing[] => {
  switch (sort) {
    case "featured":
      return getFeaturedListings(listings).concat(
        listings.filter(
          (l) =>
            l.promotionType !== "featured" &&
            l.promotionType !== "premium" &&
            l.promotionType !== "homepage-banner" &&
            l.promotionType !== "category-banner"
        )
      );
    case "verified":
      return [...listings].sort((a, b) => {
        if (a.verifiedBusiness !== b.verifiedBusiness) {
          return a.verifiedBusiness ? -1 : 1;
        }
        return b.updatedAt - a.updatedAt;
      });
    case "most-viewed":
      return [...listings].sort((a, b) => b.viewCount - a.viewCount);
    case "most-contacted":
      return [...listings].sort((a, b) => b.contactCount - a.contactCount);
    case "newest":
    default:
      return [...listings].sort((a, b) => b.createdAt - a.createdAt);
  }
};

export const searchListings = (
  query: MarketplaceSearchQuery
): MarketplaceSearchResult => {
  let listings = listApprovedListings();

  if (query.categoryId) {
    listings = listings.filter((l) => l.categoryId === query.categoryId);
  }

  if (query.disciplineId) {
    listings = listings.filter(
      (l) => l.disciplineId === query.disciplineId || l.disciplineId === null
    );
  }

  if (query.disciplineName) {
    const discipline = query.disciplineName.toLowerCase();
    listings = listings.filter(
      (l) =>
        l.disciplineName?.toLowerCase().includes(discipline) ||
        l.description.toLowerCase().includes(discipline) ||
        l.title.toLowerCase().includes(discipline)
    );
  }

  if (query.location) {
    const location = query.location.toLowerCase();
    listings = listings.filter((l) =>
      l.location.toLowerCase().includes(location)
    );
  }

  if (query.provider) {
    const provider = query.provider.toLowerCase();
    listings = listings.filter((l) =>
      l.provider.toLowerCase().includes(provider)
    );
  }

  if (query.keyword) {
    const keyword = query.keyword.toLowerCase();
    listings = listings.filter(
      (l) =>
        l.title.toLowerCase().includes(keyword) ||
        l.description.toLowerCase().includes(keyword) ||
        l.provider.toLowerCase().includes(keyword) ||
        l.categoryName.toLowerCase().includes(keyword)
    );
  }

  listings = applySort(listings, query.sort);
  listings = sortByPromotion(listings);

  const limit = query.limit ?? 10;
  return {
    query,
    listings: listings.slice(0, limit),
    totalCount: listings.length,
  };
};

export const searchFromMessage = (
  message: string,
  disciplineId: string | null,
  disciplineName: string | null
): MarketplaceSearchResult => {
  const categoryId = resolveCategoryFromText(message);

  const locationMatch = message.match(
    /\b(?:in|at|near)\s+([A-Za-z\s,]+?)(?:\s+(?:for|category|services?)|$)/i
  );

  const keywordMatch = message.match(
    /(?:search|find|list|show)\s+(?:marketplace|listings?|services?|providers?)\s*(?:for\s+)?(.+?)(?:\s+in\s+|\s*$)/i
  );

  const keyword =
    keywordMatch?.[1]?.trim() ||
    (categoryId ? null : message.replace(/\b(marketplace|listing|service|provider)\b/gi, "").trim());

  return searchListings({
    keyword: keyword && keyword.length > 2 ? keyword : undefined,
    categoryId: categoryId ?? undefined,
    disciplineId,
    disciplineName,
    location: locationMatch?.[1]?.trim(),
    sort: /\bfeatured\b/i.test(message) ? "featured" : "newest",
    limit: 8,
  });
};

export const formatSearchResultsForPrompt = (
  result: MarketplaceSearchResult
): string => {
  if (result.listings.length === 0) {
    return "No marketplace listings found matching your search.";
  }

  const lines = result.listings.map(
    (l, i) =>
      `${i + 1}. [${l.promotionType}] ${l.title}\n   Provider: ${l.provider} | ${l.location}${l.pricing ? ` | ${l.pricing}` : ""}${l.verifiedBusiness ? " | Verified" : ""}`
  );

  return [
    `Found ${result.totalCount} listing(s):`,
    ...lines,
    "",
    "Actions: View listing [title] | Save listing [title] | Contact listing [title]",
  ].join("\n");
};

export const isMarketplaceQuery = (message: string): boolean =>
  /\b(marketplace|listing|listings|service\s+provider|find\s+(?:consultant|software|survey|training|freelance)|engineering\s+(?:consultancy|software|equipment|services?)|promote\s+listing|featured\s+listing)\b/i.test(
    message
  );
