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

export const createCategory = async (input: { name: string; description?: string }) => {
  const name = ensureName(input.name, "Category name");
  const description = normalizeText(input.description);

  const existingCategory = await prisma.knowledgeBaseCategory.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
      deletedAt: null,
    },
  });

  if (existingCategory) {
    throw new Error("Category already exists.");
  }

  return prisma.knowledgeBaseCategory.create({
    data: {
      name,
      description,
    },
  });
};

export const updateCategory = async (
  id: string,
  input: { name?: string; description?: string; isActive?: boolean }
) => {
  const category = await prisma.knowledgeBaseCategory.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  const name = input.name !== undefined ? ensureName(input.name, "Category name") : category.name;
  const description = input.description !== undefined ? normalizeText(input.description) : category.description ?? undefined;

  const duplicateCategory = await prisma.knowledgeBaseCategory.findFirst({
    where: {
      id: { not: id },
      name: {
        equals: name,
        mode: "insensitive",
      },
      deletedAt: null,
    },
  });

  if (duplicateCategory) {
    throw new Error("Category already exists.");
  }

  return prisma.knowledgeBaseCategory.update({
    where: { id },
    data: {
      name,
      description,
      isActive: input.isActive ?? category.isActive,
    },
  });
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.knowledgeBaseCategory.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  const now = new Date();

  await prisma.$transaction([
    prisma.knowledgeBaseCategory.updateMany({
      where: { id },
      data: { deletedAt: now, isActive: false },
    }),
    prisma.knowledgeBaseSubCategory.updateMany({
      where: { categoryId: id, deletedAt: null },
      data: { deletedAt: now, isActive: false },
    }),
    prisma.knowledgeBaseDocument.updateMany({
      where: { categoryId: id, deletedAt: null },
      data: { deletedAt: now, isActive: false },
    }),
  ]);

  return { success: true, message: "Category deleted successfully." };
};

export const listCategories = async () =>
  prisma.knowledgeBaseCategory.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

export const getCategoryById = async (id: string) =>
  prisma.knowledgeBaseCategory.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      subCategories: {
        where: {
          deletedAt: null,
        },
      },
    },
  });

export const createSubCategory = async (input: { name: string; description?: string; categoryId: string }) => {
  const name = ensureName(input.name, "Subcategory name");
  const description = normalizeText(input.description);

  const category = await prisma.knowledgeBaseCategory.findFirst({
    where: {
      id: input.categoryId,
      deletedAt: null,
    },
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  const existingSubCategory = await prisma.knowledgeBaseSubCategory.findFirst({
    where: {
      categoryId: input.categoryId,
      name: {
        equals: name,
        mode: "insensitive",
      },
      deletedAt: null,
    },
  });

  if (existingSubCategory) {
    throw new Error("Subcategory already exists in this category.");
  }

  return prisma.knowledgeBaseSubCategory.create({
    data: {
      name,
      description,
      categoryId: input.categoryId,
    },
  });
};

export const updateSubCategory = async (
  id: string,
  input: { name?: string; description?: string; categoryId?: string; isActive?: boolean }
) => {
  const subCategory = await prisma.knowledgeBaseSubCategory.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!subCategory) {
    throw new Error("Subcategory not found.");
  }

  const name = input.name !== undefined ? ensureName(input.name, "Subcategory name") : subCategory.name;
  const description = input.description !== undefined ? normalizeText(input.description) : subCategory.description ?? undefined;
  const categoryId = input.categoryId ?? subCategory.categoryId;

  const category = await prisma.knowledgeBaseCategory.findFirst({
    where: {
      id: categoryId,
      deletedAt: null,
    },
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  const duplicateSubCategory = await prisma.knowledgeBaseSubCategory.findFirst({
    where: {
      id: { not: id },
      categoryId,
      name: {
        equals: name,
        mode: "insensitive",
      },
      deletedAt: null,
    },
  });

  if (duplicateSubCategory) {
    throw new Error("Subcategory already exists in this category.");
  }

  return prisma.knowledgeBaseSubCategory.update({
    where: { id },
    data: {
      name,
      description,
      categoryId,
      isActive: input.isActive ?? subCategory.isActive,
    },
  });
};

export const deleteSubCategory = async (id: string) => {
  const subCategory = await prisma.knowledgeBaseSubCategory.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!subCategory) {
    throw new Error("Subcategory not found.");
  }

  const now = new Date();

  await prisma.$transaction([
    prisma.knowledgeBaseSubCategory.updateMany({
      where: { id },
      data: { deletedAt: now, isActive: false },
    }),
    prisma.knowledgeBaseDocument.updateMany({
      where: { subCategoryId: id, deletedAt: null },
      data: { deletedAt: now, isActive: false },
    }),
  ]);

  return { success: true, message: "Subcategory deleted successfully." };
};

export const listSubCategories = async (categoryId?: string) =>
  prisma.knowledgeBaseSubCategory.findMany({
    where: {
      deletedAt: null,
      ...(categoryId ? { categoryId } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
    },
  });

export const getSubCategoryById = async (id: string) =>
  prisma.knowledgeBaseSubCategory.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      category: true,
      documents: {
        where: {
          deletedAt: null,
        },
      },
    },
  });

