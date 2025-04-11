"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"

export function UserCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events] = useState([
    {
      id: 1,
      title: "Meeting with DCI Media AG",
      date: "2025-04-15",
      time: "10:00",
      type: "meeting"
    },
    {
      id: 2,
      title: "Project Review",
      date: "2025-04-16",
      time: "14:30",
      type: "internal"
    },
    // Add more events as needed
  ])

  const todaysEvents = events.filter(event => 
    new Date(event.date).toDateString() === date?.toDateString()
  )

  return (
    <div className="flex gap-6">
      <Card className="p-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </Card>
      
      <Card className="p-4 flex-1">
        <h3 className="font-semibold mb-4">
          Events for {date?.toLocaleDateString()}
        </h3>
        <div className="space-y-4">
          {todaysEvents.length > 0 ? (
            todaysEvents.map(event => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted"
              >
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {event.time}
                  </p>
                </div>
                <span className="text-sm px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {event.type}
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No events scheduled for this day</p>
          )}
        </div>
      </Card>
    </div>
  )
}