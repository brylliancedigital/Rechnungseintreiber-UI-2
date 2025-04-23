import { Activity, Clock, CheckCircle, MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardsProps {
  metrics: {
    active: number
    notStarted: number
    completed: number
    newInteractions: number
  }
}

export function StatCards({ metrics }: StatCardsProps) {
  const stats = [
    {
      title: "Aktive Prozesse",
      value: metrics.active,
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Nicht gestartet",
      value: metrics.notStarted,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      title: "Abgeschlossen",
      value: metrics.completed,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Neue Interaktionen heute",
      value: metrics.newInteractions,
      icon: MessageCircle,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
            <div className={`${stat.bgColor} p-2 rounded-full`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
