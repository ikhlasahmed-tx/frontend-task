import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../utils/HttpError";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const { sub } = jwt.verify(req.cookies?.session, process.env.JWT_SECRET!, { algorithms: ["HS256"] }) as jwt.JwtPayload;
    res.locals.userId = sub;
  } catch {
    throw new HttpError(401, "Not logged in");
  }
  next();
}
