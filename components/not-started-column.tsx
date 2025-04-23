"use client"

import { useState } from "react"
import { Plus, Calendar } from "lucide-react"
import type { Process } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { AgentCard, type InvoiceData } from "@/components/agent-card"

interface NotStartedColumnProps {
  processes: Process[]
  isLoading?: boolean
  onProcessClick: (process: Process) => void
  onStartProcess: (process: Process, invoiceData?: InvoiceData[]) => void
  onCreateProcess: (process: Partial<Process>) => void
  onSaveInvoiceData?: (processId: string, data: InvoiceData[]) => void
  onUpdateProgress?: (processId: string, progress: number, total: number) => void
}

export function NotStartedColumn({
  processes,
  isLoading = false,
  onProcessClick,
  onStartProcess,
  onCreateProcess,
  onSaveInvoiceData,
  onUpdateProgress,
}: NotStartedColumnProps) {
  const [newProcessOpen, setNewProcessOpen] = useState(false)
  const [newProcess, setNewProcess] = useState({
    name: "",
    totalItems: 5,
    targetDate: formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  })

  const handleCreateProcess = () => {
    onCreateProcess({
      name: newProcess.name,
      totalItems: newProcess.totalItems,
      targetDate: new Date(newProcess.targetDate).toISOString(),
    })
    setNewProcess({
      name: "",
      totalItems: 5,
      targetDate: formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    })
    setNewProcessOpen(false)
  }

  const handleStartProcess = (id: string, invoiceData: InvoiceData[]) => {
    const process = processes.find((p) => p.id === id)
    if (process) {
      onStartProcess(process, invoiceData)
    }
  }

  const handleSaveInvoiceData = (processId: string, data: InvoiceData[]) => {
    if (onSaveInvoiceData) {
      onSaveInvoiceData(processId, data)
    }
  }

  const handleUpdateProgress = (processId: string, progress: number, total: number) => {
    if (onUpdateProgress) {
      onUpdateProgress(processId, progress, total)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 flex items-center justify-between sticky top-0 bg-gray-50 rounded-t-lg border-b border-gray-200 z-10">
        <div>
          <h2 className="font-semibold text-gray-800 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
            Nicht gestartet
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{isLoading ? "..." : `${processes.length} Prozesse`}</p>
        </div>
        <Button
          size="sm"
          onClick={() => setNewProcessOpen(true)}
          className="h-8 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          <span>Neuer Prozess</span>
        </Button>
      </div>

      <div className="flex-1 p-3 space-y-3 overflow-auto">
        {isLoading ? (
          // Skeleton-Loader für Ladezustand
          Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-3/4" />
              </CardHeader>
              <CardContent className="pb-2 space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : processes.length > 0 ? (
          processes.map((process) => (
            <AgentCard
              key={process.id}
              id={process.id}
              title={process.name}
              status="not-started"
              progress={0}
              totalItems={process.totalItems}
              onStart={handleStartProcess}
              onEdit={(id, data) => {
                // Handle edit
                console.log("Edit process", id, data)
              }}
              onDelete={(id) => {
                // Handle delete
                console.log("Delete process", id)
              }}
              onSaveInvoiceData={handleSaveInvoiceData}
              onUpdateProgress={handleUpdateProgress}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300 p-6">
            <p className="text-sm mb-2">Keine Prozesse vorhanden</p>
            <Button variant="outline" size="sm" onClick={() => setNewProcessOpen(true)} className="text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Prozess erstellen
            </Button>
          </div>
        )}
      </div>

      <Dialog open={newProcessOpen} onOpenChange={setNewProcessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neuen Prozess erstellen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="process-name">Prozessname</Label>
              <Input
                id="process-name"
                value={newProcess.name}
                onChange={(e) => setNewProcess({ ...newProcess, name: e.target.value })}
                placeholder="Name des Prozesses"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="process-items">Anzahl der Interaktionseinheiten</Label>
              <Input
                id="process-items"
                type="number"
                value={newProcess.totalItems}
                onChange={(e) => setNewProcess({ ...newProcess, totalItems: Number.parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="process-date">Zieldatum</Label>
              <div className="relative">
                <Input
                  id="process-date"
                  type="date"
                  value={newProcess.targetDate}
                  onChange={(e) => setNewProcess({ ...newProcess, targetDate: e.target.value })}
                  className="pl-9"
                />
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <Button className="w-full" onClick={handleCreateProcess}>
              Prozess erstellen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
