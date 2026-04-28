import { Suspense } from "react";
import type { Metadata } from "next";
import AnalyseView from "./AnalyseView";

export const metadata: Metadata = {
  title: "Adress-Analyse",
  description:
    "Mietpreis, Umgebung, ÖV, Lärm, Steuern und deine Rechte für eine beliebige Schweizer Adresse.",
};

export default function AnalysePage() {
  return (
    <Suspense fallback={<div className="w-full mx-auto px-4 sm:px-6 lg:px-10 py-10">Lade …</div>}>
      <AnalyseView />
    </Suspense>
  );
}
