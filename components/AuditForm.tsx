"use client";
import { useState } from "react";
import BusinessProfileForm, { BusinessData } from "./BusinessProfileForm";
import CategorySection from "./CategorySection";
import ProgressBar from "./ProgressBar";
import ScoreCard from "./ScoreCard";
import CategoryScore from "./CategoryScore";
import DiagnosisCard from "./DiagnosisCard";
import ImprovementSuggestions from "./ImprovementSuggestions";
import BSTMDiscoveryButton from "./BSTMDiscoveryButton";
import DebugPanel from "./DebugPanel";
import { loadQuestions } from "@/lib/questions";
import { calculateScores } from "@/lib/scoring";
import { generateDiagnosis } from "@/lib/diagnosis";

const categories = loadQuestions();

export default function AuditForm() {
  const [step, setStep] = useState(0); // 0 = profile, 1..N = categories, N+1 = results
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "ok" | "fail">("idle");
  const [report, setReport] = useState<any>(null);

  const totalSteps = categories.length + 1;
  const currentCategory = step >= 1 && step <= categories.length ? categories[step - 1] : null;

  async function finishAudit() {
    const scores = calculateScores(answers, categories);
    const diagnosis = generateDiagnosis(scores);
    const finalReport = { business, scores, diagnosis };
    setReport(finalReport);
    setStep(categories.length + 1);

    setSubmitStatus("sending");
    try {
      const res = await fetch("/api/submit-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business, answers }),
      });
      setSubmitStatus(res.ok ? "ok" : "fail");
    } catch {
      setSubmitStatus("fail");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar current={step} total={totalSteps} />

      {step === 0 && (
        <BusinessProfileForm
          onNext={(data) => {
            setBusiness(data);
            setStep(1);
          }}
        />
      )}

      {currentCategory && (
        <div key={step} className="animate-slide-up">
        <CategorySection
          category={currentCategory}
          answers={answers}
          onAnswer={(id, points) => setAnswers((prev) => ({ ...prev, [id]: points }))}
          onNext={() => (step === categories.length ? finishAudit() : setStep(step + 1))}
          isLast={step === categories.length}
        />
        </div>
      )}

      {report && step === categories.length + 1 && (
        <div>
          <ScoreCard score={report.scores.overall} />
          <div className="card rounded-2xl p-6 mb-6">
            <h3 className="font-bold mb-4">Category Breakdown</h3>
            {Object.entries(report.scores.categories).map(([name, score]) => (
              <CategoryScore key={name} name={name} score={score as number} />
            ))}
          </div>
          <DiagnosisCard
            strengths={report.diagnosis.strengths}
            weaknesses={report.diagnosis.weaknesses}
          />
          <ImprovementSuggestions weaknesses={report.diagnosis.weaknesses} />
          <BSTMDiscoveryButton />
        </div>
      )}

      <DebugPanel
        state={{
          step,
          totalSteps,
          categoriesLoaded: categories.length,
          business,
          answersCollected: Object.keys(answers).length,
          answers,
          report,
          elosExportStatus: submitStatus,
        }}
      />
    </div>
  );
}
