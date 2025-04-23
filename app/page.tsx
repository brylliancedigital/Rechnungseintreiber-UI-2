import type { Metadata } from "next"
import Dashboard from "@/components/dashboard"

export const metadata: Metadata = {
  title: "KI-Prozess Dashboard",
  description: "Steuerung und Echtzeitüberwachung von automatisierten KI-basierten Kommunikationsprozessen",
}

export default function Home() {
  return <Dashboard />
}
