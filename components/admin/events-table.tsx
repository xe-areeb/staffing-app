'use client'

import { Event, User, UserRole } from '@prisma/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface EventWithRelations extends Event {
  createdBy: User
  eventUsers: Array<{
    id: string
    role: UserRole
    user: User
  }>
}

interface EventsTableProps {
  events: EventWithRelations[]
  allUsers: User[]
}

export function EventsTable({ events, allUsers }: EventsTableProps) {
  const [assigningEventId, setAssigningEventId] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.SUPERVISOR)

  const handleAssignUser = async (eventId: string) => {
    if (!selectedUserId) return

    try {
      const response = await fetch('/api/admin/events/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          userId: selectedUserId,
          role: selectedRole,
        }),
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert('Failed to assign user')
      }
    } catch (error) {
      alert('An error occurred')
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Assigned Users</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.name}</TableCell>
              <TableCell>
                {event.date
                  ? new Date(event.date).toLocaleDateString()
                  : 'Not set'}
              </TableCell>
              <TableCell>{event.location || 'Not set'}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {event.eventUsers.map((eu) => (
                    <Badge key={eu.id} variant="outline">
                      {eu.user.name} ({eu.role})
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAssigningEventId(event.id)}
                    >
                      Assign User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign User to Event</DialogTitle>
                      <DialogDescription>
                        Assign a user to this event with a specific role.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>User</Label>
                        <Select
                          value={selectedUserId}
                          onValueChange={setSelectedUserId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a user" />
                          </SelectTrigger>
                          <SelectContent>
                            {allUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name} ({user.role})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Role for this Event</Label>
                        <Select
                          value={selectedRole}
                          onValueChange={(value) =>
                            setSelectedRole(value as UserRole)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={UserRole.PROJECT_MANAGER}>
                              Project Manager
                            </SelectItem>
                            <SelectItem value={UserRole.SUPERVISOR}>
                              Supervisor
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() => handleAssignUser(event.id)}
                        className="w-full"
                        disabled={!selectedUserId}
                      >
                        Assign
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

