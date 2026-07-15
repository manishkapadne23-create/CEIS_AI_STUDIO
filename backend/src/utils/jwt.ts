import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "PMIS_SECRET_KEY";

export function generateToken(payload: any) {
  return jwt.sign(payload, SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}