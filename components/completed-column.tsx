"use client"

import { CheckCircle } from "lucide-react"
import type { Process } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateToLocale } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface CompletedColumnProps {
  processes: Process[]
  isLoading?: boolean
  onProcessClick: (process: Process) => void
}

export function CompletedColumn({ processes, isLoading = false, onProcessClick }: CompletedColumnProps) {
  return (
    <div className="flex flex-col h-full bg-green-50 rounded-lg border border-green-200 shadow-sm">
      <div className="p-4 sticky top-0 bg-green-50 rounded-t-lg border-b border-green-200 z-10">
        <h2 className="font-semibold text-gray-800 flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          Abgeschlossen
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
              <CardContent className="pb-4 space-y-3">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))
        ) : processes.length > 0 ? (
          processes.map((process) => (
            <Card
              key={process.id}
              className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onProcessClick(process)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{process.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4 space-y-3">
                <div className="flex items-center text-green-600 gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {process.totalItems}/{process.totalItems} erfolgreich
                  </span>
                </div>

                <div className="text-sm text-gray-500">
                  Abgeschlossen am{" "}
                  {process.completionDate ? formatDateToLocale(new Date(process.completionDate)) : "N/A"}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 bg-white rounded-lg border border-dashed border-green-200 p-6">
            <p className="text-sm">Keine abgeschlossenen Prozesse</p>
          </div>
        )}
      </div>
    </div>
  )
}
