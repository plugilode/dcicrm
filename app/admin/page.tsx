"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Users, Settings, HardDrive } from "lucide-react"
import { useRouter } from "next/navigation"

// Hidden link component that can be activated with a keyboard shortcut (Alt+A)
const HiddenAdminLink = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "a") {
        // Navigate to admin page
        window.location.href = "/admin";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null; // Hidden component renders nothing
};

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingRequests: 0,
    dbSize: "0 MB"
  })

  useEffect(() => {
    // Fetch admin dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch admin stats:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => { 
            if (window.confirm("Are you sure you want to exit admin mode?")) {
              router.push('/dashboard')
            }
          }}
        >
          Exit Admin Mode
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-800 border-slate-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </Card>
        
        <Card className="p-4 bg-slate-800 border-slate-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400">Active Users</p>
              <h3 className="text-2xl font-bold">{stats.activeUsers}</h3>
            </div>
            <Users className="h-8 w-8 text-green-400" />
          </div>
        </Card>
        
        <Card className="p-4 bg-slate-800 border-slate-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400">Pending Requests</p>
              <h3 className="text-2xl font-bold">{stats.pendingRequests}</h3>
            </div>
            <Users className="h-8 w-8 text-yellow-400" />
          </div>
        </Card>
        
        <Card className="p-4 bg-slate-800 border-slate-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400">Database Size</p>
              <h3 className="text-2xl font-bold">{stats.dbSize}</h3>
            </div>
            <Database className="h-8 w-8 text-purple-400" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6">
        <Tabs defaultValue="quickActions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quickActions">Quick Actions</TabsTrigger>
            <TabsTrigger value="recentActivity">Recent Activity</TabsTrigger>
            <TabsTrigger value="systemLogs">System Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quickActions" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="h-24 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/admin/users')}
              >
                <Users className="h-8 w-8" />
                <span>Manage Users</span>
              </Button>
              
              <Button 
                className="h-24 bg-purple-600 hover:bg-purple-700 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/admin/database')}
              >
                <Database className="h-8 w-8" />
                <span>Database Management</span>
              </Button>
              
              <Button 
                className="h-24 bg-slate-600 hover:bg-slate-700 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/admin/settings')}
              >
                <Settings className="h-8 w-8" />
                <span>System Settings</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="recentActivity">
            <Card className="p-4 bg-slate-800 border-slate-700 text-white">
              <p className="text-slate-400">Activity information will be displayed here</p>
            </Card>
          </TabsContent>
          
          <TabsContent value="systemLogs">
            <Card className="p-4 bg-slate-800 border-slate-700 text-white">
              <p className="text-slate-400">System logs will be displayed here</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Hidden admin link for access from any page */}
      <HiddenAdminLink />
    </div>
  )
}
