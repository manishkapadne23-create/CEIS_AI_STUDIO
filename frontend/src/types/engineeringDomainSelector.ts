export const ENGINEERING_DOMAIN_OPTIONS = [
  { icon: "🏗", name: "Civil Engineering" },
  { icon: "🏭", name: "Mechanical Engineering" },
  { icon: "⚡", name: "Electrical Engineering" },
  { icon: "💻", name: "Computer Engineering" },
  { icon: "📡", name: "Electronics & Telecommunication" },
  { icon: "🧪", name: "Chemical Engineering" },
  { icon: "🚰", name: "Environmental Engineering" },
  { icon: "⛏", name: "Mining Engineering" },
  { icon: "🚢", name: "Marine Engineering" },
  { icon: "✈", name: "Aerospace Engineering" },
  { icon: "🚂", name: "Railway Engineering" },
] as const;

export type EngineeringDomainOption =
  (typeof ENGINEERING_DOMAIN_OPTIONS)[number];

export type EngineeringDomainName = EngineeringDomainOption["name"];
