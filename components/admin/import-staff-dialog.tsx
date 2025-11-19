'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ImportStaffDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    spreadsheetId: '',
    range: 'A1:Z1000',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/staff/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Successfully imported ${data.count} staff members!`)
        setOpen(false)
        setFormData({ spreadsheetId: '', range: 'A1:Z1000' })
        window.location.reload()
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to import staff')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Import from Google Sheets</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Staff from Google Sheets</DialogTitle>
          <DialogDescription>
            Enter your Google Sheets ID and range to import staff data.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="spreadsheetId">Spreadsheet ID</Label>
            <Input
              id="spreadsheetId"
              placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              value={formData.spreadsheetId}
              onChange={(e) =>
                setFormData({ ...formData, spreadsheetId: e.target.value })
              }
              required
            />
            <p className="text-xs text-gray-500">
              Found in the Google Sheets URL: docs.google.com/spreadsheets/d/
              <strong>SPREADSHEET_ID</strong>/edit
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="range">Range</Label>
            <Input
              id="range"
              placeholder="A1:Z1000"
              value={formData.range}
              onChange={(e) =>
                setFormData({ ...formData, range: e.target.value })
              }
              required
            />
            <p className="text-xs text-gray-500">
              Sheet range to import (e.g., Sheet1!A1:Z1000)
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Importing...' : 'Import Staff'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

