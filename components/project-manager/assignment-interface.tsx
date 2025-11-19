'use client'

import { useState } from 'react'
import { Staff, User, Assignment } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface AssignmentWithRelations extends Assignment {
  staff: Staff
  supervisor: User
}

interface AssignmentInterfaceProps {
  eventId: string
  staff: Staff[]
  supervisors: User[]
  existingAssignments: AssignmentWithRelations[]
}

export function AssignmentInterface({
  eventId,
  staff,
  supervisors,
  existingAssignments,
}: AssignmentInterfaceProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStaffId, setSelectedStaffId] = useState('')
  const [selectedSupervisorId, setSelectedSupervisorId] = useState('')
  const [loading, setLoading] = useState(false)

  const filteredStaff = staff.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAssign = async () => {
    if (!selectedStaffId || !selectedSupervisorId) return

    setLoading(true)
    try {
      const response = await fetch('/api/project-manager/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          staffId: selectedStaffId,
          supervisorId: selectedSupervisorId,
        }),
      })

      if (response.ok) {
        setSelectedStaffId('')
        setSelectedSupervisorId('')
        window.location.reload()
      } else {
        alert('Failed to create assignment')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assign Staff to Supervisor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Search Staff</Label>
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Select Staff</Label>
            <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a staff member" />
              </SelectTrigger>
              <SelectContent>
                {filteredStaff.slice(0, 50).map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} {s.email && `(${s.email})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Assign to Supervisor</Label>
            <Select
              value={selectedSupervisorId}
              onValueChange={setSelectedSupervisorId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a supervisor" />
              </SelectTrigger>
              <SelectContent>
                {supervisors.map((supervisor) => (
                  <SelectItem key={supervisor.id} value={supervisor.id}>
                    {supervisor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleAssign}
            disabled={!selectedStaffId || !selectedSupervisorId || loading}
            className="w-full"
          >
            {loading ? 'Assigning...' : 'Create Assignment'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff</TableHead>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {existingAssignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      No assignments yet
                    </TableCell>
                  </TableRow>
                ) : (
                  existingAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        {assignment.staff.name}
                      </TableCell>
                      <TableCell>{assignment.supervisor.name}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            if (
                              !confirm(
                                'Are you sure you want to remove this assignment?'
                              )
                            )
                              return

                            try {
                              const response = await fetch(
                                `/api/project-manager/assignments/${assignment.id}`,
                                { method: 'DELETE' }
                              )
                              if (response.ok) {
                                window.location.reload()
                              }
                            } catch (error) {
                              alert('Failed to remove assignment')
                            }
                          }}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

