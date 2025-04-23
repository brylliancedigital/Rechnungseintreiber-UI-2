"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDateToLocale } from "@/lib/utils"
import { fetchPrioritizedClients } from "@/services/api"
import { useToast } from "@/components/ui/use-toast"

interface PrioritizedClientsProps {
  className?: string
}

export function PrioritizedClients({ className }: PrioritizedClientsProps) {
  const [clients, setClients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await fetchPrioritizedClients()
        setClients(data)
      } catch (error) {
        toast({
          title: "Fehler beim Laden der Kunden",
          description: "Die priorisierten Kunden konnten nicht geladen werden.",
          variant: "destructive",
        })
        console.error("Failed to load prioritized clients:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadClients()
  }, [toast])

  return (
    <Card className={cn("border-none shadow-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Priorisierte Kunden
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-16">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : clients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((client) => (
              <div
                key={client.id}
                className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{client.name}</h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      client.pendingItems > 5
                        ? "bg-red-50 text-red-700 border-red-200"
                        : client.pendingItems > 2
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-blue-50 text-blue-700 border-blue-200",
                    )}
                  >
                    {client.pendingItems} ausstehend
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <User className="h-3.5 w-3.5 mr-1" />
                  {client.contactPerson}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  Nächste Deadline: {formatDateToLocale(new Date(client.nextDeadline)).split(",")[0]}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">Keine priorisierten Kunden gefunden</div>
        )}
      </CardContent>
    </Card>
  )
}
