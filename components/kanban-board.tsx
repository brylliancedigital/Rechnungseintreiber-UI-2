import type { Process } from "@/lib/types"
import { NotStartedColumn } from "@/components/not-started-column"
import { InProgressColumn } from "@/components/in-progress-column"
import { CompletedColumn } from "@/components/completed-column"
import type { InvoiceData } from "@/components/agent-card"

interface KanbanBoardProps {
  processes: Process[]
  isLoading?: boolean
  onProcessClick: (process: Process) => void
  onStartProcess: (process: Process, invoiceData?: InvoiceData[]) => void
  onPauseProcess: (process: Process) => void
  onDeleteProcess: (process: Process) => void
  onCompleteProcess: (process: Process) => void
  onCreateProcess: (process: Partial<Process>) => void
  onSaveInvoiceData?: (processId: string, data: InvoiceData[]) => void
  onUpdateProgress?: (processId: string, progress: number, total: number) => void
}

export function KanbanBoard({
  processes,
  isLoading = false,
  onProcessClick,
  onStartProcess,
  onPauseProcess,
  onDeleteProcess,
  onCompleteProcess,
  onCreateProcess,
  onSaveInvoiceData,
  onUpdateProgress,
}: KanbanBoardProps) {
  const notStartedProcesses = processes.filter((process) => process.status === "not-started")
  const inProgressProcesses = processes.filter((process) => process.status === "in-progress")
  const completedProcesses = processes.filter((process) => process.status === "completed")

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-[calc(100vh-220px)]">
      <NotStartedColumn
        processes={notStartedProcesses}
        isLoading={isLoading}
        onProcessClick={onProcessClick}
        onStartProcess={onStartProcess}
        onCreateProcess={onCreateProcess}
        onSaveInvoiceData={onSaveInvoiceData}
        onUpdateProgress={onUpdateProgress}
      />

      <InProgressColumn
        processes={inProgressProcesses}
        isLoading={isLoading}
        onProcessClick={onProcessClick}
        onPauseProcess={onPauseProcess}
        onDeleteProcess={onDeleteProcess}
        onCompleteProcess={onCompleteProcess}
        onSaveInvoiceData={onSaveInvoiceData}
        onUpdateProgress={onUpdateProgress}
      />

      <CompletedColumn processes={completedProcesses} isLoading={isLoading} onProcessClick={onProcessClick} />
    </div>
  )
}
