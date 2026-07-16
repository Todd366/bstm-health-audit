import ScoreCard from "@/components/ScoreCard";
import DiagnosisCard from "@/components/DiagnosisCard";
import ImprovementSuggestions from "@/components/ImprovementSuggestions";
import BSTMDiscoveryButton from "@/components/BSTMDiscoveryButton";

export default function ResultsPage({ params }: { params: { businessId: string } }) {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Business Health Report</h1>
      <ScoreCard score={72} />
      <DiagnosisCard />
      <ImprovementSuggestions />
      <BSTMDiscoveryButton />
    </main>
  );
}
