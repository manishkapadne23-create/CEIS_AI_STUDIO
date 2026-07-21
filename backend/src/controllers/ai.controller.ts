import { Request, Response } from "express";
import { getAIResponse } from "../services/ai.service.js";

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Message is required.",
      });
    }

    const reply = await getAIResponse(message);

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("AI Controller Error:", error);

    return res.status(500).json({
      success: false,
      error: "Unable to process request.",
    });
  }
};