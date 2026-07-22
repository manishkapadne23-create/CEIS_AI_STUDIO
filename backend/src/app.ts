import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import knowledgeBaseRoutes from "./routes/knowledgeBase.routes.js";
import engineeringDomainRoutes from "./routes/engineeringDomain.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/api", aiRoutes);
app.use("/api/knowledge-base", knowledgeBaseRoutes);
app.use("/api/engineering-domains", engineeringDomainRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PMIS Backend Running Successfully 🚀",
    version: "1.0.0",
  });
});

export default app;