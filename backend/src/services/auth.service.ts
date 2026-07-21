import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "pmis_secret_key";

/* ===========================================================
   REGISTER USER
=========================================================== */

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  // Check existing user
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

/* ===========================================================
   LOGIN USER
=========================================================== */

export const loginUser = async (
  email: string,
  password: string
) => {

  console.log("======================================");
  console.log("LOGIN REQUEST");
  console.log("Email :", email);

  // Find User
  const user = await prisma.user.findUnique({
    where: { email },
  });

  console.log("User Found :", user);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare Password
  const isMatch = await bcrypt.compare(password, user.password);

  console.log("Password Match :", isMatch);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  console.log("Login Successful");
  console.log("======================================");

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};