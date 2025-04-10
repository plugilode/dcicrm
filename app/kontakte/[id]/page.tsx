"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  AtSign,
  Edit,
  Mail,
  Phone,
  Save,
  Trash,
  User,
  Loader2,
  XIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getContactById } from "@/lib/data/contacts"

export default function ContactDetail({ params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const contact = getContactById(params.id)

  if (!contact) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Kontakt nicht gefunden</p>
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

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0098d1] to-[#00b2f5] p-8 mb-8">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              size="icon"
              asChild
              className="bg-white/20 border-white/40 text-white hover:bg-white/30"
            >
              <Link href="/kontakte">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">{contact.name}</h1>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  {contact.position}
                </Badge>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Contact info */}
        <Card className="lg:col-span-1 overflow-hidden border-none shadow-lg">
          <CardHeader className="p-6 pb-2">
            <div className="flex flex-col items-center text-center">
              <div className="h-28 w-28 bg-white rounded-full p-3 border mb-4 flex items-center justify-center shadow-md">
                <Avatar className="h-20 w-20">
                  {contact.image ? (
                    <AvatarImage src={contact.image} alt={contact.name} />
                  ) : (
                    <AvatarFallback>{contact.initials}</AvatarFallback>
                  )}
                </Avatar>
              </div>
              <CardTitle className="text-xl">{contact.name}</CardTitle>
              <Badge className="mt-3 mb-1 px-3 py-1 text-sm">
                {contact.status === "aktiv" ? "Aktiv" : contact.status === "lead" ? "Lead" : "Inaktiv"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-[#0098d1]" />
                Kontaktinformationen
              </h3>
              <div className="space-y-3 pl-6">
                {isEditing ? (
                  <>
                    <div className="space-y-1">
                      <Label htmlFor="position">Position</Label>
                      <Input id="position" defaultValue={contact.position} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">E-Mail</Label>
                      <Input id="email" defaultValue={contact.email} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input id="phone" defaultValue={contact.phone} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Position:</span> {contact.position}
                    </div>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {contact.email}
                    </a>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-sm flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      {contact.phone}
                    </a>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right column - Notes and Activity */}
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-lg">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-lg">Notizen & Aktivitäten</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isEditing ? (
              <Textarea placeholder="Notizen hinzufügen..." className="min-h-32" />
            ) : (
              <div className="text-sm text-muted-foreground">
                Keine Notizen vorhanden.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
