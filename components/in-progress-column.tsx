"use client"
import type { Process } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AgentCard, type InvoiceData } from "@/components/agent-card"

interface InProgressColumnProps {
  processes: Process[]
  isLoading?: boolean
  onProcessClick: (process: Process) => void
  onPauseProcess: (process: Process) => void
  onDeleteProcess: (process: Process) => void
  onCompleteProcess: (process: Process) => void
  onSaveInvoiceData?: (processId: string, data: InvoiceData[]) => void
  onUpdateProgress?: (processId: string, progress: number, total: number) => void
}

export function InProgressColumn({
  processes,
  isLoading = false,
  onProcessClick,
  onPauseProcess,
  onDeleteProcess,
  onCompleteProcess,
  onSaveInvoiceData,
  onUpdateProgress,
}: InProgressColumnProps) {
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
    <div className="flex flex-col h-full bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
      <div className="p-4 sticky top-0 bg-blue-50 rounded-t-lg border-b border-blue-200 z-10">
        <h2 className="font-semibold text-gray-800 flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
          Laufend
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">{isLoading ? "..." : `${processes.length} Prozesse`}</p>
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
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-6 w-1/2" />
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : processes.length > 0 ? (
          processes.map((process) => {
            // Use invoice data from the process if available
            const invoiceData = (process.invoiceData as InvoiceData[]) || []

            return (
              <AgentCard
                key={process.id}
                id={process.id}
                title={process.name}
                status="in-progress"
                progress={process.progress}
                totalItems={process.totalItems}
                paused={process.paused}
                invoiceData={invoiceData}
                onPause={() => onPauseProcess(process)}
                onResume={() => onPauseProcess(process)}
                onDelete={() => onDeleteProcess(process)}
                onComplete={() => onCompleteProcess(process)}
                onSaveInvoiceData={handleSaveInvoiceData}
                onUpdateProgress={handleUpdateProgress}
              />
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 bg-white rounded-lg border border-dashed border-blue-200 p-6">
            <p className="text-sm">Keine laufenden Prozesse</p>
          </div>
        )}
      </div>
    </div>
  )
}
