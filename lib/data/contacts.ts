export interface Contact {
  id: string
  companyId: string
  name: string
  position: string
  email: string
  phone: string
  image?: string
  initials: string
  status: 'aktiv' | 'lead' | 'inaktiv'
}

export function getContactsByCompanyId(companyId: string): Contact[] {
  // Mock implementation - replace with actual database call
  return [
    {
      id: '1',
      companyId,
      name: 'John Doe',
      position: 'CEO',
      email: 'john@example.com',
      phone: '+49 30 12345678',
      initials: 'JD',
      status: 'aktiv'
    },
    {
      id: '2',
      companyId,
      name: 'Jane Smith',
      position: 'CTO',
      email: 'jane@example.com',
      phone: '+49 30 87654321',
      initials: 'JS',
      status: 'aktiv'
    }
  ]
}

export function getContactById(id: string): Contact | undefined {
  // Mock implementation - replace with actual database call
  const allContacts: Contact[] = [
    {
      id: '1',
      companyId: '1',
      name: 'John Doe',
      position: 'CEO',
      email: 'john@example.com',
      phone: '+49 30 12345678',
      initials: 'JD',
      status: 'aktiv'
    },
    {
      id: '2',
      companyId: '1',
      name: 'Jane Smith',
      position: 'CTO',
      email: 'jane@example.com',
      phone: '+49 30 87654321',
      initials: 'JS',
      status: 'aktiv'
    }
  ]
  return allContacts.find(contact => contact.id === id)
}
