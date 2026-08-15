import type { SignOptions } from "jsonwebtoken";

import { config } from "../config/index.js";
import jwt from "jsonwebtoken";

export function generateAccessToken(payload: object): string {
  const expiresIn =
    process.env.JWT_ACCESS_EXPIRES_IN ??
    process.env.JWT_EXPIRES_IN ??
    "1h";
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, config.jwt.secret, options);
}

export function generateToken(payload: object): string {
  return generateAccessToken(payload);
}

export function verifyToken(token: string): jwt.JwtPayload | string {
  return jwt.verify(token, config.jwt.secret);
}

export function generateRefreshTokenJwt(payload: { id: string }): string {
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? "30d";
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign({ ...payload, type: "refresh" }, config.jwt.secret, options);
}
