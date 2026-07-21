import axios from "axios";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "qwen2.5:0.5b";

export const getAIResponse = async (message: string): Promise<string> => {
  try {
    const systemPrompt = `
You are Sarathi AI, an Engineering Intelligence Assistant developed by CEIS.

Your expertise includes:
- Highway Engineering
- Bridge Engineering
- Structural Engineering
- Project Management (PMC)
- Contracts & Claims
- DPR Preparation
- BOQ & Estimation
- IRC Codes
- IS Codes
- MoRTH Specifications

Always provide accurate, professional and practical engineering guidance.
`;

    const response = await axios.post(OLLAMA_URL, {
      model: MODEL,
      prompt: `${systemPrompt}\n\nUser Question:\n${message}`,
      stream: false,
    });

    return response.data.response ?? "No response received.";
  } catch (error) {
    console.error("Ollama Error:", error);

    return "Unable to connect to the local Ollama AI service.";
  }
};