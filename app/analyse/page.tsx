import { Suspense } from "react";
import AnalyseView from "./AnalyseView";

export default function AnalysePage() {
  return (
    <Suspense fallback={<div className="w-full mx-auto px-4 sm:px-6 lg:px-10 py-10">Lade …</div>}>
      <AnalyseView />
    </Suspense>
  );
}