export const createDocument = async (input: { title: string; content: string; subCategoryId: string; categoryId?: string }) => {
  const title = ensureName(input.title, "Document title");
  const content = normalizeText(input.content);
  const subCategoryId = input.subCategoryId;

  if (!content) {
    throw new Error("Document content is required.");
  }

  const subCategory = await prisma.knowledgeBaseSubCategory.findFirst({
    where: {
      id: subCategoryId,
      deletedAt: null,
    },
  });

  if (!subCategory) {
    throw new Error("Subcategory not found.");
  }

  const categoryId = input.categoryId ?? subCategory.categoryId;

  const category = await prisma.knowledgeBaseCategory.findFirst({
    where: {
      id: categoryId,
      deletedAt: null,
    },
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  const existingDocument = await prisma.knowledgeBaseDocument.findFirst({
    where: {
      subCategoryId,
      title: {
        equals: title,
        mode: "insensitive",
      },
      deletedAt: null,
    },
  });

  if (existingDocument) {
    throw new Error("Document already exists in this subcategory.");
  }

  return prisma.knowledgeBaseDocument.create({
    data: {
      title,
      content,
      categoryId,
      subCategoryId,
    },
  });
};

export const updateDocument = async (
  id: string,
  input: { title?: string; content?: string; subCategoryId?: string; categoryId?: string; isActive?: boolean }
) => {
  const document = await prisma.knowledgeBaseDocument.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!document) {
    throw new Error("Document not found.");
  }

  const title = input.title !== undefined ? ensureName(input.title, "Document title") : document.title;
  const content = input.content !== undefined ? normalizeText(input.content) : document.content;
  const subCategoryId = input.subCategoryId ?? document.subCategoryId;
  const categoryId = input.categoryId ?? document.categoryId ?? (await prisma.knowledgeBaseSubCategory.findFirst({ where: { id: subCategoryId, deletedAt: null } }))?.categoryId;

  if (!content) {
    throw new Error("Document content is required.");
  }

  const subCategory = await prisma.knowledgeBaseSubCategory.findFirst({
    where: {
      id: subCategoryId,
      deletedAt: null,
    },
  });

  if (!subCategory) {
    throw new Error("Subcategory not found.");
  }

  const category = await prisma.knowledgeBaseCategory.findFirst({
    where: {
      id: categoryId,
      deletedAt: null,
    },
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  const duplicateDocument = await prisma.knowledgeBaseDocument.findFirst({
    where: {
      id: { not: id },
      subCategoryId,
      title: {
        equals: title,
        mode: "insensitive",
      },
      deletedAt: null,
    },
  });

  if (duplicateDocument) {
    throw new Error("Document already exists in this subcategory.");
  }

  return prisma.knowledgeBaseDocument.update({
    where: { id },
    data: {
      title,
      content,
      categoryId,
      subCategoryId,
      isActive: input.isActive ?? document.isActive,
    },
  });
};

export const deleteDocument = async (id: string) => {
  const document = await prisma.knowledgeBaseDocument.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!document) {
    throw new Error("Document not found.");
  }

  await prisma.knowledgeBaseDocument.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  });

  return { success: true, message: "Document deleted successfully." };
};

export const listDocuments = async (categoryId?: string, subCategoryId?: string) =>
  prisma.knowledgeBaseDocument.findMany({
    where: {
      deletedAt: null,
      ...(categoryId ? { categoryId } : {}),
      ...(subCategoryId ? { subCategoryId } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      subCategory: true,
    },
  });

export const getDocumentById = async (id: string) =>
  prisma.knowledgeBaseDocument.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      category: true,
      subCategory: true,
    },
  });
