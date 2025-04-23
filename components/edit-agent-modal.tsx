"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDate } from "@/lib/utils"

interface EditAgentModalProps {
  isOpen: boolean
  onClose: () => void
  agentId: string
  agentTitle: string
  onSave: (data: any) => void
}

export function EditAgentModal({ isOpen, onClose, agentId, agentTitle, onSave }: EditAgentModalProps) {
  const [mandantId, setMandantId] = useState("")
  const [deadline, setDeadline] = useState(formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)))

  const handleSave = () => {
    onSave({
      mandantId,
      deadline: new Date(deadline).toISOString(),
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Prozess bearbeiten: {agentTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="mandant-id">Mandanten-ID</Label>
            <Input
              id="mandant-id"
              value={mandantId}
              onChange={(e) => setMandantId(e.target.value)}
              placeholder="Mandanten-ID eingeben"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <div className="relative">
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="pl-8"
              />
              <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={handleSave}>Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
