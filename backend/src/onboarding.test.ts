import "dotenv/config";
import assert from "node:assert/strict";
import { once } from "node:events";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { after, before, test } from "node:test";
import { app } from "./app";
import { AppDataSource } from "./config/dataSource";
import { User } from "./models/User";

// shortcut: runs in the dev database and deletes its own user afterwards, use a separate database once tests run in CI.
const email = `flow-test-${Date.now()}@example.com`;
const password = "password123";
let server: Server;
let base = "";
let cookie = "";
let accessToken = "";

async function call(method: string, path: string, body?: unknown) {
  const res = await fetch(base + path, {
    method,
    headers: { "Content-Type": "application/json", Cookie: cookie, Authorization: `Bearer ${accessToken}` },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const setCookie = res.headers.getSetCookie()[0];
  if (setCookie) cookie = setCookie.split(";")[0]!;
  const json = res.status === 204 ? null : await res.json();
  // Keep the newest access token, like the frontend will.
  if (json?.accessToken) accessToken = json.accessToken;
  return { status: res.status, body: json };
}

before(async () => {
  await AppDataSource.initialize();
  server = app.listen(0);
  await once(server, "listening");
  base = `http://localhost:${(server.address() as AddressInfo).port}/api`;
});

after(async () => {
  await AppDataSource.getRepository(User).delete({ email });
  server.close();
  await AppDataSource.destroy();
});

test("register: bad input, success, duplicate", async () => {
  const bad = await call("POST", "/auth/register", { fullName: "A", email: "nope", password: "short" });
  assert.equal(bad.status, 400);
  assert.deepEqual(Object.keys(bad.body.fields).sort(), ["email", "fullName", "password"]);

  assert.equal((await call("GET", "/me")).status, 401);

  const ok = await call("POST", "/auth/register", { fullName: "Flow Test", email, password });
  assert.equal(ok.status, 201);
  assert.equal(ok.body.user.email, email);
  assert.equal(ok.body.user.password_hash, undefined);
  assert.match(cookie, /^refresh_token=.+/);
  assert.equal(typeof ok.body.accessToken, "string");

  const repeats = await Promise.all([1, 2, 3].map(() => call("POST", "/auth/register", { fullName: "Flow Test", email, password })));
  assert.deepEqual(repeats.map((r) => r.status), [409, 409, 409]);

  const badJson = await fetch(base + "/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: '{"email": ' });
  assert.equal(badJson.status, 400);
});

test("citizenship, wallet and passcode in order", async () => {
  assert.equal((await call("POST", "/me/wallet")).status, 409);

  assert.equal((await call("PATCH", "/me", { citizenship: "ZZ" })).status, 400);
  assert.equal((await call("PATCH", "/me", { citizenship: "PK" })).body.user.citizenship, "PK");

  assert.equal((await call("PATCH", "/me", { passcode: "012345" })).status, 409);

  const created = await call("POST", "/me/wallet");
  assert.equal(created.status, 201);
  assert.equal(created.body.wallet.address.length, 44);
  assert.equal(created.body.wallet.balanceUsd, 0);
  const again = await call("POST", "/me/wallet");
  assert.equal(again.status, 200);
  assert.equal(again.body.wallet.address, created.body.wallet.address);

  assert.equal((await call("PATCH", "/me", { passcode: "12345" })).status, 400);
  assert.equal((await call("PATCH", "/me", { passcode: "012345" })).body.user.hasPasscode, true);
  assert.equal((await call("PATCH", "/me", { passcode: "999999" })).status, 409);

  const me = await call("GET", "/me");
  assert.equal(me.status, 200);
  assert.deepEqual(
    [me.body.user.citizenship, me.body.user.hasPasscode, me.body.wallet.address],
    ["PK", true, created.body.wallet.address],
  );
});

test("refresh rotates the token; reusing the old one ends the session", async () => {
  const oldCookie = cookie;
  const refreshed = await call("POST", "/auth/refresh");
  assert.equal(refreshed.status, 200);
  assert.notEqual(cookie, oldCookie);
  assert.equal((await call("GET", "/me")).status, 200);

  const newCookie = cookie;
  cookie = oldCookie;
  assert.equal((await call("POST", "/auth/refresh")).status, 401);
  cookie = newCookie;
  assert.equal((await call("POST", "/auth/refresh")).status, 401, "the newer token died with the session");

  assert.equal((await call("POST", "/auth/login", { email, password })).status, 200);
});

test("logout, then login", async () => {
  assert.equal((await call("POST", "/auth/logout")).status, 204);
  assert.equal((await call("POST", "/auth/refresh")).status, 401);
  accessToken = ""; // the frontend drops it on logout; the server can't revoke it before it expires
  assert.equal((await call("GET", "/me")).status, 401);

  const wrong = await call("POST", "/auth/login", { email, password: "wrongpass1" });
  const unknown = await call("POST", "/auth/login", { email: "nobody-" + email, password });
  assert.equal(wrong.status, 401);
  assert.deepEqual(unknown, wrong);

  assert.equal((await call("POST", "/auth/login", { email: email.toUpperCase(), password })).status, 200);
  assert.equal((await call("GET", "/me")).body.user.email, email);
});
