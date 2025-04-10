import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Contact } from "@/lib/data/contacts";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

type SortColumn = keyof Contact | null;
type SortDirection = "asc" | "desc";

interface ContactsTableProps {
  contacts?: Contact[];
}

export default function ContactsTable({ contacts = [] }: ContactsTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedContacts = useMemo(() => {
    if (!sortColumn) return contacts;

    return [...contacts].sort((a, b) => {
      const aValue = String(a[sortColumn] ?? '').toLowerCase();
      const bValue = String(b[sortColumn] ?? '').toLowerCase();

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [contacts, sortColumn, sortDirection]);

  const filteredContacts = useMemo(() => {
    if (!searchTerm) return sortedContacts;
    return sortedContacts.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedContacts, searchTerm]);

  const renderSortArrow = (column: SortColumn) => {
    if (sortColumn !== column) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  const getStatusBadgeVariant = (status: Contact['status']) => {
    switch (status) {
      case 'aktiv': return 'default';
      case 'lead': return 'secondary';
      case 'inaktiv': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-2 py-1 w-full max-w-md"
        />
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("name")} className="px-0 hover:bg-transparent">
                Name
                {renderSortArrow("name")}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("position")} className="px-0 hover:bg-transparent">
                Position
                {renderSortArrow("position")}
              </Button>
            </TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("status")} className="px-0 hover:bg-transparent">
                Status
                {renderSortArrow("status")}
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    {contact.image ? (
                      <AvatarImage src={contact.image} alt={contact.name} />
                    ) : (
                      <AvatarFallback>{contact.initials}</AvatarFallback>
                    )}
                  </Avatar>
                  <span>{contact.name}</span>
                </div>
              </TableCell>
              <TableCell>{contact.position}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 hover:underline">
                    {contact.email}
                  </a>
                  <a href={`tel:${contact.phone}`} className="text-sm text-blue-600 hover:underline">
                    {contact.phone}
                  </a>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(contact.status)}>
                  {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="destructive" size="sm">Delete</Button>
                <Link href={`/kontakte/${contact.id}`} passHref>
                  <Button variant="outline" size="sm">More</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
