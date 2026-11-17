import "dotenv/config";
import assert from "node:assert/strict";
import { test } from "node:test";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { signAccessToken } from "../utils/tokens";
import { requireAuth } from "./requireAuth";

function run(authorization?: string) {
  const req = { headers: { authorization } } as Request;
  const res = { locals: {} } as Response;
  let called = false;
  requireAuth(req, res, () => { called = true; });
  assert.equal(called, true);
  return res.locals.userId;
}

test("a valid Bearer access token passes and sets the user id", () => {
  const token = signAccessToken("user-1");
  assert.equal(run(`Bearer ${token}`), "user-1");
  assert.equal(run(`bearer ${token}`), "user-1");
});

test("missing, wrong-scheme, tampered and expired tokens are 401", () => {
  const token = signAccessToken("user-1");
  const expired = jwt.sign({ sub: "user-1", exp: Math.floor(Date.now() / 1000) - 10 }, process.env.JWT_SECRET!);
  for (const header of [undefined, "", token, `Basic ${token}`, `Bearer ${token}x`, `Bearer ${expired}`, "Bearer "]) {
    assert.throws(() => run(header), { status: 401 }, String(header));
  }
});
