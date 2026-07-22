import { Request, Response } from "express";
import {
  createEngineeringDomain,
  deleteEngineeringDomain,
  getEngineeringDomainById,
  listEngineeringDomains,
  updateEngineeringDomain,
} from "../services/engineeringDomain.service";

const sendError = (res: Response, status: number, message: string) =>
  res.status(status).json({ success: false, message });

const getIdParam = (req: Request) => {
  const id = req.params.id;
  return Array.isArray(id) ? id[0] : id;
};

export const listEngineeringDomainsController = async (_req: Request, res: Response) => {
  try {
    const domains = await listEngineeringDomains();
    return res.status(200).json({ success: true, data: domains });
  } catch (error: any) {
    return sendError(res, 500, error.message || "Unable to list engineering domains.");
  }
};

export const getEngineeringDomainController = async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);

    if (!id) {
      return sendError(res, 400, "Invalid engineering domain id.");
    }

    const domain = await getEngineeringDomainById(id);

    if (!domain) {
      return sendError(res, 404, "Engineering domain not found.");
    }

    return res.status(200).json({ success: true, data: domain });
  } catch (error: any) {
    return sendError(res, 500, error.message || "Unable to fetch engineering domain.");
  }
};

export const createEngineeringDomainController = async (req: Request, res: Response) => {
  try {
    const domain = await createEngineeringDomain(req.body);
    return res.status(201).json({ success: true, data: domain });
  } catch (error: any) {
    return sendError(res, 400, error.message || "Unable to create engineering domain.");
  }
};

export const updateEngineeringDomainController = async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);

    if (!id) {
      return sendError(res, 400, "Invalid engineering domain id.");
    }

    const domain = await updateEngineeringDomain(id, req.body);
    return res.status(200).json({ success: true, data: domain });
  } catch (error: any) {
    return sendError(res, 400, error.message || "Unable to update engineering domain.");
  }
};

export const deleteEngineeringDomainController = async (req: Request, res: Response) => {
  try {
    const id = getIdParam(req);

    if (!id) {
      return sendError(res, 400, "Invalid engineering domain id.");
    }

    const result = await deleteEngineeringDomain(id);
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return sendError(res, 400, error.message || "Unable to delete engineering domain.");
  }
};
