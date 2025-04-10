"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  AtSign,
  Check,
  Edit,
  ExternalLink,
  File,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash,
  User,
  Building2,
  BarChart3,
  Users,
  ChevronRight,
  MessageSquare,
  XIcon,
  Sparkles,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { getCompanyById, Company } from "../../lib/data/companies"
import { Contact, getContactsByCompanyId } from "../../lib/data/contacts"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

// Add this function after the imports
const formatNumber = (value: number | string | undefined): string => {
  if (value === undefined || value === null) return "–"

  // If it's already a string that might contain formatting, return it
  if (typeof value === "string" && isNaN(Number(value.replace(/\./g, "").replace(/,/g, "")))) {
    return value
  }

  // Convert to number if it's a string
  const num = typeof value === "string" ? Number.parseFloat(value.replace(/\./g, "").replace(/,/g, "")) : value

  // Format with German locale (dots as thousand separators)
  return num.toLocaleString("de-DE")
}

// Add a function to get the logo URL from Clearbit based on the company's website domain
// Add this function after the formatNumber function

const getCompanyLogo = (website: string): string => {
  if (!website) return "/placeholder.svg"

  try {
    // Extract the domain from the website URL
    const domain = website.replace(/^https?:\/\//, "").split("/")[0]
    return `https://logo.clearbit.com/${domain}`
  } catch (error) {
    return "/placeholder.svg"
  }
}

// Add this type definition after the other type definitions or before the component
type EnrichmentResult = {
  field: string
  currentValue: string
  newValue: string
  source?: {
    name: string
    type: "Google" | "TrustedShops" | "GelbeSeiten" | "Billiger.de" | "WLW" | "Vermittlung" | "Sonstiges"
    date?: string
  }
}

export default function CompanyDetail({ companyId }: { companyId: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [rotateY, setRotateY] = useState(0)
  const [rotateX, setRotateX] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const [enrichmentOpen, setEnrichmentOpen] = useState(false)
  const [enrichmentLoading, setEnrichmentLoading] = useState(false)
  const [enrichmentResults, setEnrichmentResults] = useState<EnrichmentResult[]>([])
  const [currentEnrichmentIndex, setCurrentEnrichmentIndex] = useState(0)

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getCompanyById(companyId)
      .then((data) => {
        setCompany(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching company:", error);
        setLoading(false);
      });
  }, [companyId]);
  const contacts = company ? getContactsByCompanyId(company.id) : []

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || !isHovered) return
      
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const newRotateY = ((x - centerX) / centerX) * 5
      const newRotateX = ((centerY - y) / centerY) * 5
      
      setRotateY(newRotateY)
      setRotateX(newRotateX)
    }
  
    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [isHovered])
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }
  
  if (!company) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Unternehmen nicht gefunden</p>
      </div>
    )
  }

  const handleSave = () => {
    setSaving(true)
    // Simulate API call
    setTimeout(() => {
      setSaving(false)
      setIsEditing(false)
    }, 1000)
  }

  // Generate random data for the 3D chart
  const generateChartData = () => {
    return Array.from({ length: 12 }, () => Math.floor(Math.random() * 100))
  }

  const chartData = generateChartData()
  const maxValue = Math.max(...chartData)

  // Financial metrics for the company
  const financialMetrics = [
    { name: "Umsatz", value: company.revenue || "€4.5M", change: "+12.5%", trend: "up" },
    { name: "Mitarbeiter", value: formatNumber(company.employees), change: "+5.2%", trend: "up" },
    { name: "Projekte", value: "8", change: "+2", trend: "up" },
    { name: "Kundenzufriedenheit", value: "94%", change: "+2.1%", trend: "up" },
  ]

  const handleEnrichment = async () => {
    if (!company) return

    setEnrichmentLoading(true)
    setEnrichmentOpen(true)

    try {
      // Simulate API call to OpenAI/Gemini
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock enrichment results - in a real implementation, this would come from the API
      const mockResults: EnrichmentResult[] = [
        {
          field: "Mitarbeiter",
          currentValue: company.employees.toString(),
          newValue: (company.employees + 500).toString(),
          source: {
            name: "LinkedIn",
            type: "Sonstiges",
            date: "vor 2 Tagen",
          },
        },
        {
          field: "Umsatz",
          currentValue: company.revenue || "Unbekannt",
          newValue: company.revenue ? company.revenue.replace("Mrd", "Mrd.") + " (2023)" : "€4.7 Mrd. (2023)",
          source: {
            name: "Geschäftsbericht",
            type: "Sonstiges",
            date: "2023",
          },
        },
        {
          field: "Beschreibung",
          currentValue: company.description,
          newValue:
            company.description +
            " Das Unternehmen hat kürzlich eine neue Cloud-Strategie angekündigt und plant, bis 2025 vollständig auf erneuerbare Energien umzusteigen.",
          source: {
            name: "Pressemitteilung",
            type: "Google",
            date: "15.03.2023",
          },
        },
        {
          field: "Website",
          currentValue: company.website,
          newValue: company.website,
          source: {
            name: "Unverändert",
            type: "Sonstiges",
          },
        },
        {
          field: "Bewertung",
          currentValue: "Keine Bewertung",
          newValue: "4.7/5.0 (238 Bewertungen)",
          source: {
            name: "TrustedShops",
            type: "TrustedShops",
            date: "Aktuell",
          },
        },
        {
          field: "Adresse",
          currentValue: `${company.address}, ${company.zip} ${company.city}`,
          newValue: `${company.address}, ${company.zip} ${company.city}`,
          source: {
            name: "GelbeSeiten",
            type: "GelbeSeiten",
            date: "Verifiziert am 01.04.2023",
          },
        },
        {
          field: "Branchenverzeichnis",
          currentValue: "Nicht gelistet",
          newValue: "IT-Dienstleister, Software-Entwicklung, Cloud-Services",
          source: {
            name: "WLW",
            type: "WLW",
            date: "Letzte Aktualisierung: 10.03.2023",
          },
        },
      ]

      setEnrichmentResults(mockResults)
      setCurrentEnrichmentIndex(0)
    } catch (error) {
      console.error("Error during enrichment:", error)
    } finally {
      setEnrichmentLoading(false)
    }
  }

  const applyEnrichment = (index: number, apply: boolean) => {
    // In a real implementation, this would update the company data
    console.log(`${apply ? "Applied" : "Rejected"} enrichment for ${enrichmentResults[index].field}`)

    // Move to next enrichment result
    if (index < enrichmentResults.length - 1) {
      setCurrentEnrichmentIndex(index + 1)
    } else {
      // Close dialog when all enrichments have been reviewed
      setEnrichmentOpen(false)
      setEnrichmentResults([])
      setCurrentEnrichmentIndex(0)
    }
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header with 3D gradient background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0098d1] to-[#00b2f5] p-8 mb-8">
        <div className="absolute top-0 right-0 w-full h-full opacity-20">
          <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white"></div>
          <div className="absolute top-40 right-40 w-16 h-16 rounded-full bg-white"></div>
          <div className="absolute top-20 right-60 w-24 h-24 rounded-full bg-white"></div>
        </div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="bg-white/20 border-white/40 text-white hover:bg-white/30"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zum Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">{company.name}</h1>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  {company.type === "kunde" ? "Kunde" : company.type === "partner" ? "Partner" : "Prospect"}
                </Badge>
                <span className="text-white/80">{company.industry}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="bg-white/20 border-white/40 text-white hover:bg-white/30"
                >
                  <XIcon className="h-4 w-4 mr-2" />
                  Abbrechen
                </Button>
                <Button onClick={handleSave} className="bg-white hover:bg-white/90 text-[#0098d1]">
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Speichern
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleEnrichment}
                  className="bg-white/20 border-white/40 text-white hover:bg-white/30"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Enrichment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 border-white/40 text-white hover:bg-white/30"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Bearbeiten
                </Button>
                <Button variant="destructive" className="bg-red-500/80 hover:bg-red-500">
                  <Trash className="h-4 w-4 mr-2" />
                  Löschen
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {financialMetrics.map((metric, index) => (
          <Card
            key={index}
            className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{metric.value}</div>
                <Badge
                  className={`${metric.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {metric.change}
                </Badge>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                <span>Verglichen zum Vorjahr</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Company info with 3D effect */}
        <Card
          className="lg:col-span-1 overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
          ref={cardRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false)
            setRotateX(0)
            setRotateY(0)
          }}
          style={{
            transform: `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
            transition: isHovered ? "none" : "transform 0.5s ease-out",
          }}
        >
          <CardHeader className="p-6 pb-2">
            <div className="flex flex-col items-center text-center">
              <div className="h-28 w-28 bg-white rounded-full p-3 border mb-4 flex items-center justify-center shadow-md transform hover:scale-105 transition-transform duration-300">
                <img
                  src={getCompanyLogo(company.website) || "/placeholder.svg"}
                  alt={company.name}
                  className="max-h-20 max-w-20"
                  onError={(e) => {
                    // Fallback to placeholder if the logo fails to load
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                  }}
                />
              </div>
              <CardTitle className="text-xl">{company.name}</CardTitle>
              <CardDescription className="text-base">{company.industry}</CardDescription>
              <Badge className="mt-3 mb-1 px-3 py-1 text-sm">
                {company.type === "kunde" ? "Kunde" : company.type === "partner" ? "Partner" : "Prospect"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Company Info */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#0098d1]" />
                Unternehmensdaten
              </h3>
              <div className="space-y-3 pl-6">
                {isEditing ? (
                  <>
                    <div className="space-y-1">
                      <Label htmlFor="address">Adresse</Label>
                      <Input id="address" defaultValue={company.address} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="zip">PLZ</Label>
                        <Input id="zip" defaultValue={company.zip} />
                      <Input id="country" defaultValue={company.country} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" defaultValue={company.website} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">E-Mail</Label>
                      <Input id="email" defaultValue={company.email} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input id="phone" defaultValue={company.phone} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm flex items-center gap-2 hover:text-[#0098d1] transition-colors">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {company.address}, {company.zip} {company.city}, {company.country}
                      </span>
                    </div>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      {company.website ? company.website.replace(/^https?:\/\//, "") : "-"}
                    </a>
                    <a
                      href={`mailto:${company.email}`}
                      className="text-sm flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {company.email}
                    </a>
                    <a
                      href={`tel:${company.phone}`}
                      className="text-sm flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      {company.phone}
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#0098d1]" />
                Social Media
              </h3>
              <div className="space-y-3 pl-6">
                {isEditing ? (
                  <>
                    <div className="space-y-1">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input id="linkedin" defaultValue={company.socialMedia?.linkedin || ""} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input id="twitter" defaultValue={company.socialMedia?.twitter || ""} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input id="facebook" defaultValue={company.socialMedia?.facebook || ""} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="xing">Xing</Label>
                      <Input id="xing" defaultValue={company.socialMedia?.xing || ""} />
                    </div>
                  </>
                ) : (
                  <>
                    {company.socialMedia?.linkedin && (
                      <a
                        href={company.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <AtSign className="h-4 w-4" />
                        LinkedIn
                      </a>
                    )}
                    {company.socialMedia?.twitter && (
                      <a
                        href={company.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <AtSign className="h-4 w-4" />
                        Twitter
                      </a>
                    )}
                    {company.socialMedia?.facebook && (
                      <a
                        href={company.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <AtSign className="h-4 w-4" />
                        Facebook
                      </a>
                    )}
                    {company.socialMedia?.xing && (
                      <a
                        href={company.socialMedia.xing}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <AtSign className="h-4 w-4" />
                        Xing
                      </a>
                    )}
                    {!company.socialMedia?.linkedin &&
                      !company.socialMedia?.twitter &&
                      !company.socialMedia?.facebook &&
                      !company.socialMedia?.xing && (
                        <p className="text-sm text-muted-foreground">Keine Social Media Profile hinterlegt.</p>
                      )}
                  </>
                )}
              </div>
            </div>

            {/* Company Details */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#0098d1]" />
                Details
              </h3>
              <div className="space-y-3 pl-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Mitarbeiter</span>
                  {isEditing ? (
                    <Input className="w-32 h-8" defaultValue={company.employees} />
                  ) : (
                    <span className="text-sm font-medium">{formatNumber(company.employees)}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Umsatz</span>
                  {isEditing ? (
                    <Input className="w-32 h-8" defaultValue={company.revenue || ""} />
                  ) : (
                    <span className="text-sm font-medium">{company.revenue || "–"}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Gründungsjahr</span>
                  {isEditing ? (
                    <Input className="w-32 h-8" defaultValue={company.foundedYear || ""} />
                  ) : (
                    <span className="text-sm font-medium">{company.foundedYear || "–"}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right column - Tabs */}
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-lg">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <CardHeader className="p-6 pb-0 bg-gradient-to-r from-[#f8f9fa] to-white">
              <TabsList className="bg-gray-100/80 p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white">
                  Übersicht
                </TabsTrigger>
                <TabsTrigger value="contacts" className="data-[state=active]:bg-white">
                  Kontakte ({contacts.length})
                </TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-white">
                  Notizen
                </TabsTrigger>
                <TabsTrigger value="files" className="data-[state=active]:bg-white">
                  Dateien
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="overview">
              <CardContent className="p-6 space-y-6">
                {/* 3D Bar Chart */}
                <div className="mb-8 bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-[#0098d1]" />
                    Umsatzentwicklung
                  </h3>
                  <div className="h-40 flex items-end justify-between gap-1 px-2">
                    {chartData.map((value, index) => (
                      <div key={index} className="relative flex flex-col items-center group">
                        <div
                          className="w-8 bg-gradient-to-t from-[#0098d1] to-[#00b2f5] rounded-t-sm transform hover:translate-y-[-5px] transition-transform duration-300"
                          style={{
                            height: `${(value / maxValue) * 100}%`,
                            boxShadow:
                              "0 10px 15px -3px rgba(0, 152, 209, 0.1), 0 4px 6px -2px rgba(0, 152, 209, 0.05)",
                          }}
                        ></div>
                        <div className="text-xs mt-1 text-gray-500">{`Q${Math.floor(index / 3) + 1}`}</div>
                        <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {formatNumber(value)}k €
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium mb-3">Beschreibung</h3>
                  {isEditing ? (
                    <Textarea defaultValue={company.description} className="min-h-[100px]" />
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">{company.description}</p>
                  )}
                </div>

                {/* Key contacts preview */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#0098d1]" />
                      Hauptkontakte
                    </h3>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-6 p-0 text-[#0098d1]"
                      onClick={() => setActiveTab("contacts")}
                    >
                      Alle anzeigen
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {contacts.slice(0, 3).map((contact: Contact) => (
                      <div
                        key={contact.id}
                        className="border rounded-md p-3 flex items-center justify-between bg-white hover:shadow-md transition-shadow duration-300 transform hover:translate-y-[-2px]"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-[#0098d1]/10">
                            <AvatarImage src={contact.image} alt={contact.name} />
                            <AvatarFallback>{contact.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{contact.name}</p>
                            <p className="text-xs text-muted-foreground">{contact.position}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-[#0098d1] hover:text-[#0087ba] hover:bg-[#0098d1]/5"
                        >
                          <Link href={`/contacts/${contact.id}`}>
                            <User className="h-4 w-4 mr-2" />
                            Profil
                          </Link>
                        </Button>
                      </div>
                    ))}

                    {contacts.length === 0 && (
                      <div className="text-center py-6 bg-gray-50 rounded-lg">
                        <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Keine Kontakte verfügbar.</p>
                        <Button variant="outline" size="sm" className="mt-3">
                          <Plus className="h-4 w-4 mr-2" />
                          Kontakt hinzufügen
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Products and services */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium mb-3">Produkte & Dienstleistungen</h3>
                  {isEditing ? (
                    <Textarea
                      defaultValue={company.products?.join("\n") || ""}
                      placeholder="Ein Produkt oder eine Dienstleistung pro Zeile"
                      className="min-h-[100px]"
                    />
                  ) : (
                    <div className="space-y-2">
                      {company.products?.map((product: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 bg-white rounded-md hover:bg-[#0098d1]/5 transition-colors"
                        >
                          <div className="bg-[#0098d1]/10 rounded-full p-1">
                            <Check className="h-4 w-4 text-[#0098d1]" />
                          </div>
                          <span className="text-sm">{product}</span>
                        </div>
                      ))}

                      {(!company.products || company.products.length === 0) && (
                        <p className="text-sm text-muted-foreground">
                          Keine Produkte oder Dienstleistungen hinterlegt.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="contacts">
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#0098d1]" />
                    Kontakte bei {company.name}
                  </h3>
                  <Button className="bg-[#0098d1] hover:bg-[#0087ba]">
                    <Plus className="h-4 w-4 mr-2" />
                    Neuer Kontakt
                  </Button>
                </div>

                {contacts.length > 0 ? (
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Kontakt</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Aktionen</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contacts.map((contact: Contact) => (
                          <TableRow key={contact.id} className="hover:bg-gray-50/80">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 border-2 border-[#0098d1]/10">
                                  <AvatarImage src={contact.image} alt={contact.name} />
                                  <AvatarFallback>{contact.initials}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{contact.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{contact.position}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <a
                                  href={`mailto:${contact.email}`}
                                  className="text-sm flex items-center gap-1 text-blue-600 hover:underline"
                                >
                                  <Mail className="h-3 w-3" />
                                  {contact.email}
                                </a>
                                <a
                                  href={`tel:${contact.phone}`}
                                  className="text-sm flex items-center gap-1 text-blue-600 hover:underline"
                                >
                                  <Phone className="h-3 w-3" />
                                  {contact.phone}
                                </a>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  contact.status === "aktiv"
                                    ? "bg-green-100 text-green-800"
                                    : contact.status === "lead"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                }
                              >
                                {contact.status === "aktiv" ? "Aktiv" : contact.status === "lead" ? "Lead" : "Inaktiv"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="text-[#0098d1] hover:text-[#0087ba] hover:bg-[#0098d1]/5"
                              >
                                <Link href={`/contacts/${contact.id}`}>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Öffnen
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="border rounded-md p-8 text-center bg-gray-50">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">
                      Diesem Unternehmen sind noch keine Kontakte zugeordnet.
                    </p>
                    <Button className="bg-[#0098d1] hover:bg-[#0087ba]">
                      <Plus className="h-4 w-4 mr-2" />
                      Ersten Kontakt hinzufügen
                    </Button>
                  </div>
                )}
              </CardContent>
            </TabsContent>

            <TabsContent value="notes">
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-[#0098d1]" />
                    Notizen
                  </h3>
                  <Button className="bg-[#0098d1] hover:bg-[#0087ba]">
                    <Plus className="h-4 w-4 mr-2" />
                    Neue Notiz
                  </Button>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <Textarea placeholder="Notiz hinzufügen..." className="min-h-32 border-dashed" />
                </div>

                <div className="space-y-4">
                  <div className="border rounded-md p-4 bg-white hover:shadow-md transition-shadow duration-300 transform hover:translate-y-[-2px]">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/images/patrick-blanks.png" alt="Patrick Blanks" />
                          <AvatarFallback>PB</AvatarFallback>
                        </Avatar>
                        <p className="text-xs text-muted-foreground">15.04.2023 - Patrick Blanks</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:bg-red-50">
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm mt-3 leading-relaxed">
                      Der CIO hat Interesse an unserer ITK-Gesamtlösung. Sollen ein individuelles Angebot für die an
                      unserer ITK-Gesamtlösung. Sollen ein individuelles Angebot für die deutsche Niederlassung
                      erstellen.
                    </p>
                  </div>

                  <div className="border rounded-md p-4 bg-white hover:shadow-md transition-shadow duration-300 transform hover:translate-y-[-2px]">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/images/patrick-blanks.png" alt="Patrick Blanks" />
                          <AvatarFallback>PB</AvatarFallback>
                        </Avatar>
                        <p className="text-xs text-muted-foreground">02.03.2023 - Patrick Blanks</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:bg-red-50">
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm mt-3 leading-relaxed">
                      Teilnahme an der Roadshow in München bestätigt. Werden mit 3 IT-Entscheidern vor Ort sein.
                    </p>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="files">
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <File className="h-5 w-5 text-[#0098d1]" />
                    Dateien & Dokumente
                  </h3>
                  <Button className="bg-[#0098d1] hover:bg-[#0087ba]">
                    <Plus className="h-4 w-4 mr-2" />
                    Neue Datei
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4 bg-white hover:shadow-md transition-shadow duration-300 transform hover:translate-y-[-2px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-3 rounded-md">
                        <File className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Rahmenvertrag_2023.pdf</p>
                        <p className="text-xs text-muted-foreground">20.03.2023 • 3.7 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      Download
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="border rounded-md p-4 bg-white hover:shadow-md transition-shadow duration-300 transform hover:translate-y-[-2px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-3 rounded-md">
                        <File className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Unternehmenspräsentation.pdf</p>
                        <p className="text-xs text-muted-foreground">15.01.2023 • 8.2 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      Download
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="border rounded-md p-4 bg-white hover:shadow-md transition-shadow duration-300 transform hover:translate-y-[-2px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-3 rounded-md">
                        <File className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">IT_Strategie_2023.docx</p>
                        <p className="text-xs text-muted-foreground">10.01.2023 • 1.5 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      Download
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="border rounded-md p-4 bg-white hover:shadow-md transition-shadow duration-300 transform hover:translate-y-[-2px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-3 rounded-md">
                        <File className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Projektplan_Q2_2023.xlsx</p>
                        <p className="text-xs text-muted-foreground">05.04.2023 • 2.8 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      Download
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Enrichment Dialog */}
      <Dialog open={enrichmentOpen} onOpenChange={setEnrichmentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#0098d1]" />
              KI-Enrichment für {company?.name}
            </DialogTitle>
            <DialogDescription>Die KI hat zusätzliche Informationen zu diesem Unternehmen gefunden.</DialogDescription>
          </DialogHeader>

          {enrichmentLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-[#0098d1] animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Suche nach zusätzlichen Informationen...</p>
            </div>
          ) : enrichmentResults.length > 0 ? (
            <div className="py-4">
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">{enrichmentResults[currentEnrichmentIndex].field}</h3>

                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Aktueller Wert:</p>
                    <p className="text-sm">{enrichmentResults[currentEnrichmentIndex].currentValue}</p>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-blue-600 mb-1">Neuer Wert:</p>
                        <p className="text-sm font-medium">{enrichmentResults[currentEnrichmentIndex].newValue}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">KI-generiert</Badge>
                    </div>
                    {enrichmentResults[currentEnrichmentIndex].source && (
                      <div className="mt-2 flex items-center gap-2">
                        <Badge
                          className={`${
                            enrichmentResults[currentEnrichmentIndex].source.type === "Google"
                              ? "bg-blue-100 text-blue-800"
                              : enrichmentResults[currentEnrichmentIndex].source.type === "TrustedShops"
                                ? "bg-green-100 text-green-800"
                                : enrichmentResults[currentEnrichmentIndex].source.type === "GelbeSeiten"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : enrichmentResults[currentEnrichmentIndex].source.type === "Billiger.de"
                                    ? "bg-orange-100 text-orange-800"
                                    : enrichmentResults[currentEnrichmentIndex].source.type === "WLW"
                                      ? "bg-purple-100 text-purple-800"
                                      : enrichmentResults[currentEnrichmentIndex].source.type === "Vermittlung"
                                        ? "bg-indigo-100 text-indigo-800"
                                        : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {enrichmentResults[currentEnrichmentIndex].source.type}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Quelle: {enrichmentResults[currentEnrichmentIndex].source.name}
                          {enrichmentResults[currentEnrichmentIndex].source.date &&
                            ` (${enrichmentResults[currentEnrichmentIndex].source.date})`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 text-sm text-center text-muted-foreground">
                  {currentEnrichmentIndex + 1} von {enrichmentResults.length}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => applyEnrichment(currentEnrichmentIndex, false)}>
                  <X className="h-4 w-4 mr-2" />
                  Ablehnen
                </Button>
                <Button
                  className="bg-[#0098d1] hover:bg-[#0087ba]"
                  onClick={() => applyEnrichment(currentEnrichmentIndex, true)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Übernehmen
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-muted-foreground">Keine neuen Informationen gefunden.</p>
            </div>
          )}

          <DialogFooter className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Powered by OpenAI & Gemini</p>
            <Button variant="outline" onClick={() => setEnrichmentOpen(false)}>
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
