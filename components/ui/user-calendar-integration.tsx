"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { UserCalendar, CalendarEvent } from "@/components/ui/user-calendar"

export function UserCalendarIntegration() {
  // Sample initial events
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Strategie-Meeting",
      startTime: "10:00 Uhr",
      endTime: "11:30 Uhr",
      category: "meeting"
    },
    {
      id: "2",
      title: "Kundenpräsentation",
      startTime: "13:00 Uhr",
      endTime: "14:00 Uhr",
      category: "presentation"
    },
    {
      id: "3",
      title: "KI-Workshop",
      startTime: "15:30 Uhr",
      endTime: "17:00 Uhr",
      category: "workshop"
    }
  ])

  const handleAddEvent = (newEvent: Omit<CalendarEvent, "id">) => {
    const eventWithId = {
      ...newEvent,
      id: uuidv4()
    }
    setEvents([...events, eventWithId])
  }

  const handleEditEvent = (updatedEvent: CalendarEvent) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ))
  }

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id))
  }

  return (
    <UserCalendar
      events={events}
      onAddEvent={handleAddEvent}
      onEditEvent={handleEditEvent}
      onDeleteEvent={handleDeleteEvent}
      googleCalendarUrl="https://calendar.google.com"
    />
  )
}