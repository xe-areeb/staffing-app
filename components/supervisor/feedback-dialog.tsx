'use client'

import { useState } from 'react'
import { Assignment, Staff, Event } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AssignmentWithRelations extends Assignment {
  staff: Staff
  event: Event
}

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignment: AssignmentWithRelations
}

export function FeedbackDialog({
  open,
  onOpenChange,
  assignment,
}: FeedbackDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    quality: '',
    punctuality: '',
    communication: '',
    teamwork: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/supervisor/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: assignment.id,
          staffId: assignment.staffId,
          supervisorId: assignment.supervisorId,
          eventId: assignment.eventId,
          data: formData,
        }),
      })

      if (response.ok) {
        onOpenChange(false)
        setFormData({
          quality: '',
          punctuality: '',
          communication: '',
          teamwork: '',
          notes: '',
        })
        window.location.reload()
      } else {
        alert('Failed to submit feedback')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const ratingOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'satisfactory', label: 'Satisfactory' },
    { value: 'needs-improvement', label: 'Needs Improvement' },
    { value: 'poor', label: 'Poor' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription>
            Provide feedback for {assignment.staff.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quality">Work Quality</Label>
            <Select
              value={formData.quality}
              onValueChange={(value) =>
                setFormData({ ...formData, quality: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {ratingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="punctuality">Punctuality</Label>
            <Select
              value={formData.punctuality}
              onValueChange={(value) =>
                setFormData({ ...formData, punctuality: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {ratingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="communication">Communication</Label>
            <Select
              value={formData.communication}
              onValueChange={(value) =>
                setFormData({ ...formData, communication: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {ratingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamwork">Teamwork</Label>
            <Select
              value={formData.teamwork}
              onValueChange={(value) =>
                setFormData({ ...formData, teamwork: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {ratingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Input
              id="notes"
              placeholder="Any additional comments..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

