import type { Request, Response } from "express";
import { createWallet, getMe, updateMe } from "../services/me.service";

export async function getMeHandler(_req: Request, res: Response) {
  res.json(await getMe(res.locals.userId));
}

export async function updateMeHandler(req: Request, res: Response) {
  res.json(await updateMe(res.locals.userId, req.body ?? {}));
}

export async function createWalletHandler(_req: Request, res: Response) {
  const { wallet, created } = await createWallet(res.locals.userId);
  res.status(created ? 201 : 200).json({ wallet });
}