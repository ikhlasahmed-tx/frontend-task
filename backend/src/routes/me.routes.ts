import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { createWalletHandler, getMeHandler, updateMeHandler } from "../controllers/me.controller";

export const meRouter = Router();

meRouter.use(requireAuth);
meRouter.get("/", getMeHandler);
meRouter.patch("/", updateMeHandler);
meRouter.post("/wallet", createWalletHandler);
