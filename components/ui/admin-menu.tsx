"use client"

import {
  Database,
  Settings,
  Users,
  Shield,
  Terminal,
  Bot,
  Server,
  Key,
  Network
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function AdminMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Shield className="h-5 w-5 text-[#0098d1]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Admin-Bereich</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Users className="mr-2 h-4 w-4" />
            <span>Benutzer verwalten</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Database className="mr-2 h-4 w-4" />
            <span>Datenbank</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bot className="mr-2 h-4 w-4" />
            <span>KI-Konfiguration</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Server className="mr-2 h-4 w-4" />
            <span>API-Management</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Terminal className="mr-2 h-4 w-4" />
            <span>System Logs</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Network className="mr-2 h-4 w-4" />
            <span>Monitoring</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Key className="mr-2 h-4 w-4" />
          <span>Zugriffsrechte</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
