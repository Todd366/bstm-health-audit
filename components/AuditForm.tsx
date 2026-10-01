"use client";
import { useState } from "react";
import AuditIntro from "./AuditIntro";
import BusinessProfileForm, { BusinessData } from "./BusinessProfileForm";
import CategorySection from "./CategorySection";
import ProgressBar from "./ProgressBar";
import ScoreCard from "./ScoreCard";
import CategoryScore from "./CategoryScore";
import DiagnosisCard from "./DiagnosisCard";
import ImprovementSuggestions from "./ImprovementSuggestions";
import BSTMRecommendations from "./BSTMRecommendations";
import BSTMDiscoveryButton from "./BSTMDiscoveryButton";
import DebugPanel from "./DebugPanel";
import { loadQuestions } from "@/lib/questions";
import { calculateScores } from "@/lib/scoring";
import { generateDiagnosis } from "@/lib/diagnosis";
import { getSettings, addHistory } from "@/lib/localStore";

const categories = loadQuestions();

export default function AuditForm() {
  const [step, setStep] = useState(0);
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "ok" | "fail">("idle");
  const [report, setReport] = useState<any>(null);

  const totalSteps = categories.length + 2;
  const currentCategory = step >= 2 && step <= categories.length + 1 ? categories[step - 2] : null;

  async function finishAudit() {
    const scores = calculateScores(answers, categories);
    const diagnosis = generateDiagnosis(scores);
    const finalReport = { business, scores, diagnosis };
    const settings = getSettings();
    if (settings.saveHistory) {
      addHistory({
        business: (business || {}) as any,
        overall: scores.overall,
        categories: scores.categories,
        diagnosis,
      });
    }
    setReport(finalReport);
    setStep(categories.length + 2);

    setSubmitStatus("sending");
    try {
      const res = await fetch("/api/submit-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business, answers, exportToElos: settings.autoExportElos }),
      });
      setSubmitStatus(res.ok ? "ok" : "fail");
    } catch {
      setSubmitStatus("fail");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar current={step} total={totalSteps} />

      {step === 0 && <AuditIntro onStart={() => setStep(1)} />}

      {step === 1 && (
        <BusinessProfileForm
          onNext={(data) => {
            setBusiness(data);
            setStep(2);
          }}
        />
      )}

      {currentCategory && (
        <CategorySection
          category={currentCategory}
          answers={answers}
          onAnswer={(id, points) => setAnswers((prev) => ({ ...prev, [id]: points }))}
          onNext={() => (step === categories.length + 1 ? finishAudit() : setStep(step + 1))}
          isLast={step === categories.length + 1}
        />
      )}

      {report && step === categories.length + 2 && (
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
          <BSTMRecommendations businessName={business?.name || ""} />
          <BSTMDiscoveryButton />
          <button
            onClick={() => window.print()}
            className="no-print w-full card rounded-xl py-3 mt-3 text-sm text-gray-300 hover:text-white"
          >
            Print / save as PDF
          </button>
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
