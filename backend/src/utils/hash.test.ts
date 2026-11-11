import assert from "node:assert/strict";
import { test } from "node:test";
import { hashSecret, verifySecret } from "./hash";

test("right password verifies, wrong one does not", async () => {
  const hashed = await hashSecret("correct horse");
  assert.equal(await verifySecret("correct horse", hashed), true);
  assert.equal(await verifySecret("wrong horse", hashed), false);
});

test("the stored value is not the password, and the same password hashes differently each time", async () => {
  const a = await hashSecret("correct horse");
  const b = await hashSecret("correct horse");
  assert.notEqual(a, "correct horse");
  assert.notEqual(a, b);
});
