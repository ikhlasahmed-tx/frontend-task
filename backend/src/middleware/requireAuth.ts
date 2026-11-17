import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../utils/HttpError";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // The scheme name is case-insensitive (RFC 7235).
  const token = req.headers.authorization?.match(/^Bearer (\S+)$/i)?.[1] ?? "";
  try {
    const { sub } = jwt.verify(token, process.env.JWT_SECRET!, { algorithms: ["HS256"] }) as jwt.JwtPayload;
    res.locals.userId = sub;
  } catch {
    throw new HttpError(401, "Not logged in");
  }
  next();
}
