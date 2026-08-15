import { prisma } from "../prisma/prisma.js";

const normalizeText = (value?: string) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const ensureName = (value: unknown, fieldName: string) => {
  if (typeof value !== "string" || value.trim().length < 2) {
    throw new Error(`${fieldName} must be at least 2 characters long.`);
  }

  return value.trim();
};

const ensureSlug = (value: unknown, fallback: string) => {
  if (typeof value === "string" && value.trim().length > 0) {
    const slug = value.trim().toLowerCase();

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error("Slug must be lowercase letters, numbers and hyphens only.");
    }

    return slug;
  }

  const generated = fallback
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!generated) {
    throw new Error("Slug is required.");
  }

  return generated;
};

const ensureDisplayOrder = (value: unknown) => {
  if (value === undefined || value === null) {
    return 0;
  }

  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new Error("Display order must be an integer.");
  }

  return value;
};

const ensureBoolean = (value: unknown, fallback: boolean) => {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (typeof value !== "boolean") {
    throw new Error("isActive must be a boolean.");
  }

  return value;
};

export const listEngineeringDomains = async () =>
  prisma.engineeringDomain.findMany({
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  });

export const getEngineeringDomainById = async (id: string) =>
  prisma.engineeringDomain.findUnique({
    where: { id },
  });

export const createEngineeringDomain = async (input: {
  name: string;
  slug?: string;
  icon?: string;
  description?: string;
  color?: string;
  displayOrder?: number;
  isActive?: boolean;
}) => {
  const name = ensureName(input.name, "Domain name");
  const slug = ensureSlug(input.slug, name);
  const icon = normalizeText(input.icon) ?? "🛠️";
  const description = normalizeText(input.description);
  const color = normalizeText(input.color) ?? "#06b6d4";
  const displayOrder = ensureDisplayOrder(input.displayOrder);
  const isActive = ensureBoolean(input.isActive, true);

  const existingDomain = await prisma.engineeringDomain.findFirst({
    where: {
      OR: [
        {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
        {
          slug: {
            equals: slug,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  if (existingDomain) {
    throw new Error("Engineering domain already exists.");
  }

  return prisma.engineeringDomain.create({
    data: {
      name,
      slug,
      icon,
      description,
      color,
      displayOrder,
      isActive,
    },
  });
};

export const updateEngineeringDomain = async (
  id: string,
  input: {
    name?: string;
    slug?: string;
    icon?: string;
    description?: string;
    color?: string;
    displayOrder?: number;
    isActive?: boolean;
  }
) => {
  const existingDomain = await prisma.engineeringDomain.findUnique({
    where: { id },
  });

  if (!existingDomain) {
    throw new Error("Engineering domain not found.");
  }

  const name = input.name !== undefined ? ensureName(input.name, "Domain name") : existingDomain.name;
  const slug = input.slug !== undefined ? ensureSlug(input.slug, name) : existingDomain.slug;
  const icon = input.icon !== undefined ? normalizeText(input.icon) ?? "🛠️" : existingDomain.icon ?? "🛠️";
  const description = input.description !== undefined ? normalizeText(input.description) : existingDomain.description ?? undefined;
  const color = input.color !== undefined ? normalizeText(input.color) ?? "#06b6d4" : existingDomain.color ?? "#06b6d4";
  const displayOrder = input.displayOrder !== undefined ? ensureDisplayOrder(input.displayOrder) : existingDomain.displayOrder;
  const isActive = input.isActive !== undefined ? ensureBoolean(input.isActive, existingDomain.isActive) : existingDomain.isActive;

  const duplicateDomain = await prisma.engineeringDomain.findFirst({
    where: {
      id: { not: id },
      OR: [
        {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
        {
          slug: {
            equals: slug,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  if (duplicateDomain) {
    throw new Error("Engineering domain already exists.");
  }

  return prisma.engineeringDomain.update({
    where: { id },
    data: {
      name,
      slug,
      icon,
      description,
      color,
      displayOrder,
      isActive,
    },
  });
};

export const deleteEngineeringDomain = async (id: string) => {
  const existingDomain = await prisma.engineeringDomain.findUnique({
    where: { id },
  });

  if (!existingDomain) {
    throw new Error("Engineering domain not found.");
  }

  await prisma.engineeringDomain.delete({
    where: { id },
  });

  return { success: true, message: "Engineering domain deleted successfully." };
};
