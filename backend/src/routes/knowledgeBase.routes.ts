import { Router } from "express";
import {
  createKnowledgeBaseCategory,
  createKnowledgeBaseDocument,
  createKnowledgeBaseSubCategory,
  deleteKnowledgeBaseCategory,
  deleteKnowledgeBaseDocument,
  deleteKnowledgeBaseSubCategory,
  getKnowledgeBaseCategory,
  getKnowledgeBaseDocument,
  getKnowledgeBaseSubCategory,
  listKnowledgeBaseCategories,
  listKnowledgeBaseDocuments,
  listKnowledgeBaseSubCategories,
  updateKnowledgeBaseCategory,
  updateKnowledgeBaseDocument,
  updateKnowledgeBaseSubCategory,
} from "../controllers/knowledgeBase.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.get("/categories", authorize(["ADMIN", "USER"]), listKnowledgeBaseCategories);
router.post("/categories", authorize(["ADMIN"]), createKnowledgeBaseCategory);
router.get("/categories/:id", authorize(["ADMIN", "USER"]), getKnowledgeBaseCategory);
router.put("/categories/:id", authorize(["ADMIN"]), updateKnowledgeBaseCategory);
router.delete("/categories/:id", authorize(["ADMIN"]), deleteKnowledgeBaseCategory);

router.get("/subcategories", authorize(["ADMIN", "USER"]), listKnowledgeBaseSubCategories);
router.post("/subcategories", authorize(["ADMIN"]), createKnowledgeBaseSubCategory);
router.get("/subcategories/:id", authorize(["ADMIN", "USER"]), getKnowledgeBaseSubCategory);
router.put("/subcategories/:id", authorize(["ADMIN"]), updateKnowledgeBaseSubCategory);
router.delete("/subcategories/:id", authorize(["ADMIN"]), deleteKnowledgeBaseSubCategory);

router.get("/documents", authorize(["ADMIN", "USER"]), listKnowledgeBaseDocuments);
router.post("/documents", authorize(["ADMIN"]), createKnowledgeBaseDocument);
router.get("/documents/:id", authorize(["ADMIN", "USER"]), getKnowledgeBaseDocument);
router.put("/documents/:id", authorize(["ADMIN"]), updateKnowledgeBaseDocument);
router.delete("/documents/:id", authorize(["ADMIN"]), deleteKnowledgeBaseDocument);

export default router;
