import jwt from "jsonwebtoken";
import type { Response } from "express";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
});

export function setSessionCookie(res: Response, userId: string) {
  const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  res.cookie("session", token, { ...cookieOptions(), maxAge: SEVEN_DAYS_MS });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie("session", cookieOptions());
}
