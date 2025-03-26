"use client"

import * as React from "react"
import { useState } from "react"
import { Calendar, Plus, Trash2, Edit, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"

export interface CalendarEvent {
  id: string
  title: string
  startTime: string
  endTime: string
  category?: "meeting" | "presentation" | "workshop" | "other"
  color?: string
}

export interface UserCalendarProps {
  events?: CalendarEvent[]
  onAddEvent?: (event: Omit<CalendarEvent, "id">) => void
  onEditEvent?: (event: CalendarEvent) => void
  onDeleteEvent?: (id: string) => void
  googleCalendarUrl?: string
  className?: string
}

const getCategoryColor = (category?: string): string => {
  switch (category) {
    case "meeting":
      return "bg-blue-100 text-blue-600"
    case "presentation":
      return "bg-green-100 text-green-600"
    case "workshop":
      return "bg-purple-100 text-purple-600"
    default:
      return "bg-gray-100 text-gray-600"
  }
}

const getCategoryIcon = (category?: string) => {
  return <Calendar className="h-4 w-4" />
}

export function UserCalendar({
  events = [],
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  googleCalendarUrl = "https://calendar.google.com",
  className,
}: UserCalendarProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(null)
  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, "id">>({  
    title: "",
    startTime: "",
    endTime: "",
    category: "meeting"
  })

  const handleAddEvent = () => {
    if (onAddEvent) {
      // Ensure time format consistency by appending 'Uhr' if not present
      const formattedEvent = {
        ...newEvent,
        startTime: newEvent.startTime.includes(" Uhr") ? newEvent.startTime : `${newEvent.startTime} Uhr`,
        endTime: newEvent.endTime.includes(" Uhr") ? newEvent.endTime : `${newEvent.endTime} Uhr`
      }
      onAddEvent(formattedEvent)
      setNewEvent({
        title: "",
        startTime: "",
        endTime: "",
        category: "meeting"
      })
    }
    setIsAddDialogOpen(false)
  }

  const handleEditEvent = () => {
    if (onEditEvent && currentEvent) {
      // Ensure time format consistency by appending 'Uhr' if not present
      const formattedEvent = {
        ...currentEvent,
        startTime: currentEvent.startTime.includes(" Uhr") ? currentEvent.startTime : `${currentEvent.startTime} Uhr`,
        endTime: currentEvent.endTime.includes(" Uhr") ? currentEvent.endTime : `${currentEvent.endTime} Uhr`
      }
      onEditEvent(formattedEvent)
    }
    setIsEditDialogOpen(false)
    setCurrentEvent(null)
  }

  const handleDeleteEvent = (id: string) => {
    if (onDeleteEvent) {
      onDeleteEvent(id)
    }
  }

  const openEditDialog = (event: CalendarEvent) => {
    setCurrentEvent(event)
    setIsEditDialogOpen(true)
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Tagesübersicht</h3>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Termin hinzufügen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                  <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>In Google Calendar öffnen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Card>
        <CardContent className="p-3">
          {events.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">
              <p>Keine Termine für heute</p>
              <Button 
                variant="link" 
                className="mt-2 text-xs" 
                onClick={() => setIsAddDialogOpen(true)}
              >
                Termin hinzufügen
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-center gap-3 group">
                  <div className={`p-1.5 rounded-md ${getCategoryColor(event.category)}`}>
                    {getCategoryIcon(event.category)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.startTime} - {event.endTime}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => openEditDialog(event)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Bearbeiten</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Löschen</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Event Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Termin hinzufügen</DialogTitle>
            <DialogDescription>
              Fügen Sie einen neuen Termin zu Ihrem Kalender hinzu.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Titel
              </Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Startzeit
              </Label>
              <Input
                id="startTime"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                placeholder="10:00 Uhr"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                Endzeit
              </Label>
              <Input
                id="endTime"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                placeholder="11:30 Uhr"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Kategorie
              </Label>
              <select
                id="category"
                value={newEvent.category}
                onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as any })}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="meeting">Meeting</option>
                <option value="presentation">Präsentation</option>
                <option value="workshop">Workshop</option>
                <option value="other">Sonstiges</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddEvent}>Hinzufügen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Termin bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeiten Sie die Details des Termins.
            </DialogDescription>
          </DialogHeader>
          {currentEvent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Titel
                </Label>
                <Input
                  id="edit-title"
                  value={currentEvent.title}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-startTime" className="text-right">
                  Startzeit
                </Label>
                <Input
                  id="edit-startTime"
                  value={currentEvent.startTime}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, startTime: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-endTime" className="text-right">
                  Endzeit
                </Label>
                <Input
                  id="edit-endTime"
                  value={currentEvent.endTime}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, endTime: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">
                  Kategorie
                </Label>
                <select
                  id="edit-category"
                  value={currentEvent.category}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, category: e.target.value as any })}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="meeting">Meeting</option>
                  <option value="presentation">Präsentation</option>
                  <option value="workshop">Workshop</option>
                  <option value="other">Sonstiges</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleEditEvent}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}