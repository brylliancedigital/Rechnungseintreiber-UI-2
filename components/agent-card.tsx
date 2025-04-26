
"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Trash2,
  Save,
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FileUpload } from "@/components/file-upload";
import { EditableTable } from "@/components/editable-table";
import { EditAgentModal } from "@/components/edit-agent-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDateToLocale } from "@/lib/utils";

export interface InvoiceData {
  id?: string;
  mandant_phone: string;
  invoice_number: string;
  amount: number;
  isNew?: boolean;
  isEditing?: boolean;
}

export interface AgentCardProps {
  id: string;
  title: string;
  status: "not-started" | "in-progress" | "completed";
  progress: number;
  totalItems: number;
  paused?: boolean;
  invoiceData?: InvoiceData[];
  onEdit?: (id: string, data: any) => void;
  onDelete?: (id: string) => void;
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  onComplete?: (id: string) => void;
  onStart?: (id: string, data: InvoiceData[]) => void;
  onSaveInvoiceData?: (id: string, data: InvoiceData[]) => void;
  onUpdateProgress?: (id: string, progress: number, total: number) => void;
}

export function AgentCard({
  id,
  title,
  status,
  progress,
  totalItems,
  paused = false,
  invoiceData = [],
  onEdit,
  onDelete,
  onPause,
  onResume,
  onComplete,
  onStart,
  onSaveInvoiceData,
  onUpdateProgress,
}: AgentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentInvoiceData, setCurrentInvoiceData] = useState<InvoiceData[]>(invoiceData);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const currentTotalItems = currentInvoiceData.length || totalItems;
  const progressPercent = currentTotalItems > 0 ? Math.round((progress / currentTotalItems) * 100) : 0;

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setCurrentInvoiceData(invoiceData);
  }, [invoiceData]);

  const prevInvoiceDataLengthRef = useRef(currentInvoiceData.length);

  useEffect(() => {
    if (
      onUpdateProgress &&
      currentInvoiceData.length !== prevInvoiceDataLengthRef.current &&
      currentInvoiceData.length !== totalItems
    ) {
      onUpdateProgress(id, progress, currentInvoiceData.length);
      prevInvoiceDataLengthRef.current = currentInvoiceData.length;
    }
  }, [currentInvoiceData.length, id, onUpdateProgress, progress, totalItems]);

  const handleTitleClick = () => {
    if (status !== "completed") {
      setIsEditing(true);
    }
  };

  const handleTitleSave = () => {
    setIsEditing(false);
    if (onEdit && editedTitle !== title) {
      onEdit(id, { title: editedTitle });
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave();
    } else if (e.key === "Escape") {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  const handleFileUploaded = (data: InvoiceData[]) => {
    setCurrentInvoiceData(data);
  };

  const handleInvoiceDataChange = (data: InvoiceData[]) => {
    setCurrentInvoiceData(data);
  };

  const handleSaveInvoiceData = () => {
    if (onSaveInvoiceData) {
      onSaveInvoiceData(id, currentInvoiceData);
    }
  };

  const handleStartProcess = () => {
    if (onStart) {
      onStart(id, currentInvoiceData);
    }
  };

  const renderStatusBadge = () => {
    if (status === "completed") {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-0.5">
          <CheckCircle className="h-3 w-3 mr-1" />
          Abgeschlossen
        </Badge>
      );
    } else if (status === "not-started") {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs px-2 py-0.5">
          <Clock className="h-3 w-3 mr-1" />
          Nicht gestartet
        </Badge>
      );
    } else if (paused) {
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs px-2 py-0.5">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Pausiert
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-0.5">
          <Play className="h-3 w-3 mr-1" />
          Aktiv
        </Badge>
      );
    }
  };

  const getCardStyle = () => {
    if (status === "completed") return "border-l-4 border-l-green-500";
    if (status === "in-progress") {
      if (paused) return "border-l-4 border-l-orange-500";
      return "border-l-4 border-l-blue-500";
    }
    return "border-l-4 border-l-amber-500";
  };

  return (
    <Card
      className={cn(
        "bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden",
        getCardStyle(),
        paused && status === "in-progress" && "opacity-90",
      )}
    >
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex justify-between items-center">
          {isEditing ? (
            <div className="flex items-center space-x-2 w-full">
              <Input
                ref={titleInputRef}
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                className="h-8 font-medium"
              />
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleTitleSave}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1 min-w-0 group">
              <CardTitle
                className={cn(
                  "text-base font-medium truncate",
                  status !== "completed" && "cursor-pointer group-hover:text-blue-600",
                )}
                onClick={handleTitleClick}
              >
                {editedTitle}
              </CardTitle>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 rounded-full flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
          <div className="flex-shrink-0">{renderStatusBadge()}</div>
        </div>
      </CardHeader>

      <CardContent className="pb-2 px-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-1.5 flex-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">
                {progress}/{currentTotalItems} {status === "not-started" ? "Rechnungen" : "erledigt"}
              </span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <Progress
              value={progressPercent}
              className="h-1.5 rounded-full"
              indicatorClassName={cn(
                status === "completed"
                  ? "bg-green-600"
                  : status === "in-progress"
                    ? paused
                      ? "bg-orange-500"
                      : "bg-blue-600"
                    : "bg-amber-500",
              )}
            />
          </div>
        </div>

        {/* Upload- oder Rechnungsdaten */}
        {status === "not-started" && (
          <div className="space-y-3">
            <FileUpload onFileUploaded={handleFileUploaded} processId={id} onStartProcess={handleStartProcess} />
            {currentInvoiceData.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsInvoiceModalOpen(true)}
                className="w-full justify-between text-xs py-1 border border-gray-100 hover:bg-gray-50"
              >
                <span>Rechnungsdaten ({currentInvoiceData.length})</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}

        {status !== "not-started" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsInvoiceModalOpen(true)}
            className="w-full justify-between text-xs py-1 border border-gray-100 hover:bg-gray-50"
          >
            <span>Rechnungsdaten ({currentInvoiceData.length})</span>
            <ChevronRight className="h-3 w-3" />
          </Button>
        )}

        <Dialog open={isInvoiceModalOpen} onOpenChange={setIsInvoiceModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Rechnungsdaten: {title}</DialogTitle>
            </DialogHeader>
            <EditableTable
              data={currentInvoiceData}
              onDataChange={handleInvoiceDataChange}
              onSave={handleSaveInvoiceData}
            />
          </DialogContent>
        </Dialog>
      </CardContent>

      <CardFooter className="pt-2 px-4 pb-3">
        {status === "not-started" && currentInvoiceData.length > 0 && (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
            onClick={handleStartProcess}
          >
            Speichern & Starten
          </Button>
        )}

        {status === "in-progress" && (
          <div className="flex flex-wrap gap-2 w-full">
            {paused ? (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                onClick={() => onResume?.(id)}
              >
                <Play className="h-4 w-4 mr-1" />
                Fortsetzen
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                onClick={() => onPause?.(id)}
              >
                <Pause className="h-4 w-4 mr-1" />
                Pausieren
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={() => onDelete?.(id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Löschen
            </Button>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
              onClick={() => onComplete?.(id)}
            >
              Abschließen
            </Button>
          </div>
        )}
      </CardFooter>

      <EditAgentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        agentId={id}
        agentTitle={title}
        onSave={(data) => {
          setIsEditModalOpen(false);
          onEdit?.(id, data);
        }}
      />
    </Card>
  );
}
