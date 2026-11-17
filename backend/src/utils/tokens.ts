import { randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { LessThan } from "typeorm";
import { AppDataSource } from "../config/dataSource";
import { RefreshToken } from "../models/RefreshToken";
import { hashSecret, verifySecret } from "./hash";
import { HttpError } from "./HttpError";

const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

export const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const UUID_PATTERN = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

export function signAccessToken(userId: string) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET!, { algorithm: "HS256", expiresIn: "15m" });
}

function parseRefreshToken(token: unknown) {
  const [id, secret, extra] = typeof token === "string" ? token.split(".") : [];
  // Checked here because Postgres throws on a malformed uuid, which would surface as a 500.
  if (!id || !secret || extra !== undefined || !UUID_PATTERN.test(id)) return null;
  return { id, secret };
}

export async function issueRefreshToken(userId: string) {
  // shortcut: clears every expired session on each login, move to a scheduled job if the table gets large.
  await refreshTokenRepository.delete({ expires_at: LessThan(new Date()) });

  const secret = randomBytes(32).toString("base64url");
  const row = await refreshTokenRepository.save(
    refreshTokenRepository.create({
      user_id: userId,
      token_hash: await hashSecret(secret),
      expires_at: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    }),
  );
  return `${row.id}.${secret}`;
}

// Swaps a valid refresh token for a new pair. The session keeps its original expiry, so users log in again every 7 days.
export async function rotateRefreshToken(token: unknown) {
  const parsed = parseRefreshToken(token);
  const row = parsed && (await refreshTokenRepository.findOneBy({ id: parsed.id }));
  if (!parsed || !row || row.expires_at <= new Date()) {
    throw new HttpError(401, "Not logged in");
  }

  // An old token from this session came back: someone else has a copy, so end the session for both.
  if (!(await verifySecret(parsed.secret, row.token_hash))) {
    await refreshTokenRepository.delete({ id: row.id });
    throw new HttpError(401, "Not logged in");
  }

  const secret = randomBytes(32).toString("base64url");
  // Only updates if the hash is still the one we read, so two refreshes at once can't both win.
  const { affected } = await refreshTokenRepository.update(
    { id: row.id, token_hash: row.token_hash },
    { token_hash: await hashSecret(secret) },
  );
  if (affected !== 1) {
    throw new HttpError(401, "Not logged in");
  }

  return { accessToken: signAccessToken(row.user_id), refreshToken: `${row.id}.${secret}` };
}

export async function revokeRefreshToken(token: unknown) {
  const parsed = parseRefreshToken(token);
  const row = parsed && (await refreshTokenRepository.findOneBy({ id: parsed.id }));
  if (row && (await verifySecret(parsed.secret, row.token_hash))) {
    await refreshTokenRepository.delete({ id: row.id });
  }
}
