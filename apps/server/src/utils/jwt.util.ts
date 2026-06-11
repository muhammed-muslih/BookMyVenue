import jwt from "jsonwebtoken";
import { env } from "@config/env";

type UserRole = "user" | "owner" | "admin";

export interface JWTPayload {
  id: string;
  roles: UserRole[];
  activeRole: UserRole;
}

export interface TempJWTPayload {
  identifier: string;
  verified: true;
}

export interface RefreshTokenPayload {
  id: string;
}

export const signJWT = (payload: JWTPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const verifyJWT = (token: string): JWTPayload =>
  jwt.verify(token, env.JWT_SECRET) as JWTPayload;

export const signTempJWT = (payload: TempJWTPayload): string => {
  return jwt.sign(payload, env.JWT_TEMP_SECRET, {
    expiresIn: env.JWT_TEMP_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const verifyTempJWT = (token: string): TempJWTPayload =>
  jwt.verify(token, env.JWT_TEMP_SECRET) as TempJWTPayload;

export const signRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
