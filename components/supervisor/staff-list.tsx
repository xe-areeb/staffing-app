'use client'

import { Assignment, Staff, Event, Feedback } from '@prisma/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { FeedbackDialog } from './feedback-dialog'

interface AssignmentWithRelations extends Assignment {
  staff: Staff
  event: Event
  feedback: Feedback[]
}

interface SupervisorStaffListProps {
  assignments: AssignmentWithRelations[]
}

export function SupervisorStaffList({ assignments }: SupervisorStaffListProps) {
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentWithRelations | null>(null)
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  const handleSubmitFeedback = (assignment: AssignmentWithRelations) => {
    setSelectedAssignment(assignment)
    setFeedbackOpen(true)
  }

  if (assignments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">
            No staff assigned yet. Contact a project manager to be assigned staff.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((assignment) => {
          const latestFeedback = assignment.feedback[0]
          return (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{assignment.staff.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {assignment.event.name}
                    </CardDescription>
                  </div>
                  {latestFeedback && (
                    <Badge variant="outline" className="text-xs">
                      Feedback submitted
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600 space-y-1">
                  {assignment.staff.email && (
                    <p>Email: {assignment.staff.email}</p>
                  )}
                  {assignment.staff.phone && (
                    <p>Phone: {assignment.staff.phone}</p>
                  )}
                </div>
                {latestFeedback && (
                  <div className="text-xs text-gray-500">
                    Last feedback: {new Date(latestFeedback.submittedAt).toLocaleString()}
                  </div>
                )}
                <Button
                  className="w-full"
                  onClick={() => handleSubmitFeedback(assignment)}
                >
                  {latestFeedback ? 'Submit New Feedback' : 'Submit Feedback'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedAssignment && (
        <FeedbackDialog
          open={feedbackOpen}
          onOpenChange={setFeedbackOpen}
          assignment={selectedAssignment}
        />
      )}
    </>
  )
}

