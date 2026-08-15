import { Request, Response } from "express";
import {
  createCategory,
  createDocument,
  createSubCategory,
  deleteCategory,
  deleteDocument,
  deleteSubCategory,
  getCategoryById,
  getDocumentById,
  getSubCategoryById,
  listCategories,
  listDocuments,
  listSubCategories,
  updateCategory,
  updateDocument,
  updateSubCategory,
} from "../services/knowledgeBase.service.js";

const sendError = (res: Response, status: number, message: string) =>
  res.status(status).json({ success: false, message });

const getIdParam = (req: Request) => {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
};

export const listKnowledgeBaseCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await listCategories();

    return res.status(200).json({ success: true, data: categories });
  } catch (error: any) {
    return sendError(res, 500, error.message || "Unable to list categories.");
  }
};

export const getKnowledgeBaseCategory = async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);

    if (!id) {
      return sendError(res, 400, "Invalid category id.");
    }

    const category = await getCategoryById(id);

    if (!category) {
      return sendError(res, 404, "Category not found.");
    }

    return res.status(200).json({ success: true, data: category });
  } catch (error: any) {
    return sendError(res, 500, error.message || "Unable to fetch category.");
  }
};

export const createKnowledgeBaseCategory = async (req: Request, res: Response) => {
  try {
    const category = await createCategory(req.body);

    return res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    return sendError(res, 400, error.message || "Unable to create category.");
  }
};

export const updateKnowledgeBaseCategory = async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);

    if (!id) {
      return sendError(res, 400, "Invalid category id.");
    }

    const category = await updateCategory(id, req.body);

    return res.status(200).json({ success: true, data: category });
  } catch (error: any) {
    return sendError(res, 400, error.message || "Unable to update category.");
  }
};

export const deleteKnowledgeBaseCategory = async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);

    if (!id) {
      return sendError(res, 400, "Invalid category id.");
    }

    const result = await deleteCategory(id);

    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return sendError(res, 400, error.message || "Unable to delete category.");
  }
};

export const listKnowledgeBaseSubCategories = async (req: Request, res: Response) => {
  try {
    const subCategories = await listSubCategories(req.query.categoryId as string | undefined);

    return res.status(200).json({ success: true, data: subCategories });
  } catch (error: any) {
    return sendError(res, 500, error.message || "Unable to list subcategories.");
  }
};

export const getKnowledgeBaseSubCategory = async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);

    if (!id) {
      return sendError(res, 400, "Invalid subcategory id.");
    }

    const subCategory = await getSubCategoryById(id);

    if (!subCategory) {
      return sendError(res, 404, "Subcategory not found.");
    }

    return res.status(200).json({ success: true, data: subCategory });
  } catch (error: any) {
    return sendError(res, 500, error.message || "Unable to fetch subcategory.");
  }
};

export const createKnowledgeBaseSubCategory = async (req: Request, res: Response) => {
  try {
    const subCategory = await createSubCategory(req.body);

    return res.status(201).json({ success: true, data: subCategory });
  } catch (error: any) {
    return sendError(res, 400, error.message || "Unable to create subcategory.");
  }
};

export const updateKnowledgeBaseSubCategory = async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);

    if (!id) {
      return sendError(res, 400, "Invalid subcategory id.");
    }

    const subCategory = await updateSubCategory(id, req.body);

    return res.status(200).json({ success: true, data: subCategory });
  } catch (error: any) {
    return sendError(res, 400, error.message || "Unable to update subcategory.");
  }
};

export const deleteKnowledgeBaseSubCategory = async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);

    if (!id) {
      return sendError(res, 400, "Invalid subcategory id.");
    }

    const result = await deleteSubCategory(id);

    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return sendError(res, 400, error.message || "Unable to delete subcategory.");
  }
};

export const listKnowledgeBaseDocuments = async (req: Request, res: Response) => {
  try {
    const documents = await listDocuments(req.query.categoryId as string | undefined, req.query.subCategoryId as string | undefined);

    return res.status(200).json({ success: true, data: documents });
  } catch (error: any) {
    return sendError(res, 500, error.message || "Unable to list documents.");
  }
};

export const getKnowledgeBaseDocument = async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);

    if (!id) {
      return sendError(res, 400, "Invalid document id.");
    }

    const document = await getDocumentById(id);

    if (!document) {
      return sendError(res, 404, "Document not found.");
    }

    return res.status(200).json({ success: true, data: document });
  } catch (error: any) {
    return sendError(res, 500, error.message || "Unable to fetch document.");
  }
};

export const createKnowledgeBaseDocument = async (req: Request, res: Response) => {
  try {
    const document = await createDocument(req.body);

    return res.status(201).json({ success: true, data: document });
  } catch (error: any) {
    return sendError(res, 400, error.message || "Unable to create document.");
  }
};

export const updateKnowledgeBaseDocument = async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);

    if (!id) {
      return sendError(res, 400, "Invalid document id.");
    }

    const document = await updateDocument(id, req.body);

    return res.status(200).json({ success: true, data: document });
  } catch (error: any) {
    return sendError(res, 400, error.message || "Unable to update document.");
  }
};

export const deleteKnowledgeBaseDocument = async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);

    if (!id) {
      return sendError(res, 400, "Invalid document id.");
    }

    const result = await deleteDocument(id);

    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return sendError(res, 400, error.message || "Unable to delete document.");
  }
};
