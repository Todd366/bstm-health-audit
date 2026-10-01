import test from "node:test";
import assert from "node:assert/strict";
import { calculateScores, ratingLabel } from "../lib/scoring";
import { generateDiagnosis } from "../lib/diagnosis";
import { loadQuestions } from "../lib/questions";
import type { CategoryBlock } from "../lib/questions";

const real = loadQuestions();

function answersWith(pick: (points: number[]) => number) {
  const a: Record<string, number> = {};
  real.forEach((c) => c.questions.forEach((q) => (a[q.id] = pick(q.answers.map((x) => x.points)))));
  return a;
}

test("best answers everywhere score 100 overall and per category", () => {
  const s = calculateScores(answersWith((p) => Math.max(...p)), real);
  assert.equal(s.overall, 100);
  for (const v of Object.values(s.categories)) assert.equal(v, 100);
});

test("worst answers everywhere score 0 (every question has a 0-point option)", () => {
  const s = calculateScores(answersWith((p) => Math.min(...p)), real);
  assert.equal(s.overall, 0);
});

test("no answers scores 0 and still lists every category", () => {
  const s = calculateScores({}, real);
  assert.equal(s.overall, 0);
  assert.deepEqual(Object.keys(s.categories), real.map((c) => c.category));
});

test("averages within a category and rounds the overall", () => {
  const cats: CategoryBlock[] = [
    { category: "A", questions: [
      { id: "a1", question: "", answers: [] },
      { id: "a2", question: "", answers: [] },
    ] },
    { category: "B", questions: [{ id: "b1", question: "", answers: [] }] },
  ];
  const s = calculateScores({ a1: 100, a2: 50, b1: 40 }, cats);
  assert.equal(s.categories.A, 75);
  assert.equal(s.categories.B, 40);
  assert.equal(s.overall, 58); // (75 + 40) / 2 = 57.5 rounds to 58
});

test("ratingLabel thresholds", () => {
  const cases: [number, string][] = [
    [100, "Excellent"], [85, "Excellent"], [84, "Healthy"], [70, "Healthy"],
    [69, "Developing"], [50, "Developing"], [49, "Needs Attention"],
    [30, "Needs Attention"], [29, "Critical"], [0, "Critical"],
  ];
  for (const [score, label] of cases) assert.equal(ratingLabel(score), label, "score " + score);
});

test("diagnosis: <50 is a weakness, >=70 is a strength, 50-69 is neither", () => {
  const d = generateDiagnosis({ overall: 0, categories: { A: 49, B: 50, C: 69, D: 70 } });
  assert.deepEqual(d.weaknesses, ["A"]);
  assert.deepEqual(d.strengths, ["D"]);
});
