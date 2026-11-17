import "dotenv/config";
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/dataSource";
import { RefreshToken } from "../models/RefreshToken";
import { User } from "../models/User";
import { issueRefreshToken, revokeRefreshToken, rotateRefreshToken } from "./tokens";

// shortcut: runs in the dev database and deletes its own user afterwards (sessions go with it), use a separate database once tests run in CI.
let userId = "";

before(async () => {
  await AppDataSource.initialize();
  const user = await AppDataSource.getRepository(User).save({
    full_name: "Token Test",
    email: `token-test-${Date.now()}@example.com`,
    password_hash: "x",
  });
  userId = user.id;
});

after(async () => {
  await AppDataSource.getRepository(User).delete({ id: userId });
  await AppDataSource.destroy();
});

const sessionCount = () => AppDataSource.getRepository(RefreshToken).countBy({ user_id: userId });

test("rotation returns a new pair and the access token belongs to the user", async () => {
  const first = await issueRefreshToken(userId);
  const { accessToken, refreshToken } = await rotateRefreshToken(first);

  assert.notEqual(refreshToken, first);
  assert.equal(refreshToken.split(".")[0], first.split(".")[0], "same session row");
  assert.equal((jwt.verify(accessToken, process.env.JWT_SECRET!) as jwt.JwtPayload).sub, userId);
  await revokeRefreshToken(refreshToken);
});

test("reusing an old refresh token ends the whole session", async () => {
  const first = await issueRefreshToken(userId);
  const { refreshToken: second } = await rotateRefreshToken(first);

  await assert.rejects(rotateRefreshToken(first), { status: 401 });
  await assert.rejects(rotateRefreshToken(second), { status: 401 }, "the newer token died too");
  assert.equal(await sessionCount(), 0);
});

test("revoke ends the session; garbage tokens are rejected without a 500", async () => {
  const token = await issueRefreshToken(userId);
  await revokeRefreshToken(token);
  await assert.rejects(rotateRefreshToken(token), { status: 401 });

  for (const bad of [undefined, "", "abc", "not-a-uuid.secret", `${token}.extra`]) {
    await assert.rejects(rotateRefreshToken(bad), { status: 401 });
    await revokeRefreshToken(bad);
  }
});

test("an expired session is rejected", async () => {
  const token = await issueRefreshToken(userId);
  await AppDataSource.getRepository(RefreshToken).update({ id: token.split(".")[0] }, { expires_at: new Date(Date.now() - 1000) });
  await assert.rejects(rotateRefreshToken(token), { status: 401 });
});
