"use client";

import { Suspense, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings2, Upload, List, LayoutGrid, Filter, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { ContactsTable } from '@/components/ui/contacts-table';
import { ChangeEvent } from 'react';

// Mock data fetching function - replace with actual API call
const getContacts = async () => {
  return [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@dcimedia.ag",
      company: "DCI Media AG",
      position: "CEO",
      phone: "+49 30 123456",
      lastContact: "2025-04-01",
    },
    {
      id: "2",
      name: "Anna Schmidt",
      email: "anna.schmidt@example.com",
      company: "Example GmbH",
      position: "Marketing Director",
      phone: "+49 30 789012",
      lastContact: "2025-03-15",
    },
    {
      id: "3",
      name: "Michael Müller",
      email: "michael.mueller@techcorp.de",
      company: "TechCorp",
      position: "CTO",
      phone: "+49 30 345678",
      lastContact: "2025-04-05",
    }
  ];
};

// Define contact type
type Contact = {
  id: string;
  name: string;
  email: string;
  company: string;
  position: string;
  phone: string;
  lastContact: string;
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilterChange = (value: string) => {
    setSelectedFilters((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getContacts();
        setContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setContacts([]);
      }
    };
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="space-y-4">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings2 className="mr-2 h-4 w-4" />
            Customize
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button size="sm" asChild>
            <Link href="/kontakte/neu">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Contact
            </Link>
          </Button>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* View Switcher */}
          <Button variant="outline" size="icon" className="h-9 w-9">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
            <LayoutGrid className="h-4 w-4" />
          </Button>
          
          {/* Bulk Actions */}
          <Select>
            <SelectTrigger className="w-[180px] h-9 text-sm">
              <SelectValue placeholder="Bulk Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delete">Delete Selected</SelectItem>
              <SelectItem value="export">Export Selected</SelectItem>
              <SelectItem value="tag">Add Tag</SelectItem>
              <SelectItem value="assign">Assign To</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Position Filter */}
          <Select>
            <SelectTrigger className="w-full h-9 text-sm">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              {["CEO", "CTO", "CFO", "COO", "Marketing Director", "Sales Manager", "Developer", "Designer"].map((position) => (
                <SelectItem key={position} value={position}>
                  <Checkbox
                    checked={selectedFilters.includes(position)}
                    onChange={() => handleFilterChange(position)}
                  />
                  <span className="text-sm ml-2">{position}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Company Filter */}
          <Select>
            <SelectTrigger className="w-full h-9 text-sm">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              {["DCI Media AG", "Example GmbH", "TechCorp", "Digital Solutions", "EuroTech"].map((company) => (
                <SelectItem key={company} value={company}>
                  <Checkbox
                    checked={selectedFilters.includes(company)}
                    onChange={() => handleFilterChange(company)}
                  />
                  <span className="text-sm ml-2">{company}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Last Contact Filter */}
          <Select>
            <SelectTrigger className="w-full h-9 text-sm">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Last Contact" />
            </SelectTrigger>
            <SelectContent>
              {["Today", "Last 7 Days", "Last 30 Days", "Last Quarter", "Last Year"].map((period) => (
                <SelectItem key={period} value={period}>
                  <Checkbox
                    checked={selectedFilters.includes(period)}
                    onChange={() => handleFilterChange(period)}
                  />
                  <span className="text-sm ml-2">{period}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Search Input */}
        <Input
          placeholder="Search contacts..."
          className="max-w-xs h-9"
          value={searchTerm}
          onChange={handleSearchChange}
          list="contact-autocomplete-options"
        />
        <datalist id="contact-autocomplete-options">
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.name} />
          ))}
        </datalist>
      </div>

      {/* Table Card */}
      <Card>
        <CardContent className="pt-4">
          <Suspense fallback={<div className="p-4 text-center text-lg font-bold text-muted">Loading contacts...</div>}>
            <ContactsTable contacts={filteredContacts} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
