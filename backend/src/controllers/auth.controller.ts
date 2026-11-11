import type { Request, Response } from "express";
import { login, register } from "../services/auth.service";
import { clearSessionCookie, setSessionCookie } from "../utils/session";

export async function registerUser(req: Request, res: Response) {
  const user = await register(req.body ?? {});
  setSessionCookie(res, user.id);
  res.status(201).json({ user });
}

export async function loginUser(req: Request, res: Response) {
  const user = await login(req.body ?? {});
  setSessionCookie(res, user.id);
  res.json({ user });
}

export function logoutUser(_req: Request, res: Response) {
  clearSessionCookie(res);
  res.status(204).end();
}
