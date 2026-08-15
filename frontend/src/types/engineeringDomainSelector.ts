import type { EngineeringNode } from "../data/engineeringTree";
import { engineeringTree } from "../data/engineeringTree";

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
  { icon: "⚙️", name: "Industrial Engineering" },
  { icon: "🤖", name: "Automation & Robotics" },
  { icon: "☀️", name: "Renewable Energy" },
  { icon: "🏛️", name: "Architecture & Planning" },
  { icon: "🌾", name: "Agricultural Engineering" },
  { icon: "🏥", name: "Biomedical Engineering" },
  { icon: "🛢️", name: "Oil & Gas Engineering" },
] as const;

export type EngineeringDomainOption =
  (typeof ENGINEERING_DOMAIN_OPTIONS)[number];

type TreeNodeName<Node extends EngineeringNode> =
  | Node["name"]
  | (Node["children"] extends EngineeringNode[]
      ? TreeNodeName<Node["children"][number]>
      : never);

export type EngineeringTreeNodeName = TreeNodeName<
  (typeof engineeringTree)[0]
>;

export type EngineeringDomainName =
  | EngineeringDomainOption["name"]
  | EngineeringTreeNodeName;
