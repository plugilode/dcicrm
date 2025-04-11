"use client"

import { useState } from "react"
import { logout } from "@/lib/auth"
import {
  BarChart3,
  Bell,
  BookmarkPlus,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Database,
  FileText,
  Globe,
  Inbox,
  LayoutDashboard,
  LogOut,
  MoreVertical,
  PieChart,
  Search,
  Settings,
  Shield,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import AdminMenu from "@/components/AdminMenu"
import PasswordChangeDialog from "@/components/PasswordChangeDialog"

export default function DCIMediaCRM() {
  const [activeTab, setActiveTab] = useState("Dashboard")

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-[#e5e7eb] p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <img src="/images/dci-media-logo.png" alt="DCI MEDIA AG" className="h-8" />
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <h3 className="text-[#6b7280] font-semibold text-xs mb-4">HAUPTMENÜ</h3>
            <nav className="space-y-2">
              {[
                { name: "Dashboard", icon: LayoutDashboard },
                { name: "Kontakte", icon: Users },
                { name: "Unternehmen", icon: Building2 },
                { name: "Kampagnen", icon: BarChart3 },
                { name: "Bookmarks", icon: BookmarkPlus },
                { name: "Datenbank", icon: Database },
              ].map((item) => (
                <button
                  key={item.name}
                  className={`flex items-center gap-3 w-full p-2 rounded-md ${
                    activeTab === item.name ? "text-[#0098d1] bg-[#e6f7fd]" : "text-[#3f3f3f]"
                  }`}
                  onClick={() => setActiveTab(item.name)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-[#6b7280] font-semibold text-xs mb-4">BERICHTE</h3>
            <nav className="space-y-2">
              {[
                { name: "Analytics", icon: PieChart },
                { name: "Dokumente", icon: FileText },
                { name: "Kalender", icon: Calendar },
              ].map((item) => (
                <button
                  key={item.name}
                  className={`flex items-center gap-3 w-full p-2 rounded-md ${
                    activeTab === item.name ? "text-[#0098d1] bg-[#e6f7fd]" : "text-[#3f3f3f]"
                  }`}
                  onClick={() => setActiveTab(item.name)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto">
            <h3 className="text-[#6b7280] font-semibold text-xs mb-4">EINSTELLUNGEN</h3>
            <nav className="space-y-2">
              <button className="flex items-center gap-3 w-full p-2 rounded-md text-[#3f3f3f]">
                <Settings className="h-5 w-5" />
                <span>Einstellungen</span>
              </button>
              <button 
                onClick={logout}
                className="flex items-center gap-3 w-full p-2 rounded-md text-[#f13e3e]"
              >
                <LogOut className="h-5 w-5" />
                <span>Abmelden</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9e9e9e] h-5 w-5" />
            <Input
              placeholder="Suchen Sie nach Unternehmen, Kontakten oder Bookmarks..."
              className="pl-10 py-6 border-[#e5e7eb] rounded-lg"
            />
          </div>
          <Button variant="outline" className="ml-4 p-2 rounded-lg border-[#e5e7eb]">
            <Bell className="h-5 w-5 text-[#3f3f3f]" />
          </Button>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#0098d1] to-[#00b2f5] rounded-xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-20">
            <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white"></div>
            <div className="absolute top-40 right-40 w-16 h-16 rounded-full bg-white"></div>
            <div className="absolute top-20 right-60 w-24 h-24 rounded-full bg-white"></div>
          </div>
          <div className="relative z-10">
            <p className="text-white text-sm mb-2">PLUGILO CRM SYSTEM</p>
            <h1 className="text-white text-3xl font-bold mb-6">
              Optimieren Sie Ihr B2B Marketing
              <br />
              im ITK-Bereich in DACH
            </h1>
            <Button className="bg-[#202020] hover:bg-[#3f3f3f] text-white rounded-full px-6">
              Bookmark hinzufügen
              <div className="ml-2 bg-white rounded-full p-1">
                <ChevronRight className="h-3 w-3 text-black" />
              </div>
            </Button>
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Kürzlich hinzugefügte Kontakte</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full border-[#e5e7eb]">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-[#e5e7eb]">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              {
                name: "Thomas Müller",
                company: "Telekom Deutschland GmbH",
                position: "IT Manager",
                country: "Deutschland",
              },
              { name: "Anna Schmidt", company: "Swisscom AG", position: "CTO", country: "Schweiz" },
              {
                name: "Michael Weber",
                company: "A1 Telekom Austria",
                position: "Einkaufsleiter",
                country: "Österreich",
              },
            ].map((contact, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={contact.name} />
                      <AvatarFallback>
                        {contact.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Badge className="bg-[#e6f7fd] text-[#0098d1] hover:bg-[#d0f0fb]">{contact.country}</Badge>
                  </div>
                  <h3 className="font-medium text-lg mb-1">{contact.name}</h3>
                  <p className="text-[#6b7280] mb-3">{contact.position}</p>
                  <div className="flex items-center gap-2 text-sm text-[#6b7280]">
                    <Building2 className="h-4 w-4" />
                    <span>{contact.company}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-md flex-1">
                      Profil
                    </Button>
                    <Button size="sm" className="rounded-md flex-1 bg-[#0098d1] hover:bg-[#0087ba]">
                      Kontaktieren
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bookmarks Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Plugilo Bookmarks</h2>
            <Button variant="link" className="text-[#0098d1]">
              Alle anzeigen
            </Button>
          </div>

          <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-[#6b7280] text-xs border-b border-[#e5e7eb]">
                  <th className="text-left p-4 font-medium">NAME & DATUM</th>
                  <th className="text-left p-4 font-medium">KATEGORIE</th>
                  <th className="text-left p-4 font-medium">BESCHREIBUNG</th>
                  <th className="text-left p-4 font-medium">AKTIONEN</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Telekom Cloud Services", date: "15.03.2023", category: "Cloud" },
                  { name: "Swisscom IoT Platform", date: "22.03.2023", category: "IoT" },
                  { name: "A1 Digital Transformation", date: "28.03.2023", category: "Digital" },
                ].map((bookmark, idx) => (
                  <tr key={idx} className="border-b border-[#e5e7eb]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#e6f7fd] p-2 rounded-md">
                          <Globe className="h-5 w-5 text-[#0098d1]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{bookmark.name}</p>
                          <p className="text-xs text-[#9e9e9e]">{bookmark.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-[#e6f7fd] text-[#0098d1] text-xs font-medium px-3 py-1 rounded-full">
                        {bookmark.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">ITK Lösungen für Unternehmen</p>
                    </td>
                    <td className="p-4">
                      <Button variant="outline" className="text-xs rounded-full bg-[#f8f9fa] border-none">
                        DETAILS ANZEIGEN
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Campaign Performance */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Kampagnen-Performance</h2>
            <Button variant="outline" className="text-[#0098d1] border-[#0098d1]">
              Neue Kampagne
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { name: "DACH ITK Newsletter", progress: 78, leads: 145 },
              { name: "Cloud Services Webinar", progress: 65, leads: 98 },
              { name: "Digitalisierung 2023", progress: 42, leads: 67 },
            ].map((campaign, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-[#e5e7eb] p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">{campaign.name}</h3>
                  <Badge
                    className={`${
                      campaign.progress > 70
                        ? "bg-[#d1fae5] text-[#059669]"
                        : campaign.progress > 50
                          ? "bg-[#fef3c7] text-[#d97706]"
                          : "bg-[#fee2e2] text-[#dc2626]"
                    }`}
                  >
                    {campaign.progress}%
                  </Badge>
                </div>
                <Progress value={campaign.progress} className="h-2 mb-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7280]">Leads generiert: {campaign.leads}</span>
                  <span className="text-[#0098d1] font-medium">Details</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-72 border-l border-[#e5e7eb] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold">Ihr Profil</h2>
          <div className="flex items-center gap-2">
            <AdminMenu />
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-3">
            <div className="absolute inset-0 rounded-full border-4 border-t-[#0098d1] border-r-[#0098d1] border-b-transparent border-l-transparent rotate-45"></div>
            <Avatar className="h-20 w-20 border-4 border-white">
              <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt="Profile" />
              <AvatarFallback>JM</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-[#0098d1] rounded-full p-1.5">
              <Shield className="h-4 w-4 text-white" />
            </div>
          </div>
          <h3 className="font-semibold text-lg">Johannes Müller</h3>
          <p className="text-sm text-center text-[#7e7e7e] mt-1">Senior Account Manager</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-[#0098d1] text-white">Admin</Badge>
            <Badge variant="outline" className="text-[#0098d1]">System Manager</Badge>
          </div>
          <PasswordChangeDialog />
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-medium mb-2">Ihre Aktivitäten</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Bookmarks</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">78</span>
                <div className="w-24 bg-[#e6f7fd] h-2 rounded-full">
                  <div className="bg-[#0098d1] h-2 rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Kontakte</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">124</span>
                <div className="w-24 bg-[#e6f7fd] h-2 rounded-full">
                  <div className="bg-[#0098d1] h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Kampagnen</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">12</span>
                <div className="w-24 bg-[#e6f7fd] h-2 rounded-full">
                  <div className="bg-[#0098d1] h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Top Unternehmen</h2>
            <Button variant="ghost" size="icon" className="rounded-full bg-[#e6f7fd] text-[#0098d1]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </div>

          <div className="space-y-3">
            {[
              { name: "Deutsche Telekom AG", country: "Deutschland" },
              { name: "Swisscom AG", country: "Schweiz" },
              { name: "A1 Telekom Austria", country: "Österreich" },
              { name: "Vodafone GmbH", country: "Deutschland" },
              { name: "Sunrise Communications", country: "Schweiz" },
            ].map((company, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#e6f7fd] p-2 rounded-md">
                    <Building2 className="h-5 w-5 text-[#0098d1]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{company.name}</p>
                    <p className="text-xs text-[#9e9e9e]">{company.country}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button className="w-full mt-4 bg-[#e6f7fd] text-[#0098d1] hover:bg-[#d0f0fb]">Alle anzeigen</Button>
        </div>
      </div>
    </div>
  )
}

