"use client"

import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompaniesTable } from "@/components/ui/companies-table"
import { ContactsTable } from "@/components/ui/contacts-table"
import { UserCalendar } from "@/components/ui/user-calendar"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
const response = await fetch('/api/user', { cache: 'force-cache' })
        const data = await response.json()
        setUserData(data)
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {userData?.firstName || 'User'}</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <h3 className="font-semibold">Total Companies</h3>
              <p className="text-2xl">{userData?.stats?.companies || 0}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold">Total Contacts</h3>
              <p className="text-2xl">{userData?.stats?.contacts || 0}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold">Active Deals</h3>
              <p className="text-2xl">{userData?.stats?.activeDeals || 0}</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold">Upcoming Meetings</h3>
              <p className="text-2xl">{userData?.stats?.upcomingMeetings || 0}</p>
            </Card>
          </div>
        </TabsContent>

<TabsContent value="companies">
  <CompaniesTable companies={userData.stats.companies} />
</TabsContent>

<TabsContent value="contacts">
  <ContactsTable contacts={userData.stats.contacts} />
</TabsContent>

        <TabsContent value="calendar">
          <UserCalendar />
        </TabsContent>
      </Tabs>
    </div>
  )
}
