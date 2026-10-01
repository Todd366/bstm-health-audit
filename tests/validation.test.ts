import test from "node:test";
import assert from "node:assert/strict";
import { validateAuditPayload } from "../lib/validation";
import { loadQuestions } from "../lib/questions";

const cats = loadQuestions();

function goodAnswers() {
  const a: Record<string, number> = {};
  cats.forEach((c) => c.questions.forEach((q) => (a[q.id] = q.answers[0].points)));
  return a;
}
const good = () => ({ business: { name: "Test Co", industry: "Retail", location: "Gaborone" }, answers: goodAnswers() });

test("accepts a valid payload", () => {
  assert.equal(validateAuditPayload(good(), cats).ok, true);
});

test("rejects non-object bodies", () => {
  for (const b of [null, undefined, "x", 42]) assert.equal(validateAuditPayload(b as any, cats).ok, false);
});

test("rejects bad business profiles", () => {
  assert.equal(validateAuditPayload({ ...good(), business: undefined }, cats).ok, false);
  assert.equal(validateAuditPayload({ ...good(), business: [] }, cats).ok, false);
  assert.equal(validateAuditPayload({ ...good(), business: { name: "x".repeat(201) } }, cats).ok, false);
  assert.equal(validateAuditPayload({ ...good(), business: { name: { nested: 1 } } }, cats).ok, false);
  const tooMany: Record<string, string> = {};
  for (let i = 0; i < 21; i++) tooMany["k" + i] = "v";
  assert.equal(validateAuditPayload({ ...good(), business: tooMany }, cats).ok, false);
});

test("rejects bad answers", () => {
  assert.equal(validateAuditPayload({ ...good(), answers: {} }, cats).ok, false);
  assert.equal(validateAuditPayload({ ...good(), answers: [] }, cats).ok, false);
  assert.equal(validateAuditPayload({ ...good(), answers: { zz: 100 } }, cats).ok, false);
  const firstId = cats[0].questions[0].id;
  assert.equal(validateAuditPayload({ ...good(), answers: { [firstId]: 37 } }, cats).ok, false);
  assert.equal(validateAuditPayload({ ...good(), answers: { [firstId]: "100" as any } }, cats).ok, false);
});

test("accepts partial answers that are all valid", () => {
  const firstId = cats[0].questions[0].id;
  const pts = cats[0].questions[0].answers[0].points;
  assert.equal(validateAuditPayload({ ...good(), answers: { [firstId]: pts } }, cats).ok, true);
});
