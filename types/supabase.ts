// Diese Typen würden normalerweise von Supabase generiert werden
// Dies ist ein Beispiel, wie die Typen aussehen könnten

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      processes: {
        Row: {
          id: string
          name: string
          status: "not-started" | "in-progress" | "completed"
          totalItems: number
          progress: number
          paused: boolean
          createdAt: string
          startDate: string | null
          completionDate: string | null
          targetDate: string
          clientId: string | null
          userId: string | null
        }
        Insert: {
          id?: string
          name: string
          status?: "not-started" | "in-progress" | "completed"
          totalItems: number
          progress?: number
          paused?: boolean
          createdAt?: string
          startDate?: string | null
          completionDate?: string | null
          targetDate: string
          clientId?: string | null
          userId?: string | null
        }
        Update: {
          id?: string
          name?: string
          status?: "not-started" | "in-progress" | "completed"
          totalItems?: number
          progress?: number
          paused?: boolean
          createdAt?: string
          startDate?: string | null
          completionDate?: string | null
          targetDate?: string
          clientId?: string | null
          userId?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          processId: string
          sender: "system" | "participant"
          content: string
          timestamp: string
        }
        Insert: {
          id?: string
          processId: string
          sender: "system" | "participant"
          content: string
          timestamp?: string
        }
        Update: {
          id?: string
          processId?: string
          sender?: "system" | "participant"
          content?: string
          timestamp?: string
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          contactPerson: string
          email: string
          priority: number
        }
        Insert: {
          id?: string
          name: string
          contactPerson: string
          email: string
          priority?: number
        }
        Update: {
          id?: string
          name?: string
          contactPerson?: string
          email?: string
          priority?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
