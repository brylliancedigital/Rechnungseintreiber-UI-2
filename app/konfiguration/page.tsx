import type { Metadata } from "next"
import ConfigurationPage from "@/components/configuration-page"

export const metadata: Metadata = {
  title: "Konfiguration | KI-Prozess Dashboard",
  description: "Konfigurationseinstellungen für das KI-Prozess Dashboard",
}

export default function ConfigurationPageRoute() {
  return <ConfigurationPage />
}
