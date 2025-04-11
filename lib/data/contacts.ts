export type ContactRole = "Entscheider" | "Mitarbeiter" | "Projektleiter" | "IT-Verantwortlicher" | "Einkauf"
export type ContactStatus = "aktiv" | "inaktiv" | "lead"

export interface Contact {
  id: string
  companyId: string
  name: string
  position: string
  email: string
  phone: string
  image?: string
  initials: string
  role: ContactRole
  status: ContactStatus
  lastContact?: string
  notes?: string
}

export interface AssignedEmployee {
  id: string
  name: string
  role: "Account Manager" | "Sales" | "Technical Account Manager" | "Support"
  email: string
  phone: string
  image?: string
  initials: string
}

const employees: AssignedEmployee[] = [
  {
    id: "emp1",
    name: "Patrick Blanks",
    role: "Account Manager",
    email: "patrick.blanks@company.com",
    phone: "+49 176 1234567",
    image: "/images/patrick-blanks.png",
    initials: "PB"
  },
  // Add more employees as needed
]

const contacts: Contact[] = [
  {
    id: "c1",
    companyId: "swisscom",
    name: "Thomas Müller",
    position: "CIO",
    email: "thomas.mueller@swisscom.com",
    phone: "+41 58 221 99 11",
    initials: "TM",
    role: "Entscheider",
    status: "aktiv",
    lastContact: "2024-01-15"
  },
  {
    id: "c2",
    companyId: "swisscom",
    name: "Sarah Weber",
    position: "IT Project Manager",
    email: "sarah.weber@swisscom.com",
    phone: "+41 58 221 99 12",
    initials: "SW",
    role: "Projektleiter",
    status: "aktiv",
    lastContact: "2024-01-20"
  }
]

export const getContactsByCompanyId = (companyId: string): Contact[] => {
  return contacts.filter(contact => contact.companyId === companyId)
}

export const getAssignedEmployee = (companyId: string): AssignedEmployee | undefined => {
  // In a real app, this would come from your database
  // For now, we'll just return Patrick as the assigned employee for demonstration
  return employees[0]
}
