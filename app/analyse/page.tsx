import { Suspense } from "react";
import AnalyseView from "./AnalyseView";

export default function AnalysePage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-10">Lade …</div>}>
      <AnalyseView />
    </Suspense>
  );
}
