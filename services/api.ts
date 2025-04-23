import type { Process, Message } from "@/lib/types"
import { initialProcesses } from "@/lib/data"

// In einer echten Anwendung würden diese Funktionen API-Aufrufe oder Supabase-Abfragen machen
// Für jetzt simulieren wir das Verhalten mit lokalen Daten

// Prozesse
export async function fetchProcesses(): Promise<Process[]> {
  // Simuliere API-Latenz
  await new Promise((resolve) => setTimeout(resolve, 300))
  return initialProcesses
}

export async function fetchProcessById(id: string): Promise<Process | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const process = initialProcesses.find((p) => p.id === id)
  return process || null
}

export async function createProcess(processData: Partial<Process>): Promise<Process> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newProcess: Process = {
    id: `process-${Date.now()}`,
    name: processData.name || "Neuer Prozess",
    status: "not-started",
    totalItems: processData.totalItems || 5,
    progress: 0,
    paused: false,
    messages: [],
    createdAt: new Date().toISOString(),
    targetDate: processData.targetDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }

  // In einer echten Anwendung würden wir hier den Prozess in der Datenbank speichern
  // z.B. mit Supabase:
  // const { data, error } = await supabase.from('processes').insert(newProcess).select().single()
  // if (error) throw error
  // return data

  return newProcess
}

export async function updateProcess(id: string, updates: Partial<Process>): Promise<Process> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const process = initialProcesses.find((p) => p.id === id)
  if (!process) {
    throw new Error(`Process with ID ${id} not found`)
  }

  const updatedProcess = { ...process, ...updates }

  // In einer echten Anwendung würden wir hier den Prozess in der Datenbank aktualisieren
  // z.B. mit Supabase:
  // const { data, error } = await supabase.from('processes').update(updates).eq('id', id).select().single()
  // if (error) throw error
  // return data

  return updatedProcess
}

export async function deleteProcess(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  // In einer echten Anwendung würden wir hier den Prozess aus der Datenbank löschen
  // z.B. mit Supabase:
  // const { error } = await supabase.from('processes').delete().eq('id', id)
  // if (error) throw error

  return true
}

// Nachrichten
export async function fetchMessages(processId: string): Promise<Message[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const process = initialProcesses.find((p) => p.id === processId)
  return process?.messages || []
}

export async function addMessage(processId: string, message: Omit<Message, "timestamp">): Promise<Message> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const newMessage: Message = {
    ...message,
    timestamp: new Date().toISOString(),
  }

  // In einer echten Anwendung würden wir hier die Nachricht in der Datenbank speichern
  // z.B. mit Supabase:
  // const { data, error } = await supabase.from('messages').insert({
  //   processId,
  //   sender: message.sender,
  //   content: message.content
  // }).select().single()
  // if (error) throw error
  // return data

  return newMessage
}

// Kunden
export async function fetchPrioritizedClients(): Promise<any[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  // Beispieldaten für priorisierte Kunden
  return [
    {
      id: "client-1",
      name: "Acme Inc.",
      contactPerson: "John Doe",
      pendingItems: 5,
      nextDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "client-2",
      name: "Globex Corp",
      contactPerson: "Jane Smith",
      pendingItems: 3,
      nextDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "client-3",
      name: "Initech",
      contactPerson: "Michael Bolton",
      pendingItems: 7,
      nextDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
}
