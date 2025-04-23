"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { StatCards } from "@/components/stat-cards"
import { KanbanBoard } from "@/components/kanban-board"
import { CommunicationDrawer } from "@/components/communication-drawer"
import { PrioritizedClients } from "@/components/prioritized-clients"
import type { Process } from "@/lib/types"
import { initialProcesses } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"
import { fetchProcesses, createProcess, updateProcess, deleteProcess } from "@/services/api"
import type { InvoiceData } from "@/components/agent-card"

export default function Dashboard() {
  const [processes, setProcesses] = useState<Process[]>(initialProcesses)
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Laden der Prozesse beim ersten Rendern
  useEffect(() => {
    const loadProcesses = async () => {
      try {
        const data = await fetchProcesses()
        setProcesses(data)
      } catch (error) {
        toast({
          title: "Fehler beim Laden der Prozesse",
          description: "Die Prozesse konnten nicht geladen werden. Bitte versuchen Sie es später erneut.",
          variant: "destructive",
        })
        console.error("Failed to load processes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProcesses()
  }, [toast])

  const handleProcessClick = (process: Process) => {
    setSelectedProcess(process)
    setDrawerOpen(true)
  }

  const handleStartProcess = async (process: Process, invoiceData?: InvoiceData[]) => {
    try {
      const updatedProcess = await updateProcess(process.id, {
        status: "in-progress",
        startDate: new Date().toISOString(),
        totalItems: invoiceData?.length || process.totalItems,
        invoiceData: invoiceData,
      })

      setProcesses(processes.map((p) => (p.id === process.id ? updatedProcess : p)))

      toast({
        title: "Prozess gestartet",
        description: `Der Prozess "${process.name}" wurde erfolgreich gestartet.`,
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Fehler beim Starten des Prozesses",
        description: "Der Prozess konnte nicht gestartet werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      })
      console.error("Failed to start process:", error)
    }
  }

  const handlePauseProcess = async (process: Process) => {
    try {
      const updatedProcess = await updateProcess(process.id, {
        paused: !process.paused,
      })

      setProcesses(processes.map((p) => (p.id === process.id ? updatedProcess : p)))

      toast({
        title: process.paused ? "Prozess fortgesetzt" : "Prozess pausiert",
        description: `Der Prozess "${process.name}" wurde erfolgreich ${process.paused ? "fortgesetzt" : "pausiert"}.`,
        variant: "info",
      })
    } catch (error) {
      toast({
        title: "Fehler beim Ändern des Prozessstatus",
        description: "Der Prozessstatus konnte nicht geändert werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      })
      console.error("Failed to update process:", error)
    }
  }

  const handleDeleteProcess = async (process: Process) => {
    try {
      await deleteProcess(process.id)

      setProcesses(processes.filter((p) => p.id !== process.id))

      toast({
        title: "Prozess gelöscht",
        description: `Der Prozess "${process.name}" wurde erfolgreich gelöscht.`,
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Fehler beim Löschen des Prozesses",
        description: "Der Prozess konnte nicht gelöscht werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      })
      console.error("Failed to delete process:", error)
    }
  }

  const handleCompleteProcess = async (process: Process) => {
    try {
      const updatedProcess = await updateProcess(process.id, {
        status: "completed",
        completionDate: new Date().toISOString(),
        progress: process.totalItems,
      })

      setProcesses(processes.map((p) => (p.id === process.id ? updatedProcess : p)))

      toast({
        title: "Prozess abgeschlossen",
        description: `Der Prozess "${process.name}" wurde erfolgreich abgeschlossen.`,
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Fehler beim Abschließen des Prozesses",
        description: "Der Prozess konnte nicht abgeschlossen werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      })
      console.error("Failed to complete process:", error)
    }
  }

  const handleCreateProcess = async (newProcess: Partial<Process>) => {
    try {
      const createdProcess = await createProcess(newProcess)

      setProcesses([...processes, createdProcess])

      toast({
        title: "Prozess erstellt",
        description: `Der Prozess "${createdProcess.name}" wurde erfolgreich erstellt.`,
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Fehler beim Erstellen des Prozesses",
        description: "Der Prozess konnte nicht erstellt werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      })
      console.error("Failed to create process:", error)
    }
  }

  const handleSaveInvoiceData = async (processId: string, invoiceData: InvoiceData[]) => {
    try {
      const process = processes.find((p) => p.id === processId)
      if (!process) return

      const updatedProcess = await updateProcess(processId, {
        invoiceData: invoiceData,
        totalItems: invoiceData.length,
      })

      setProcesses(processes.map((p) => (p.id === processId ? updatedProcess : p)))

      toast({
        title: "Rechnungsdaten gespeichert",
        description: `Die Rechnungsdaten für "${process.name}" wurden erfolgreich gespeichert.`,
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Fehler beim Speichern der Rechnungsdaten",
        description: "Die Rechnungsdaten konnten nicht gespeichert werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      })
      console.error("Failed to save invoice data:", error)
    }
  }

  // Update the handleUpdateProgress function to avoid unnecessary state updates
  const handleUpdateProgress = async (processId: string, progress: number, total: number) => {
    try {
      const process = processes.find((p) => p.id === processId)
      if (!process) return

      // Only update if the total has actually changed
      if (process.totalItems !== total) {
        // Create a local updated process to avoid waiting for the API
        const localUpdatedProcess = {
          ...process,
          totalItems: total,
        }

        // Update the local state immediately
        setProcesses(processes.map((p) => (p.id === processId ? localUpdatedProcess : p)))

        // Then update the backend asynchronously
        await updateProcess(processId, {
          totalItems: total,
        })
      }
    } catch (error) {
      console.error("Failed to update progress:", error)
    }
  }

  // Berechne Metriken für die Stat-Karten
  const metrics = {
    active: processes.filter((p) => p.status === "in-progress").length,
    notStarted: processes.filter((p) => p.status === "not-started").length,
    completed: processes.filter((p) => p.status === "completed").length,
    newInteractions: processes.reduce((sum, p) => {
      const today = new Date().toDateString()
      const newMessages = p.messages.filter((m) => new Date(m.timestamp).toDateString() === today).length
      return sum + newMessages
    }, 0),
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <StatCards metrics={metrics} />

        {/* Priorisierte Kunden-Widget */}
        <PrioritizedClients className="mb-8" />

        <KanbanBoard
          processes={processes}
          isLoading={isLoading}
          onProcessClick={handleProcessClick}
          onStartProcess={handleStartProcess}
          onPauseProcess={handlePauseProcess}
          onDeleteProcess={handleDeleteProcess}
          onCompleteProcess={handleCompleteProcess}
          onCreateProcess={handleCreateProcess}
          onSaveInvoiceData={handleSaveInvoiceData}
          onUpdateProgress={handleUpdateProgress}
        />
        <CommunicationDrawer process={selectedProcess} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </Layout>
  )
}
