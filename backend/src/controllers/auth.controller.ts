import type { Request, Response } from "express";
import { login, register } from "../services/auth.service";
import { clearRefreshCookie, REFRESH_COOKIE, setRefreshCookie } from "../utils/session";
import { issueRefreshToken, revokeRefreshToken, rotateRefreshToken, signAccessToken } from "../utils/tokens";

export async function registerUser(req: Request, res: Response) {
  const user = await register(req.body ?? {});
  setRefreshCookie(res, await issueRefreshToken(user.id));
  res.status(201).json({ user, accessToken: signAccessToken(user.id) });
}

export async function loginUser(req: Request, res: Response) {
  const user = await login(req.body ?? {});
  setRefreshCookie(res, await issueRefreshToken(user.id));
  res.json({ user, accessToken: signAccessToken(user.id) });
}

export async function refreshTokens(req: Request, res: Response) {
  const { accessToken, refreshToken } = await rotateRefreshToken(req.cookies?.[REFRESH_COOKIE]);
  setRefreshCookie(res, refreshToken);
  res.json({ accessToken });
}

export async function logoutUser(req: Request, res: Response) {
  await revokeRefreshToken(req.cookies?.[REFRESH_COOKIE]);
  clearRefreshCookie(res);
  res.status(204).end();
}
