import type { Metadata } from "next"
import CommunicationPage from "@/components/communication-page"

export const metadata: Metadata = {
  title: "Kommunikation | KI-Prozess Dashboard",
  description: "Kommunikationsverlauf der automatisierten KI-basierten Kommunikationsprozesse",
}

export default function CommunicationPageRoute() {
  return <CommunicationPage />
}
