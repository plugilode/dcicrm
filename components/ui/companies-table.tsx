import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Company, getCompanies } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect, useRef } from "react";
import Loader from "@/components/ui/loader"; // Correct import statement
import { ArrowUpDown } from "lucide-react";

type SortColumn = keyof Company | null;
type SortDirection = "asc" | "desc";

interface CompaniesTableProps {
  companies?: Company[];
}

export default function CompaniesTable({ companies = [] }: CompaniesTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>("name");
  const [options, setOptions] = useState<Company[]>([]);

  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleInputChange = (field: keyof Company, value: string | string[]) => {
    if (selectedCompany) {
      setSelectedCompany({
        ...selectedCompany,
        [field]: value,
      });
    }
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedCompanies = useMemo(() => {
    if (!sortColumn) return companies;

    return [...companies].sort((a, b) => {
      // Ensure a and b are valid objects and sortColumn is valid before accessing properties
      if (!a || !b || !sortColumn) return 0; 
      
      let aValue = a[sortColumn] ?? ''; 
      let bValue = b[sortColumn] ?? '';

      // Handle specific column types for proper sorting
      if (sortColumn === 'source_of_lead') {
        // Check if values are valid for Date constructor before parsing
        const isValidDateString = (val: any): val is string | number | Date => 
          typeof val === 'string' || typeof val === 'number' || val instanceof Date;

        if (isValidDateString(aValue) && isValidDateString(bValue)) {
          const dateA = new Date(aValue).getTime();
          const dateB = new Date(bValue).getTime();
          
          // Check if parsing resulted in valid dates
          if (!isNaN(dateA) && !isNaN(dateB)) {
            return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
          }
        }
        // Fallback to string comparison if values are not valid dates or parsing failed
        aValue = String(aValue ?? '').toLowerCase();
        bValue = String(bValue ?? '').toLowerCase();
        // Removed the misplaced 'else' block here
      } else {
         // Default to case-insensitive string comparison for other columns
         aValue = String(aValue ?? '').toLowerCase(); // Ensure null/undefined check here too
         bValue = String(bValue ?? '').toLowerCase(); // Ensure null/undefined check here too
      }

      // Comparison logic for strings (or failed date parse)
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [companies, sortColumn, sortDirection]);

  const renderSortArrow = (column: SortColumn) => {
    if (sortColumn !== column) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    return sortDirection === "asc" ? 
      <ArrowUpDown className="ml-2 h-4 w-4" /> : // Replace with specific up/down arrows later if needed
      <ArrowUpDown className="ml-2 h-4 w-4" />; 
  };


  return (
    <div>
    <div className="flex items-center space-x-2"> 
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <Button variant="outline" size="sm" onClick={() => searchInputRef.current?.focus()}>Search</Button>
    </div>
    <Table>
      <TableHeader>
        <TableRow><TableHead>
          <select onChange={(e) => handleSort(e.target.value as SortColumn)} className="px-0 hover:bg-transparent">
            <option value="name">Company</option>
            <option value="city">City</option>
            <option value="source_of_lead">Source of Lead</option>
            <option value="domain">Domains</option>
            <option value="employee_range">Employee range</option>
            <option value="employee_range">Employee range</option>
            <option value="countryName">Country</option>
            <option value="fullAddress">Full Address</option>
            <option value="categories">Categories</option>
          </select>
        </TableHead><TableHead>
          <Button variant="ghost" onClick={() => handleSort("city")} className="px-0 hover:bg-transparent">
            City
            {renderSortArrow("city")}
          </Button>
        </TableHead><TableHead>
          <Button variant="ghost" onClick={() => handleSort("source_of_lead")} className="px-0 hover:bg-transparent">
            Source of Lead
            {renderSortArrow("source_of_lead")}
          </Button>
        </TableHead><TableHead>
          <Button variant="ghost" onClick={() => handleSort("domain")} className="px-0 hover:bg-transparent">
            Domains
            {renderSortArrow("domain")}
          </Button>
        </TableHead><TableHead>
          <Button variant="ghost" onClick={() => handleSort("employee_range")} className="px-0 hover:bg-transparent">
            Employee range
            {renderSortArrow("employee_range")}
          </Button>
        </TableHead>
        <TableHead>
          <Button variant="ghost" onClick={() => handleSort("countryName")} className="px-0 hover:bg-transparent">
            Country
            {renderSortArrow("countryName")}
          </Button>
        </TableHead>
        <TableHead>
          <Button variant="ghost" onClick={() => handleSort("fullAddress")} className="px-0 hover:bg-transparent">
            Full Address
            {renderSortArrow("fullAddress")}
          </Button>
        </TableHead>
        <TableHead>Categories</TableHead>
        <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedCompanies.map((company) => (
          <TableRow key={company.id}>
<TableCell className="font-medium py-2 px-3"><div className="flex items-center space-x-2"><Avatar className="h-5 w-5"><AvatarImage src={company.logo_url} alt={company.name} /></Avatar><span>{company.name}</span></div></TableCell><TableCell className="py-2 px-3">{company.city}</TableCell><TableCell className="py-2 px-3">{company.source_of_lead}</TableCell><TableCell className="py-2 px-3">{company.employee_range}</TableCell><TableCell className="py-2 px-3">{company.countryName}</TableCell><TableCell className="py-2 px-3">{company.fullAddress}</TableCell><TableCell className="py-2 px-3"><a href={company.websiteUrl} target="_blank" rel="noopener noreferrer">{company.websiteUrl}</a></TableCell><TableCell className="py-2 px-3"><div className="flex flex-wrap gap-1">{company.categories?.map((category) => (<Badge key={category} variant="secondary" className="px-1.5 py-0.5 text-xs">{category}</Badge>))}</div></TableCell><TableCell className="text-right space-x-1 py-2 px-3">
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" size="sm" onClick={() => setSelectedCompany(company)}>Edit</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Company</DialogTitle>
      </DialogHeader>
      <form>
        <div>
          <label>Company Name</label>
          <input type="text" value={selectedCompany?.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} />
        </div>
        <div>
          <label>City</label>
          <input type="text" value={selectedCompany?.city || ''} onChange={(e) => handleInputChange('city', e.target.value)} />
        </div>
        <div>
          <label>Source of Lead</label>
          <input type="text" value={selectedCompany?.source_of_lead || ''} onChange={(e) => handleInputChange('source_of_lead', e.target.value)} />
        </div>
        <div>
          <label>Domains</label>
          <input type="text" value={selectedCompany?.domain || ''} onChange={(e) => handleInputChange('domain', e.target.value)} />
        </div>
        <div>
          <label>Employee Range</label>
          <input type="text" value={selectedCompany?.employee_range || ''} onChange={(e) => handleInputChange('employee_range', e.target.value)} />
        </div>
        <div>
          <label>Country</label>
          <input type="text" value={selectedCompany?.countryName || ''} onChange={(e) => handleInputChange('countryName', e.target.value)} />
        </div>
        <div>
          <label>Full Address</label>
          <input type="text" value={selectedCompany?.fullAddress || ''} onChange={(e) => handleInputChange('fullAddress', e.target.value)} />
        </div>
        <div>
          <label>Categories</label>
          <input type="text" value={selectedCompany?.categories?.join(', ') || ''} onChange={(e) => handleInputChange('categories', e.target.value.split(', '))} />
        </div>
        <Button type="submit">Save</Button>
      </form>
    </DialogContent>
  </Dialog>
  <Button variant="destructive" size="sm">Delete</Button>
</TableCell>
          </TableRow>
        ))}
      </TableBody>
      </Table>
    </div>
  );
}
