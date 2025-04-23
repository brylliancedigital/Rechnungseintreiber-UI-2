"use client"

import { X, User, Bot } from "lucide-react"
import type { Process, Message } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { formatDateToLocale } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface CommunicationDrawerProps {
  process: Process | null
  open: boolean
  onClose: () => void
}

export function CommunicationDrawer({ process, open, onClose }: CommunicationDrawerProps) {
  if (!process) return null

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Kommunikationsverlauf: {process.name}</SheetTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <div className="mt-6 space-y-4 overflow-y-auto max-h-[calc(100vh-120px)]">
          {process.messages && process.messages.length > 0 ? (
            process.messages.map((message, index) => <MessageBubble key={index} message={message} />)
          ) : (
            <div className="text-center py-8 text-gray-500">Keine Kommunikation für diesen Prozess</div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isSystem = message.sender === "system"

  return (
    <div
      className={cn(
        "flex max-w-[80%] rounded-lg p-3",
        isSystem
          ? "bg-blue-50 text-blue-800 self-start rounded-bl-none ml-0 mr-auto"
          : "bg-gray-100 text-gray-800 self-end rounded-br-none ml-auto mr-0",
      )}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          {isSystem ? (
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
          <div className="text-xs font-medium mb-1">{isSystem ? "System" : "Teilnehmer"}</div>
          <div className="text-sm">{message.content}</div>
          <div className="text-xs text-gray-500 mt-1">{formatDateToLocale(new Date(message.timestamp))}</div>
        </div>
      </div>
    </div>
  )
}
