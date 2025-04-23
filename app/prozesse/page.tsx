import type { Metadata } from "next"
import ProcessesPage from "@/components/processes-page"

export const metadata: Metadata = {
  title: "Prozesse | KI-Prozess Dashboard",
  description: "Übersicht und Verwaltung der automatisierten KI-basierten Kommunikationsprozesse",
}

export default function ProcessesPageRoute() {
  return <ProcessesPage />
}
