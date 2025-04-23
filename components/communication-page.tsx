"use client"

import { useState } from "react"
import { Search, Filter, MessageSquare, User, Bot } from "lucide-react"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { initialProcesses } from "@/lib/data"
import { formatDateToLocale } from "@/lib/utils"
import { cn } from "@/lib/utils"

export default function CommunicationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProcess, setSelectedProcess] = useState(initialProcesses[1])
  const [filter, setFilter] = useState("all")

  // Alle Prozesse mit Nachrichten
  const processesWithMessages = initialProcesses.filter((process) => process.messages && process.messages.length > 0)

  // Gefilterte Prozesse basierend auf Suchbegriff und Filter
  const filteredProcesses = processesWithMessages.filter((process) => {
    const matchesSearch = process.name.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === "all") return matchesSearch
    if (filter === "active") return matchesSearch && process.status === "in-progress"
    if (filter === "completed") return matchesSearch && process.status === "completed"

    return matchesSearch
  })

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Kommunikationsverlauf</h1>
            <p className="text-gray-500">Übersicht aller Kommunikationen mit Teilnehmern</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Suche nach Prozessen..."
                className="pl-9 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[130px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="completed">Abgeschlossen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prozessliste */}
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-180px)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Prozesse</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-auto h-[calc(100vh-240px)]">
                  {filteredProcesses.length > 0 ? (
                    filteredProcesses.map((process) => (
                      <div
                        key={process.id}
                        className={cn(
                          "p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors",
                          selectedProcess?.id === process.id && "bg-blue-50 hover:bg-blue-50",
                        )}
                        onClick={() => setSelectedProcess(process)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium">{process.name}</h3>
                          <Badge
                            variant="outline"
                            className={cn(
                              process.status === "in-progress"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : process.status === "completed"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200",
                            )}
                          >
                            {process.status === "in-progress"
                              ? "Aktiv"
                              : process.status === "completed"
                                ? "Abgeschlossen"
                                : "Nicht gestartet"}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mb-1">{process.messages.length} Nachrichten</div>
                        <div className="text-xs text-gray-400">
                          Letzte Aktivität:{" "}
                          {process.messages.length > 0
                            ? formatDateToLocale(new Date(process.messages[process.messages.length - 1].timestamp))
                            : "Keine Aktivität"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      Keine Prozesse mit Kommunikationsverlauf gefunden
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kommunikationsverlauf */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-180px)] flex flex-col">
              <CardHeader className="pb-2 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{selectedProcess?.name || "Kommunikationsverlauf"}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {selectedProcess?.progress || 0}/{selectedProcess?.totalItems || 0} erledigt
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-0">
                {selectedProcess ? (
                  <div className="p-4 space-y-4">
                    {selectedProcess.messages.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex max-w-[80%] rounded-lg p-3",
                          message.sender === "system"
                            ? "bg-blue-50 text-blue-800 self-start rounded-bl-none ml-0 mr-auto"
                            : "bg-gray-100 text-gray-800 self-end rounded-br-none ml-auto mr-0",
                        )}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {message.sender === "system" ? (
                              <div className="bg-blue-100 p-1.5 rounded-full">
                                <Bot className="h-4 w-4 text-blue-600" />
                              </div>
                            ) : (
                              <div className="bg-gray-200 p-1.5 rounded-full">
                                <User className="h-4 w-4 text-gray-600" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-medium mb-1">
                              {message.sender === "system" ? "System" : "Teilnehmer"}
                            </div>
                            <div className="text-sm">{message.content}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDateToLocale(new Date(message.timestamp))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Wähle einen Prozess aus, um den Kommunikationsverlauf anzuzeigen
                  </div>
                )}
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input placeholder="Nachricht eingeben..." disabled />
                  <Button size="icon">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Hinweis: Die Kommunikation ist nur zur Ansicht verfügbar
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
