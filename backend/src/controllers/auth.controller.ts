import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser(name, email, password);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user,
    });
  } catch (error: any) {
    console.error("Register Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log("========== LOGIN API ==========");

    const { email, password } = req.body;

    const result = await loginUser(email, password);

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    console.error("Login Error:", error);

    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};