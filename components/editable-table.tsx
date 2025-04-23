"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Save, RotateCcw, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InvoiceData {
  id?: string
  mandant_phone: string
  invoice_number: string
  amount: number
  isNew?: boolean
  isEditing?: boolean
}

interface EditableTableProps {
  data: InvoiceData[]
  onDataChange: (data: InvoiceData[]) => void
  onSave?: () => void
  isCollapsible?: boolean
  isReadOnly?: boolean
}

export function EditableTable({
  data,
  onDataChange,
  onSave,
  isCollapsible = false,
  isReadOnly = false,
}: EditableTableProps) {
  const [tableData, setTableData] = useState<InvoiceData[]>([])
  const [isCollapsed, setIsCollapsed] = useState(isCollapsible)
  const [originalData, setOriginalData] = useState<InvoiceData[]>([])
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Generate unique IDs for each row if they don't have one
    const dataWithIds = data.map((item) => ({
      ...item,
      id: item.id || `row-${Math.random().toString(36).substr(2, 9)}`,
    }))
    setTableData(dataWithIds)
    setOriginalData(JSON.parse(JSON.stringify(dataWithIds)))
  }, [data])

  const handleCellChange = (id: string, field: keyof InvoiceData, value: string | number) => {
    const updatedData = tableData.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: value }
      }
      return row
    })

    setTableData(updatedData)
    setHasChanges(true)
    onDataChange(updatedData)
  }

  const handleAddRow = () => {
    const newRow: InvoiceData = {
      id: `row-${Math.random().toString(36).substr(2, 9)}`,
      mandant_phone: "",
      invoice_number: "",
      amount: 0,
      isNew: true,
      isEditing: true,
    }

    setTableData([...tableData, newRow])
    setHasChanges(true)
  }

  const handleDeleteRow = (id: string) => {
    const updatedData = tableData.filter((row) => row.id !== id)
    setTableData(updatedData)
    setHasChanges(true)
    onDataChange(updatedData)
  }

  const handleSaveChanges = () => {
    // In a real application, you would send the changes to the server here
    setOriginalData(JSON.parse(JSON.stringify(tableData)))
    setHasChanges(false)
    if (onSave) onSave()
  }

  const handleDiscardChanges = () => {
    setTableData(JSON.parse(JSON.stringify(originalData)))
    setHasChanges(false)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  if (isCollapsible && isCollapsed) {
    return (
      <div className="w-full">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapse}
          className="w-full justify-start text-gray-500 hover:text-gray-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Rechnungsdaten anzeigen ({tableData.length})
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full space-y-3">
      {isCollapsible && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapse}
          className="w-full justify-start text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4 mr-2" />
          Rechnungsdaten ausblenden
        </Button>
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[33%]">Telefonnummer</TableHead>
              <TableHead className="w-[33%]">Rechnungsnummer</TableHead>
              <TableHead className="w-[25%]">Betrag (€)</TableHead>
              {!isReadOnly && <TableHead className="w-[9%]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {isReadOnly ? (
                    row.mandant_phone
                  ) : (
                    <Input
                      value={row.mandant_phone}
                      onChange={(e) => handleCellChange(row.id!, "mandant_phone", e.target.value)}
                      className="h-7 text-xs"
                      placeholder="+49123456789"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {isReadOnly ? (
                    row.invoice_number
                  ) : (
                    <Input
                      value={row.invoice_number}
                      onChange={(e) => handleCellChange(row.id!, "invoice_number", e.target.value)}
                      className="h-7 text-xs"
                      placeholder="INV-2023-001"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {isReadOnly ? (
                    `${row.amount.toFixed(2)} €`
                  ) : (
                    <Input
                      type="number"
                      value={row.amount}
                      onChange={(e) => handleCellChange(row.id!, "amount", Number.parseFloat(e.target.value) || 0)}
                      className="h-7 text-xs"
                      step="0.01"
                      min="0"
                    />
                  )}
                </TableCell>
                {!isReadOnly && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRow(row.id!)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {tableData.length === 0 && (
              <TableRow>
                <TableCell colSpan={isReadOnly ? 3 : 4} className="text-center py-4 text-gray-500">
                  Keine Rechnungsdaten vorhanden
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isReadOnly && (
        <div className="flex flex-wrap justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddRow}
            className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            Neue Zeile
          </Button>

          <div className="flex flex-wrap gap-2">
            {hasChanges && (
              <Button variant="outline" size="sm" className="h-8" onClick={handleDiscardChanges}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Verwerfen
              </Button>
            )}

            <Button
              size="sm"
              onClick={handleSaveChanges}
              disabled={!hasChanges}
              className={cn("h-8", hasChanges ? "bg-green-600 hover:bg-green-700" : "bg-gray-400")}
            >
              <Save className="h-4 w-4 mr-1" />
              Speichern
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
