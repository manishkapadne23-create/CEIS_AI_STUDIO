export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  ENGINEER: "ENGINEER",
  REVIEWER: "REVIEWER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Record<Role, number> = {
  ADMIN: 100,
  REVIEWER: 50,
  ENGINEER: 30,
  USER: 10,
};
