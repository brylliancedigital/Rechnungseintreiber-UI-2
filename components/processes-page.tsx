"use client"

import { useState } from "react"
import { Search, Filter, Plus, ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { initialProcesses } from "@/lib/data"
import { formatDate, formatDateToLocale } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { Process } from "@/lib/types"

export default function ProcessesPage() {
  const [processes, setProcesses] = useState<Process[]>(initialProcesses)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [newProcessOpen, setNewProcessOpen] = useState(false)
  const [newProcess, setNewProcess] = useState({
    name: "",
    totalItems: 5,
    targetDate: formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  })

  // Gefilterte und sortierte Prozesse
  const filteredProcesses = processes
    .filter((process) => {
      const matchesSearch = process.name.toLowerCase().includes(searchTerm.toLowerCase())

      if (filter === "all") return matchesSearch
      if (filter === "not-started") return matchesSearch && process.status === "not-started"
      if (filter === "in-progress") return matchesSearch && process.status === "in-progress"
      if (filter === "completed") return matchesSearch && process.status === "completed"

      return matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "status") {
        return a.status.localeCompare(b.status)
      } else if (sortBy === "progress") {
        const progressA = (a.progress / a.totalItems) * 100
        const progressB = (b.progress / b.totalItems) * 100
        return progressB - progressA
      } else {
        // Sortieren nach Datum (Standard)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const handleCreateProcess = () => {
    const process: Process = {
      id: `process-${Date.now()}`,
      name: newProcess.name || "Neuer Prozess",
      status: "not-started",
      totalItems: newProcess.totalItems || 5,
      progress: 0,
      paused: false,
      messages: [],
      createdAt: new Date().toISOString(),
      targetDate: new Date(newProcess.targetDate).toISOString(),
    }

    setProcesses([...processes, process])
    setNewProcess({
      name: "",
      totalItems: 5,
      targetDate: formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    })
    setNewProcessOpen(false)
  }

  const handleStartProcess = (process: Process) => {
    const updatedProcesses = processes.map((p) => {
      if (p.id === process.id) {
        return { ...p, status: "in-progress", startDate: new Date().toISOString() }
      }
      return p
    })
    setProcesses(updatedProcesses)
  }

  const handlePauseProcess = (process: Process) => {
    const updatedProcesses = processes.map((p) => {
      if (p.id === process.id) {
        return { ...p, paused: !p.paused }
      }
      return p
    })
    setProcesses(updatedProcesses)
  }

  const handleDeleteProcess = (process: Process) => {
    const updatedProcesses = processes.filter((p) => p.id !== process.id)
    setProcesses(updatedProcesses)
  }

  const handleCompleteProcess = (process: Process) => {
    const updatedProcesses = processes.map((p) => {
      if (p.id === process.id) {
        return {
          ...p,
          status: "completed",
          completionDate: new Date().toISOString(),
          progress: p.totalItems,
        }
      }
      return p
    })
    setProcesses(updatedProcesses)
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Prozesse</h1>
            <p className="text-gray-500">Verwalte alle automatisierten Kommunikationsprozesse</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
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
                <SelectItem value="not-started">Nicht gestartet</SelectItem>
                <SelectItem value="in-progress">Laufend</SelectItem>
                <SelectItem value="completed">Abgeschlossen</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={newProcessOpen} onOpenChange={setNewProcessOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Neuer Prozess
                </Button>
              </DialogTrigger>
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
                    <Input
                      id="process-date"
                      type="date"
                      value={newProcess.targetDate}
                      onChange={(e) => setNewProcess({ ...newProcess, targetDate: e.target.value })}
                    />
                  </div>
                  <Button className="w-full" onClick={handleCreateProcess}>
                    Prozess erstellen
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="list">Listenansicht</TabsTrigger>
            <TabsTrigger value="kanban">Kanban-Ansicht</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <Card>
              <CardHeader className="pb-0">
                <div className="flex justify-between items-center">
                  <CardTitle>Alle Prozesse</CardTitle>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sortieren nach" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Datum</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="progress">Fortschritt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 bg-gray-50 p-3 text-sm font-medium text-gray-500">
                    <div className="col-span-4">Name</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Fortschritt</div>
                    <div className="col-span-2">Zieldatum</div>
                    <div className="col-span-2 text-right">Aktionen</div>
                  </div>
                  <div className="divide-y">
                    {filteredProcesses.length > 0 ? (
                      filteredProcesses.map((process) => {
                        const progressPercent = Math.round((process.progress / process.totalItems) * 100)

                        return (
                          <div key={process.id} className="grid grid-cols-12 items-center p-3">
                            <div className="col-span-4 font-medium">{process.name}</div>
                            <div className="col-span-2">
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
                            <div className="col-span-2">
                              <div className="flex items-center gap-2">
                                <Progress value={progressPercent} className="h-2 flex-1" />
                                <span className="text-xs text-gray-500 w-8">{progressPercent}%</span>
                              </div>
                            </div>
                            <div className="col-span-2 text-sm text-gray-500">
                              {formatDateToLocale(new Date(process.targetDate)).split(",")[0]}
                            </div>
                            <div className="col-span-2 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {process.status === "not-started" && (
                                    <DropdownMenuItem onClick={() => handleStartProcess(process)}>
                                      Starten
                                    </DropdownMenuItem>
                                  )}
                                  {process.status === "in-progress" && (
                                    <>
                                      <DropdownMenuItem onClick={() => handlePauseProcess(process)}>
                                        {process.paused ? "Fortsetzen" : "Pausieren"}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleCompleteProcess(process)}>
                                        Abschließen
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteProcess(process)}
                                    className="text-red-600"
                                  >
                                    Löschen
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="p-8 text-center text-gray-500">Keine Prozesse gefunden</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kanban">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Nicht gestartet */}
              <div className="flex flex-col h-full">
                <div className="bg-gray-50 p-4 rounded-t-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-gray-700">Nicht gestartet</h2>
                      <p className="text-sm text-gray-500">
                        {processes.filter((p) => p.status === "not-started").length} Prozesse
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-gray-50/50 p-4 space-y-4 overflow-auto max-h-[calc(100vh-300px)] rounded-b-lg border-x border-b border-gray-200">
                  {processes
                    .filter(
                      (p) => p.status === "not-started" && p.name.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((process) => (
                      <Card key={process.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium">{process.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2 space-y-3">
                          <div className="text-sm text-gray-500">{process.totalItems} Interaktionseinheiten</div>
                          <div className="text-sm text-gray-500">
                            Zieldatum: {formatDateToLocale(new Date(process.targetDate)).split(",")[0]}
                          </div>
                        </CardContent>
                        <div className="px-6 pb-4">
                          <Button className="w-full" onClick={() => handleStartProcess(process)}>
                            Starten
                          </Button>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Laufend */}
              <div className="flex flex-col h-full">
                <div className="bg-blue-50 p-4 rounded-t-lg border border-blue-200">
                  <h2 className="font-semibold text-blue-700">Laufend</h2>
                  <p className="text-sm text-blue-500">
                    {processes.filter((p) => p.status === "in-progress").length} Prozesse
                  </p>
                </div>

                <div className="flex-1 bg-blue-50/50 p-4 space-y-4 overflow-auto max-h-[calc(100vh-300px)] rounded-b-lg border-x border-b border-blue-200">
                  {processes
                    .filter(
                      (p) => p.status === "in-progress" && p.name.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((process) => {
                      const progressPercent = Math.round((process.progress / process.totalItems) * 100)

                      return (
                        <Card
                          key={process.id}
                          className={cn(
                            "bg-white shadow-sm hover:shadow-md transition-shadow",
                            process.paused && "opacity-75",
                          )}
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium">{process.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="pb-2 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">
                                {process.progress}/{process.totalItems} erledigt
                              </span>
                              <span className="text-sm font-medium">{progressPercent}%</span>
                            </div>

                            <Progress value={progressPercent} className="h-2" />

                            {process.paused && (
                              <div className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">Pausiert</div>
                            )}
                          </CardContent>
                          <div className="px-6 pb-4 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className={cn("flex-1", process.paused ? "text-green-600" : "text-amber-600")}
                              onClick={() => handlePauseProcess(process)}
                            >
                              {process.paused ? "Fortsetzen" : "Pausieren"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-blue-600"
                              onClick={() => handleCompleteProcess(process)}
                            >
                              Abschließen
                            </Button>
                          </div>
                        </Card>
                      )
                    })}
                </div>
              </div>

              {/* Abgeschlossen */}
              <div className="flex flex-col h-full">
                <div className="bg-green-50 p-4 rounded-t-lg border border-green-200">
                  <h2 className="font-semibold text-green-700">Abgeschlossen</h2>
                  <p className="text-sm text-green-500">
                    {processes.filter((p) => p.status === "completed").length} Prozesse
                  </p>
                </div>

                <div className="flex-1 bg-green-50/50 p-4 space-y-4 overflow-auto max-h-[calc(100vh-300px)] rounded-b-lg border-x border-b border-green-200">
                  {processes
                    .filter((p) => p.status === "completed" && p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((process) => (
                      <Card key={process.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium">{process.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4 space-y-3">
                          <div className="flex items-center text-green-600 gap-1.5">
                            <span className="text-sm font-medium">
                              {process.totalItems}/{process.totalItems} erfolgreich
                            </span>
                          </div>

                          <div className="text-sm text-gray-500">
                            Abgeschlossen am{" "}
                            {process.completionDate
                              ? formatDateToLocale(new Date(process.completionDate)).split(",")[0]
                              : "N/A"}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
