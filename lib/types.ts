export type ProcessStatus = "not-started" | "in-progress" | "completed"

export interface Message {
  sender: "system" | "participant"
  content: string
  timestamp: string
}

export interface InvoiceItem {
  mandant_phone: string
  invoice_number: string
  amount: number
}

export interface Process {
  id: string
  name: string
  status: ProcessStatus
  totalItems: number
  progress: number
  paused: boolean
  messages: Message[]
  createdAt: string
  startDate?: string
  completionDate?: string
  targetDate: string
  invoiceData?: InvoiceItem[]
}
