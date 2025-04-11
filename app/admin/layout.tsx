"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuSubButton 
} from "@/components/ui/sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if the current user is an admin
    const checkAdminStatus = async () => {
      try {
        const response = await fetch('/api/admin/auth')
        const data = await response.json()
        
        if (response.ok && data.isAdmin) {
          setIsAdmin(true)
        } else {
          // Redirect to dashboard if not admin
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Failed to check admin status:', error)
        router.push('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return null // This prevents flash of content before redirect
  }

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar className="w-64 bg-slate-800 text-white">
        <SidebarHeader>
          <h2 className="text-xl font-bold text-center py-4">Admin Panel</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuSubButton href="/admin">Admin Dashboard</SidebarMenuSubButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuSubButton href="/admin/users">User Management</SidebarMenuSubButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuSubButton href="/admin/database">Database Management</SidebarMenuSubButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuSubButton href="/dashboard">Return to App</SidebarMenuSubButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg border border-white/20 min-h-[calc(100vh-3rem)]">
          {children}
        </div>
      </main>
    </div>
  )
}
