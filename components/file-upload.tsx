"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, X, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileUploaded: (data: any[]) => void
  processId: string
}

export function FileUpload({ onFileUploaded, processId }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const allowedFileTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ]
  const allowedExtensions = [".csv", ".xls", ".xlsx"]

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const validateFile = (file: File): boolean => {
    if (!allowedFileTypes.includes(file.type)) {
      const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
      if (!allowedExtensions.includes(extension)) {
        setError(`Ungültiger Dateityp. Erlaubt sind nur: ${allowedExtensions.join(", ")}`)
        return false
      }
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Die Datei ist zu groß. Maximale Größe: 5MB")
      return false
    }
    return true
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setError(null)
    setSuccess(null)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (validateFile(droppedFile)) {
        setFile(droppedFile)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setSuccess(null)

    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (validateFile(selectedFile)) {
        setFile(selectedFile)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("processId", processId)

    try {
      const response = await fetch("https://rechnungseintreiber.onrender.com/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload fehlgeschlagen.")
      }

      const result = await response.json()
      console.log("✅ Backend-Response:", result)

      setUploadProgress(100)
      setSuccess(`Datei erfolgreich hochgeladen. ${result.rows_uploaded} Rechnungen importiert.`)
      onFileUploaded(result.supabase_response)

      setTimeout(() => {
        setFile(null)
        setIsUploading(false)
      }, 2000)
    } catch (error) {
      console.error("Upload error:", error)
      setError("Fehler beim Hochladen der Datei. Bitte versuchen Sie es erneut.")
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setFile(null)
    setError(null)
    setSuccess(null)
  }

  return (
    <div className="w-full space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Erfolg</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-2 h-16 text-sm text-center cursor-pointer transition-colors",
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          file ? "bg-gray-50" : "",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv,.xls,.xlsx"
          className="hidden"
          disabled={isUploading}
        />
        <div className="flex flex-col items-center justify-center space-y-0.5">
          {file ? (
            <>
              <FileText className="h-5 w-5 text-blue-500" />
              <div className="text-xs font-medium">{file.name}</div>
              <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</div>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 text-gray-400" />
              <div className="text-xs">CSV oder Excel-Datei hierher ziehen oder klicken</div>
            </>
          )}
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Hochladen...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {file && !isUploading && !success && (
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleCancel} disabled={isUploading}>
            <X className="h-4 w-4 mr-1" />
            Abbrechen
          </Button>
          <Button size="sm" onClick={handleUpload} disabled={isUploading}>
            <Upload className="h-4 w-4 mr-1" />
            Hochladen
          </Button>
        </div>
      )}
    </div>
  )
}
