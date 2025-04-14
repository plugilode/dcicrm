"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Activity,
  AlertCircle,
  AreaChart,
  ArrowRight,
  BarChart3,
  Bell,
  BookmarkPlus,
  Bot,
  Brain,
  BriefcaseBusiness,
  Building2,
  Calendar,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Database,
  FileText,
  Globe,
  HardDrive,
  Inbox,
  LayoutDashboard,
  LineChart,
  LogOut,
  MessageSquare,
  MoreVertical,
  PieChart,
  Plus,
  Search,
  Settings,
  Sparkles,
  Star,
  Tablet,
  Trash2,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react"
import { logout } from "@/lib/auth"
import { UserCalendarIntegration } from "@/components/ui/user-calendar-integration"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  stats: {
    companies: number;
    contacts: number;
    activeDeals: number;
    upcomingMeetings: number;
  };
}

export default function DCIMediaEnterpriseSuite() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/user', { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
  }, []);
  const [activeModule, setActiveModule] = useState("crm")

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-[#e5e7eb] p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <img src="/images/dci-media-logo.png" alt="DCI MEDIA AG" className="h-14.4" />
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <h3 className="text-[#6b7280] font-semibold text-xs mb-4">MODULE</h3>
            <nav className="space-y-2">
              {[
                { id: "crm", name: "CRM", icon: Users },
                { id: "hr", name: "HR Management", icon: BriefcaseBusiness },
                { id: "finance", name: "Finanzen", icon: CircleDollarSign },
                { id: "ai", name: "AI Tools", icon: Brain },
                { id: "subscriptions", name: "Abonnements", icon: CreditCard },
                { id: "plugilo", name: "Plugilo", icon: BookmarkPlus },
              ].map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center gap-3 w-full p-2 rounded-md ${
                    activeModule === item.id ? "text-[#0098d1] bg-[#e6f7fd]" : "text-[#3f3f3f]"
                  }`}
                  onClick={() => setActiveModule(item.id)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-[#6b7280] font-semibold text-xs mb-4">HAUPTMENÜ</h3>
            <nav className="space-y-2">
              {[
                { name: "Dashboard", icon: LayoutDashboard },
                { name: "Kontakte", icon: Users },
                { name: "Unternehmen", icon: Building2, path: "/unternehmen" },
                { name: "Kampagnen", icon: BarChart3 },
                { name: "Bookmarks", icon: BookmarkPlus },
                { name: "Datenbank", icon: Database },
              ].map((item) => (
                <Link 
                  key={item.name}
                  href={item.path || "#"}
                  className={`flex items-center gap-3 w-full p-2 rounded-md ${
                    activeTab === item.name ? "text-[#0098d1] bg-[#e6f7fd]" : "text-[#3f3f3f]"
                  }`}
                  onClick={() => setActiveTab(item.name)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
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
          <div className="flex items-center gap-3 ml-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="p-2 rounded-lg border-[#e5e7eb] relative">
                    <Bell className="h-5 w-5 text-[#3f3f3f]" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>3 ungelesene Benachrichtigungen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="p-2 rounded-lg border-[#e5e7eb]">
                    <Bot className="h-5 w-5 text-[#3f3f3f]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>KI-Assistent öffnen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Select defaultValue="de">
              <SelectTrigger className="w-[70px] border-[#e5e7eb]">
                <SelectValue placeholder="DE" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de">DE</SelectItem>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="fr">FR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {activeModule === "crm" && (
          <>
            {/* AI Assistant Banner */}
            <div className="bg-gradient-to-r from-[#0098d1] to-[#00b2f5] rounded-xl p-6 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full opacity-20">
                <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white"></div>
                <div className="absolute top-40 right-40 w-16 h-16 rounded-full bg-white"></div>
                <div className="absolute top-20 right-60 w-24 h-24 rounded-full bg-white"></div>
              </div>
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-white" />
                    <p className="text-white text-sm font-medium">KI-ASSISTENT</p>
                  </div>
<h1 className="text-white text-2xl font-bold mb-2">Willkommen zurück, {user ? user.firstName : 'Gast'}!</h1>
                  <p className="text-white opacity-90 mb-4">
                    Ihr KI-Assistent hat 5 neue Lead-Vorschläge und 3 Aufgaben für Sie vorbereitet.
                  </p>
                  <div className="flex gap-3">
                    <Button className="bg-white text-[#0098d1] hover:bg-opacity-90 hover:text-[#0087ba]">
                      Leads anzeigen
                    </Button>
                    <Button className="bg-[#0066a1] text-white hover:bg-[#00558a]">
                      Aufgaben ansehen
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <Brain className="h-24 w-24 text-white opacity-80" />
                </div>
              </div>
            </div>

            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Neue Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">127</div>
                    <Badge className="bg-green-100 text-green-800">+12.5%</Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    <span>Seit letztem Monat</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Offene Deals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">€245.8K</div>
                    <Badge className="bg-green-100 text-green-800">+18.2%</Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    <span>Seit letztem Monat</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">24.8%</div>
                    <Badge className="bg-red-100 text-red-800">-2.3%</Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <AlertCircle className="inline h-3 w-3 mr-1" />
                    <span>Unter Zielwert</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Aktive Kampagnen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">12</div>
                    <Badge className="bg-blue-100 text-blue-800">Läuft</Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    <span>3 enden diese Woche</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI-Generated Insights */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">KI-generierte Erkenntnisse</h2>
                <Badge className="bg-purple-100 text-purple-800">Neu</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-sm">Lead-Priorisierung</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Basierend auf historischen Daten hat die KI 15 Leads identifiziert, die mit 78% Wahrscheinlichkeit
                      konvertieren werden.
                    </p>
                    <Button variant="outline" size="sm" className="text-blue-500">
                      Leads anzeigen
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-green-500" />
                      <CardTitle className="text-sm">Umsatzprognose</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Die KI prognostiziert einen Umsatzanstieg von 22% im nächsten Quartal basierend auf aktuellen
                      Pipeline-Daten.
                    </p>
                    <Button variant="outline" size="sm" className="text-green-500">
                      Details anzeigen
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-amber-500" />
                      <CardTitle className="text-sm">Kommunikationsanalyse</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Die KI hat festgestellt, dass Ihre E-Mails mit technischen Spezifikationen 35% höhere
                      Antwortquoten erzielen.
                    </p>
                    <Button variant="outline" size="sm" className="text-amber-500">
                      Bericht anzeigen
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-red-500" />
                      <CardTitle className="text-sm">Churn-Risiko</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Die KI hat 7 Kunden identifiziert, die ein hohes Abwanderungsrisiko aufweisen. Empfohlene
                      Maßnahmen sind verfügbar.
                    </p>
                    <Button variant="outline" size="sm" className="text-red-500">
                      Maßnahmen anzeigen
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Top Customers */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Top-Kunden</h2>
                <Button variant="outline" size="sm">
                  Alle anzeigen
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    name: "Microsoft Deutschland GmbH",
                    logo: "/images/microsoft-logo.png",
                    revenue: "€1.2M",
                    status: "Aktiv",
                    contact: "Julia Schneider",
                    position: "IT Procurement Manager",
                  },
                  {
                    name: "SAP SE",
                    logo: "/images/sap-logo.png",
                    revenue: "€950K",
                    status: "Aktiv",
                    contact: "Thomas Weber",
                    position: "Head of Cloud Infrastructure",
                  },
                  {
                    name: "IBM Deutschland",
                    logo: "/images/ibm-logo.png",
                    revenue: "€780K",
                    status: "Aktiv",
                    contact: "Markus Becker",
                    position: "CTO",
                  },
                  {
                    name: "Oracle Deutschland",
                    logo: "/images/oracle-logo.png",
                    revenue: "€645K",
                    status: "Verhandlung",
                    contact: "Anna Müller",
                    position: "Procurement Director",
                  },
                ].map((company, idx) => (
                  <Card key={idx} className="overflow-hidden">
                    <CardHeader className="p-4 pb-0">
                      <div className="flex justify-between items-start">
                        <div className="h-10 w-10 bg-gray-100 rounded-md p-1 flex items-center justify-center">
                          <img
                            src={company.logo || "/placeholder.svg"}
                            alt={company.name}
                            className="max-h-8 max-w-8"
                          />
                        </div>
                        <Badge
                          className={
                            company.status === "Aktiv" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }
                        >
                          {company.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-sm mb-1">{company.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3">Jahresumsatz: {company.revenue}</p>
                      <div className="text-xs border-t pt-2">
                        <p className="font-medium">{company.contact}</p>
                        <p className="text-muted-foreground">{company.position}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="p-2 bg-gray-50 flex justify-between">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Profil
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs text-blue-600">
                        Kontaktieren
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            {/* Plugilo Integration */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Plugilo Bookmarks</h2>
                  <Badge className="bg-blue-100 text-blue-800">Integriert</Badge>
                </div>
                <Button className="bg-[#0098d1] hover:bg-[#0087ba]">
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Bookmark hinzufügen
                </Button>
              </div>

              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">Alle</TabsTrigger>
                  <TabsTrigger value="cloud">Cloud</TabsTrigger>
                  <TabsTrigger value="security">Sicherheit</TabsTrigger>
                  <TabsTrigger value="ai">KI & ML</TabsTrigger>
                  <TabsTrigger value="infrastructure">Infrastruktur</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="text-[#6b7280] text-xs border-b border-[#e5e7eb]">
                          <th className="text-left p-4 font-medium">NAME & DATUM</th>
                          <th className="text-left p-4 font-medium">KATEGORIE</th>
                          <th className="text-left p-4 font-medium">BESCHREIBUNG</th>
                          <th className="text-left p-4 font-medium">KI-RELEVANZ</th>
                          <th className="text-left p-4 font-medium">AKTIONEN</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            name: "Microsoft Azure Cloud Services",
                            date: "15.03.2023",
                            category: "Cloud",
                            relevance: 92,
                          },
                          {
                            name: "SAP HANA Cloud Platform",
                            date: "22.03.2023",
                            category: "Cloud",
                            relevance: 87,
                          },
                          {
                            name: "IBM Watson AI Solutions",
                            date: "28.03.2023",
                            category: "KI & ML",
                            relevance: 95,
                          },
                          {
                            name: "Oracle Cloud Infrastructure",
                            date: "02.04.2023",
                            category: "Infrastruktur",
                            relevance: 78,
                          },
                          {
                            name: "Cisco Security Solutions",
                            date: "10.04.2023",
                            category: "Sicherheit",
                            relevance: 84,
                          },
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
                              <div className="flex items-center gap-2">
                                <Progress value={bookmark.relevance} className="h-2 w-20" />
                                <span className="text-xs font-medium">{bookmark.relevance}%</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="text-xs rounded-md">
                                  Öffnen
                                </Button>
                                <Button variant="ghost" size="sm" className="text-xs rounded-md text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="cloud" className="mt-0">
                  <div className="border border-[#e5e7eb] rounded-xl p-8 text-center">
                    <p className="text-muted-foreground">Cloud-spezifische Bookmarks werden hier angezeigt.</p>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="mt-0">
                  <div className="border border-[#e5e7eb] rounded-xl p-8 text-center">
                    <p className="text-muted-foreground">Sicherheits-Bookmarks werden hier angezeigt.</p>
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="mt-0">
                  <div className="border border-[#e5e7eb] rounded-xl p-8 text-center">
                    <p className="text-muted-foreground">KI & ML Bookmarks werden hier angezeigt.</p>
                  </div>
                </TabsContent>

                <TabsContent value="infrastructure" className="mt-0">
                  <div className="border border-[#e5e7eb] rounded-xl p-8 text-center">
                    <p className="text-muted-foreground">Infrastruktur-Bookmarks werden hier angezeigt.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* AI-Powered Campaign Management */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">KI-gestützte Kampagnen</h2>
                  <Badge className="bg-purple-100 text-purple-800">KI-optimiert</Badge>
                </div>
                <Button className="bg-[#0098d1] hover:bg-[#0087ba]">
                  <Plus className="h-4 w-4 mr-2" />
                  Neue Kampagne
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: "DACH ITK Cloud-Lösungen",
                    progress: 78,
                    leads: 145,
                    aiScore: 92,
                    startDate: "01.04.2023",
                    endDate: "30.06.2023",
                  },
                  {
                    name: "Cybersecurity Webinar-Reihe",
                    progress: 65,
                    leads: 98,
                    aiScore: 87,
                    startDate: "15.03.2023",
                    endDate: "15.05.2023",
                  },
                  {
                    name: "KI für Unternehmen 2023",
                    progress: 42,
                    leads: 67,
                    aiScore: 95,
                    startDate: "01.05.2023",
                    endDate: "31.07.2023",
                  },
                ].map((campaign, idx) => (
                  <Card key={idx} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{campaign.name}</CardTitle>
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
                      <CardDescription>
                        {campaign.startDate} - {campaign.endDate}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <Progress value={campaign.progress} className="h-2 mb-4" />

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-gray-50 p-2 rounded-md">
                          <p className="text-xs text-muted-foreground">Leads generiert</p>
                          <p className="font-medium">{campaign.leads}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-md">
                          <p className="text-xs text-muted-foreground">KI-Score</p>
                          <div className="flex items-center">
                            <p className="font-medium">{campaign.aiScore}</p>
                            <Sparkles className="h-4 w-4 text-purple-500 ml-1" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-md mb-3">
                        <div className="flex items-start gap-2">
                          <Brain className="h-4 w-4 text-blue-500 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-blue-700">KI-Empfehlung</p>
                            <p className="text-xs text-blue-600">
                              Erhöhen Sie die E-Mail-Frequenz für Leads mit hohem Engagement um 25%.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between bg-gray-50 p-3">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Details
                      </Button>
                      <Button size="sm" className="text-xs bg-[#0098d1] hover:bg-[#0087ba]">
                        Optimieren
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {activeModule === "hr" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-xl p-6 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full opacity-20">
                <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white"></div>
                <div className="absolute top-40 right-40 w-16 h-16 rounded-full bg-white"></div>
              </div>
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-white" />
                    <p className="text-white text-sm font-medium">HR MANAGEMENT</p>
                  </div>
                  <h1 className="text-white text-2xl font-bold mb-2">Personalverwaltung</h1>
                  <p className="text-white opacity-90 mb-4">
                    Verwalten Sie Mitarbeiter, Bewerbungen und HR-Prozesse mit KI-Unterstützung.
                  </p>
                  <div className="flex gap-3">
                    <Button className="bg-white text-[#6366f1] hover:bg-opacity-90">Mitarbeiter anzeigen</Button>
                    <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#6366f1]">
                      Bewerbungen
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Mitarbeiter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">124</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span>Aktive Mitarbeiter</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Offene Stellen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span>Aktive Ausschreibungen</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Bewerbungen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span>Zu prüfende Bewerbungen</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Urlaubsanträge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span>Ausstehende Genehmigungen</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">KI-gestützte Personalverwaltung</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-500" />
                      <span>Bewerbungsanalyse</span>
                    </CardTitle>
                    <CardDescription>KI-gestützte Analyse von Bewerbungen und Lebenslaufdaten</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Die KI hat 15 neue Bewerbungen analysiert und 8 davon als hochrelevant für offene Positionen
                      eingestuft.
                    </p>
                    <Button className="w-full bg-[#6366f1] hover:bg-[#4f46e5]">Bewerbungen anzeigen</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-green-500" />
                      <span>Mitarbeiterentwicklung</span>
                    </CardTitle>
                    <CardDescription>Personalisierte Weiterbildungsempfehlungen</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Basierend auf Leistungsdaten hat die KI 24 personalisierte Weiterbildungsempfehlungen für Ihr Team
                      erstellt.
                    </p>
                    <Button className="w-full bg-[#6366f1] hover:bg-[#4f46e5]">Empfehlungen anzeigen</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeModule === "finance" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#10b981] to-[#059669] rounded-xl p-6 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full opacity-20">
                <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white"></div>
                <div className="absolute top-40 right-40 w-16 h-16 rounded-full bg-white"></div>
              </div>
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="h-5 w-5 text-white" />
                    <p className="text-white text-sm font-medium">FINANZEN</p>
                  </div>
                  <h1 className="text-white text-2xl font-bold mb-2">Finanzübersicht</h1>
                  <p className="text-white opacity-90 mb-4">
                    Verwalten Sie Ihre Finanzen, Rechnungen und Ausgaben mit KI-Unterstützung.
                  </p>
                  <div className="flex gap-3">
                    <Button className="bg-white text-[#10b981] hover:bg-opacity-90">Finanzberichte</Button>
                    <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#10b981]">
                      Rechnungen
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Umsatz (MTD)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€245.8K</div>
                  <div className="mt-2 text-xs text-green-600">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    <span>+12.5% zum Vormonat</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ausgaben (MTD)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€98.3K</div>
                  <div className="mt-2 text-xs text-red-600">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    <span>+8.2% zum Vormonat</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Offene Rechnungen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€67.5K</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span>18 ausstehende Rechnungen</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Cashflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€147.5K</div>
                  <div className="mt-2 text-xs text-green-600">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    <span>Positiver Cashflow</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">KI-gestützte Finanzanalyse</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AreaChart className="h-5 w-5 text-blue-500" />
                      <span>Umsatzprognose</span>
                    </CardTitle>
                    <CardDescription>KI-gestützte Prognose für die nächsten 3 Monate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Die KI prognostiziert einen Umsatzanstieg von 18% im nächsten Quartal basierend auf historischen
                      Daten und aktuellen Trends.
                    </p>
                    <Button className="w-full bg-[#10b981] hover:bg-[#059669]">Prognose anzeigen</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-purple-500" />
                      <span>Ausgabenoptimierung</span>
                    </CardTitle>
                    <CardDescription>KI-Empfehlungen zur Kostenoptimierung</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Die KI hat Einsparpotenziale von bis zu €24.5K identifiziert, hauptsächlich in den Bereichen
                      IT-Infrastruktur und Marketing.
                    </p>
                    <Button className="w-full bg-[#10b981] hover:bg-[#059669]">Empfehlungen anzeigen</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeModule === "ai" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-xl p-6 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full opacity-20">
                <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white"></div>
                <div className="absolute top-40 right-40 w-16 h-16 rounded-full bg-white"></div>
              </div>
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-white" />
                    <p className="text-white text-sm font-medium">KI-TOOLS</p>
                  </div>
                  <h1 className="text-white text-2xl font-bold mb-2">KI-Werkzeuge & Assistenten</h1>
                  <p className="text-white opacity-90 mb-4">
                    Nutzen Sie die Kraft der künstlichen Intelligenz für Ihr Unternehmen.
                  </p>
                  <div className="flex gap-3">
                    <Button className="bg-white text-[#8b5cf6] hover:bg-opacity-90">KI-Assistenten</Button>
                    <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#8b5cf6]">
                      Automatisierungen
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-purple-500" />
                      <span>KI-Assistent</span>
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                  </div>
                  <CardDescription>Ihr persönlicher KI-Assistent für tägliche Aufgaben</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Der KI-Assistent kann E-Mails verfassen, Meetings planen, Daten analysieren und Berichte erstellen.
                  </p>
                  <Button className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed]">Assistent starten</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span>Dokumentenanalyse</span>
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                  </div>
                  <CardDescription>KI-gestützte Analyse von Dokumenten und Verträgen</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Analysieren Sie Verträge, extrahieren Sie wichtige Informationen und identifizieren Sie potenzielle
                    Risiken.
                  </p>
                  <Button className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed]">Dokument analysieren</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-green-500" />
                      <span>Marktanalyse</span>
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                  </div>
                  <CardDescription>KI-gestützte Analyse von Markttrends und Wettbewerbern</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Erhalten Sie Einblicke in Markttrends, Wettbewerber und Kundenbedürfnisse durch KI-gestützte
                    Analysen.
                  </p>
                  <Button className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed]">Analyse starten</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Tablet className="h-5 w-5 text-amber-500" />
                      <span>Content-Generator</span>
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                  </div>
                  <CardDescription>KI-gestützte Erstellung von Marketing-Inhalten</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Erstellen Sie hochwertige Marketing-Inhalte wie Blog-Artikel, Social-Media-Posts und
                    E-Mail-Kampagnen.
                  </p>
                  <Button className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed]">Content erstellen</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5 text-red-500" />
                      <span>Datenanalyse</span>
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                  </div>
                  <CardDescription>KI-gestützte Analyse von Unternehmensdaten</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Analysieren Sie große Datenmengen, identifizieren Sie Muster und treffen Sie datengestützte
                    Entscheidungen.
                  </p>
                  <Button className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed]">Daten analysieren</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span>Neues KI-Tool</span>
                    </CardTitle>
                    <Badge className="bg-amber-100 text-amber-800">Neu</Badge>
                  </div>
                  <CardDescription>Fügen Sie ein neues KI-Tool hinzu</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[120px]">
                  <Button variant="outline" className="rounded-full h-16 w-16">
                    <Plus className="h-6 w-6 text-[#8b5cf6]" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeModule === "subscriptions" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-xl p-6 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full opacity-20">
                <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white"></div>
                <div className="absolute top-40 right-40 w-16 h-16 rounded-full bg-white"></div>
              </div>
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-white" />
                    <p className="text-white text-sm font-medium">ABONNEMENTS</p>
                  </div>
                  <h1 className="text-white text-2xl font-bold mb-2">Abonnementverwaltung</h1>
                  <p className="text-white opacity-90 mb-4">
                    Verwalten Sie Ihre Abonnements und Lizenzen für Software und Dienste.
                  </p>
                  <div className="flex gap-3">
                    <Button className="bg-white text-[#f59e0b] hover:bg-opacity-90">Abonnements anzeigen</Button>
                    <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#f59e0b]">
                      Neues Abonnement
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Aktive Abonnements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span>Laufende Verträge</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Monatliche Kosten</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€8.745</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span>Wiederkehrende Ausgaben</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Bald ablaufend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <div className="mt-2 text-xs text-red-600">
                    <span>In den nächsten 30 Tagen</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Lizenznutzung</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span>Durchschnittliche Auslastung</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Aktive Abonnements</h2>
                <Button className="bg-[#f59e0b] hover:bg-[#d97706]">
                  <Plus className="h-4 w-4 mr-2" />
                  Neues Abonnement
                </Button>
              </div>

              <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="text-[#6b7280] text-xs border-b border-[#e5e7eb]">
                      <th className="text-left p-4 font-medium">DIENST & PLAN</th>
                      <th className="text-left p-4 font-medium">NUTZER</th>
                      <th className="text-left p-4 font-medium">KOSTEN</th>
                      <th className="text-left p-4 font-medium">NÄCHSTE ABRECHNUNG</th>
                      <th className="text-left p-4 font-medium">STATUS</th>
                      <th className="text-left p-4 font-medium">AKTIONEN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "Microsoft 365",
                        plan: "Business Premium",
                        users: 78,
                        cost: "€1,560/mo",
                        nextBilling: "15.05.2023",
                        status: "Aktiv",
                      },
                      {
                        name: "Adobe Creative Cloud",
                        plan: "Team",
                        users: 12,
                        cost: "€840/mo",
                        nextBilling: "22.05.2023",
                        status: "Aktiv",
                      },
                      {
                        name: "Salesforce",
                        plan: "Enterprise",
                        users: 24,
                        cost: "€3,600/mo",
                        nextBilling: "01.06.2023",
                        status: "Aktiv",
                      },
                      {
                        name: "Zoom",
                        plan: "Business",
                        users: 45,
                        cost: "€675/mo",
                        nextBilling: "10.05.2023",
                        status: "Läuft bald ab",
                      },
                      {
                        name: "AWS",
                        plan: "Business",
                        users: "Unbegrenzt",
                        cost: "€2,070/mo",
                        nextBilling: "05.06.2023",
                        status: "Aktiv",
                      },
                    ].map((subscription, idx) => (
                      <tr key={idx} className="border-b border-[#e5e7eb]">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-[#f8fafc] p-2 rounded-md">
                              <CreditCard className="h-5 w-5 text-[#f59e0b]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{subscription.name}</p>
                              <p className="text-xs text-[#9e9e9e]">{subscription.plan}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm">{subscription.users}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-medium">{subscription.cost}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm">{subscription.nextBilling}</p>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={
                              subscription.status === "Aktiv"
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }
                          >
                            {subscription.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="text-xs rounded-md">
                              Details
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs rounded-md text-blue-600">
                              Verlängern
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">KI-Empfehlungen für Abonnements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-500" />
                      <span>Kostenoptimierung</span>
                    </CardTitle>
                    <CardDescription>KI-gestützte Empfehlungen zur Optimierung Ihrer Abonnementkosten</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Die KI hat Einsparpotenziale von bis zu €1.245/Monat identifiziert, hauptsächlich durch
                      Konsolidierung von Lizenzen und Wechsel zu Jahresabonnements.
                    </p>
                    <Button className="w-full bg-[#f59e0b] hover:bg-[#d97706]">Empfehlungen anzeigen</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <span>Nutzungsanalyse</span>
                    </CardTitle>
                    <CardDescription>KI-gestützte Analyse der Nutzung Ihrer Abonnements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Die KI hat 8 ungenutzte Lizenzen identifiziert und empfiehlt eine Anpassung Ihrer Abonnements
                      basierend auf der tatsächlichen Nutzung.
                    </p>
                    <Button className="w-full bg-[#f59e0b] hover:bg-[#d97706]">Analyse anzeigen</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeModule === "plugilo" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] rounded-xl p-6 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full opacity-20">
                <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white"></div>
                <div className="absolute top-40 right-40 w-16 h-16 rounded-full bg-white"></div>
              </div>
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookmarkPlus className="h-5 w-5 text-white" />
                    <p className="text-white text-sm font-medium">PLUGILO</p>
                  </div>
                  <h1 className="text-white text-2xl font-bold mb-2">Plugilo Bookmark-System</h1>
                  <p className="text-white opacity-90 mb-4">
                    Verwalten Sie Ihre Bookmarks und Datenbanken für B2B-Marketing im ITK-Bereich.
                  </p>
                  <div className="flex gap-3">
                    <Button className="bg-white text-[#3b82f6] hover:bg-opacity-90">Bookmarks verwalten</Button>
                    <Button variant="outline" className="text-white border-white hover:bg-white hover:text-[#3b82f6]">
                      Neuer Bookmark
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Gespeicherte Bookmarks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">247</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span>Aktive Bookmarks</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Kategorien</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span>Organisierte Kategorien</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Geteilte Bookmarks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">84</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span>Mit Team geteilt</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">KI-Vorschläge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span>Neue Vorschläge</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Plugilo Dashboard</h2>
                <Button className="bg-[#3b82f6] hover:bg-[#2563eb]">
                  <Plus className="h-4 w-4 mr-2" />
                  Neuer Bookmark
                </Button>
              </div>

              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">Alle</TabsTrigger>
                  <TabsTrigger value="recent">Kürzlich</TabsTrigger>
                  <TabsTrigger value="shared">Geteilt</TabsTrigger>
                  <TabsTrigger value="favorites">Favoriten</TabsTrigger>
                  <TabsTrigger value="ai">KI-Vorschläge</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        name: "Microsoft Azure Cloud Services",
                        url: "https://azure.microsoft.com",
                        category: "Cloud",
                        tags: ["IaaS", "PaaS", "SaaS"],
                        addedBy: "Patrick Blanks",
                        date: "15.03.2023",
                      },
                      {
                        name: "SAP HANA Cloud Platform",
                        url: "https://www.sap.com/products/hana-cloud.html",
                        category: "Cloud",
                        tags: ["Database", "Analytics", "Enterprise"],
                        addedBy: "Patrick Blanks",
                        date: "22.03.2023",
                      },
                      {
                        name: "IBM Watson AI Solutions",
                        url: "https://www.ibm.com/watson",
                        category: "KI & ML",
                        tags: ["AI", "Machine Learning", "NLP"],
                        addedBy: "Patrick Blanks",
                        date: "28.03.2023",
                      },
                      {
                        name: "Oracle Cloud Infrastructure",
                        url: "https://www.oracle.com/cloud/",
                        category: "Infrastruktur",
                        tags: ["IaaS", "Database", "Enterprise"],
                        addedBy: "Patrick Blanks",
                        date: "02.04.2023",
                      },
                      {
                        name: "Cisco Security Solutions",
                        url: "https://www.cisco.com/c/en/us/products/security/",
                        category: "Sicherheit",
                        tags: ["Network", "Firewall", "Security"],
                        addedBy: "Patrick Blanks",
                        date: "10.04.2023",
                      },
                      {
                        name: "AWS Machine Learning",
                        url: "https://aws.amazon.com/machine-learning/",
                        category: "KI & ML",
                        tags: ["AI", "Cloud", "Analytics"],
                        addedBy: "Patrick Blanks",
                        date: "15.04.2023",
                      },
                    ].map((bookmark, idx) => (
                      <Card key={idx} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{bookmark.name}</CardTitle>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Star className="h-4 w-4 text-[#f59e0b]" />
                            </Button>
                          </div>
                          <CardDescription>
                            <a href={bookmark.url} className="text-blue-500 hover:underline truncate block">
                              {bookmark.url}
                            </a>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex flex-wrap gap-1 mb-3">
                            <Badge className="bg-[#e6f7fd] text-[#3b82f6]">{bookmark.category}</Badge>
                            {bookmark.tags.map((tag, tagIdx) => (
                              <Badge key={tagIdx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <p>Hinzugefügt von {bookmark.addedBy}</p>
                            <span>•</span>
                            <p>{bookmark.date}</p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between bg-gray-50 p-3">
                          <Button variant="ghost" size="sm" className="text-xs">
                            Bearbeiten
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            Teilen
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs text-red-600">
                            Löschen
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="recent" className="mt-0">
                  <div className="border border-[#e5e7eb] rounded-xl p-8 text-center">
                    <p className="text-muted-foreground">Kürzlich hinzugefügte Bookmarks werden hier angezeigt.</p>
                  </div>
                </TabsContent>

                <TabsContent value="shared" className="mt-0">
                  <div className="border border-[#e5e7eb] rounded-xl p-8 text-center">
                    <p className="text-muted-foreground">Geteilte Bookmarks werden hier angezeigt.</p>
                  </div>
                </TabsContent>

                <TabsContent value="favorites" className="mt-0">
                  <div className="border border-[#e5e7eb] rounded-xl p-8 text-center">
                    <p className="text-muted-foreground">Favorisierte Bookmarks werden hier angezeigt.</p>
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="mt-0">
                  <div className="border border-[#e5e7eb] rounded-xl p-8 text-center">
                    <p className="text-muted-foreground">KI-Vorschläge werden hier angezeigt.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-72 border-l border-[#e5e7eb] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold">Ihr Profil</h2>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-3">
            <div className="absolute inset-0 rounded-full border-4 border-t-[#0098d1] border-r-[#0098d1] border-b-transparent border-l-transparent rotate-45"></div>
            <Avatar className="h-20 w-20 border-4 border-white">
              <AvatarImage src="/images/patrick-blanks.png" alt="Patrick Blanks" />
              <AvatarFallback>PB</AvatarFallback>
            </Avatar>
          </div>
          <h3 className="font-semibold text-lg">Patrick Blanks</h3>
          <p className="text-sm text-center text-[#6b7280] mt-1">Senior Account Manager</p>
          <Badge className="mt-2 bg-[#e6f7fd] text-[#0098d1]">Admin</Badge>

          <div className="flex gap-3 mt-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Inbox className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <UserCalendarIntegration />
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-medium mb-3">KI-Assistent</h3>
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">KI-Assistent</p>
                  <p className="text-xs text-muted-foreground">Immer für Sie da</p>
                </div>
              </div>

              <p className="text-sm mb-3">
                Hallo Patrick! Ich habe 3 wichtige Aufgaben für Sie identifiziert und 5 E-Mails priorisiert.
              </p>

              <Button className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed]">Mit KI-Assistent sprechen</Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium">Kürzliche Aktivitäten</h2>
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              Alle anzeigen
            </Button>
          </div>

          <div className="space-y-4">
            {[
              {
                action: "Bookmark hinzugefügt",
                item: "AWS Machine Learning",
                time: "Vor 35 Minuten",
                icon: BookmarkPlus,
                color: "blue",
              },
              {
                action: "Kontakt aktualisiert",
                item: "Thomas Weber, SAP SE",
                time: "Vor 2 Stunden",
                icon: Users,
                color: "green",
              },
              {
                action: "Kampagne gestartet",
                item: "KI für Unternehmen 2023",
                time: "Vor 4 Stunden",
                icon: BarChart3,
                color: "purple",
              },
              {
                action: "Dokument analysiert",
                item: "Q2 Marktanalyse.pdf",
                time: "Vor 6 Stunden",
                icon: FileText,
                color: "amber",
              },
            ].map((activity, idx) => (
              <div key={idx} className="flex gap-3">
                <div
                  className={`bg-${activity.color}-100 p-1.5 rounded-md h-7 w-7 flex items-center justify-center shrink-0`}
                >
                  <activity.icon className={`h-4 w-4 text-${activity.color}-600`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.item}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full mt-4 text-sm" variant="outline">
            Mehr laden
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
