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
} from "@/components/ui/select"; // Import Select
import { Settings2, Upload, List, LayoutGrid, Filter } from 'lucide-react'; // Import icons
import Link from 'next/link';
import CompaniesTable from '@/components/ui/companies-table';
import { getCompanies, Company } from '@/lib/api';
import { ChangeEvent, useMemo } from 'react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
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
    const fetchCompanies = async () => {
      try {
        console.log("Fetching companies...");
        const data = await getCompanies();
        console.log("Companies fetched:", data);
        console.log("Number of companies:", data.length);
        if (data.length === 0) {
          console.warn("No companies found in database");
        }
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setCompanies([]); // Ensure empty array on error
      }
    };
    fetchCompanies();
  }, []);

  console.log("Current companies state:", companies);

  // Filter companies based on search term
  const filteredCompanies = useMemo(() => {
    if (!searchTerm) {
      return companies;
    }
    return companies.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.city && company.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.domain && company.domain.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.catchallEmailDomain && company.catchallEmailDomain.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.cleanedPhoneNumber && company.cleanedPhoneNumber.includes(searchTerm)) ||
      (company.countryName && company.countryName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.employeeEstimate && company.employeeEstimate.toString().includes(searchTerm)) ||
      (company.fullAddress && company.fullAddress.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.linkedinProfileUrl && company.linkedinProfileUrl.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.mainDomain && company.mainDomain.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.websiteUrl && company.websiteUrl.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [companies, searchTerm]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="space-y-4"> {/* Reduced spacing */}
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Menu</h1> {/* Adjusted size */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings2 className="mr-2 h-4 w-4" />
            Anpassen
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button size="sm" asChild>
            <Link href="/unternehmen/neu">Unternehmen hinzufügen</Link>
          </Button>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-between gap-2">
         <div className="flex items-center gap-2">
           {/* View Switcher Placeholder */}
           <Button variant="outline" size="icon" className="h-9 w-9">
             <List className="h-4 w-4" />
           </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
             <LayoutGrid className="h-4 w-4" />
           </Button>
           {/* Bulk Actions Dropdown */}
           <Select>
             <SelectTrigger className="w-[180px] h-9 text-sm">
               <SelectValue placeholder="Massenaktionen" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="delete">Ausgewählte löschen</SelectItem>
               {/* Add more bulk actions */}
             </SelectContent>
           </Select>
           {/* Kundenstatus Filter */}
<Select>
  <SelectTrigger className="w-full h-9 text-sm">
    <Filter className="mr-2 h-4 w-4" />
    <SelectValue placeholder="Kundenstatus filter" />
  </SelectTrigger>
  <SelectContent>
    {[
      "0 >> Problem Phase",
      "00 - Stop Contacting: Management has absolutely no interest.",
      "01 - No Interest: Currently no interest.",
      "02 - No Contact: Attempts to contact have received no response.",
      "03 - No Budget: Interest exists, but budget is lacking.",
      "04 - Relationship Canceled: Customer has ended the business relationship.",
      "1 >> Research Phase",
      "10 - Research: Potential customer identified; no contact made yet.",
      "11 - Initial Contact: First contact established; awaiting response.",
      "12 - New Approach: Contacting a new representative or decision-maker.",
      "2 >> Qualification Phase",
      "20 - Engagement: Started conversations to generate interest.",
      "21 - Needs Assessment: Analyzing the customer’s needs.",
      "22 - CEO Call Scheduled: Phone call with the CEO has been scheduled.",
      "23 - Webcast Scheduled: Webcast for initial presentation has been scheduled.",
      "24 - Demo: Creating an Demo or Presentation with screens.",
      "25 - New Demo Required: Additional webcast or demo needed.",
      "3 >> Presentation Phase",
      "30 - Solution Pitch: Demo must be presented!",
      "31 - Demo presented: Shown the demo!",
      "4 >> Integration Phase",
      "40 - Installing: plug-it or Landing Page or Data Connector.",
      "5 >> Offer Phase",
      "50 - Interest in Offer: Customer shows interest in a specific offer.",
      "51 - Offer Created and Sent: Offer has been created and sent.",
      "52 - Under Review: Offer is being reviewed by the decision-maker.",
      "53 - Negotiation: Customer requests changes; negotiations are underway.",
      "54 - Legal Review: GDPR and other legal aspects are being reviewed.",
      "6 >> Closing Phase",
      "60 - Order Received: Order is in; planning for onboarding.",
      "61 - Ongoing Support & Upselling: Identifying additional sales",
    ].map((status) => (
      <SelectItem key={status} value={status}>
        <Checkbox
          checked={selectedFilters.includes(status)}
          onChange={() => handleFilterChange(status)}
        />
        <span className="text-sm">{status}</span>
      </SelectItem>
    ))}
  </SelectContent>
</Select>

{/* Country Filter */}
<Select>
  <SelectTrigger className="w-full h-9 text-sm">
    <Filter className="mr-2 h-4 w-4" />
    <SelectValue placeholder="Country filter" />
  </SelectTrigger>
  <SelectContent>
    {["USA", "Germany", "France", "Italy", "Spain"].map((country) => (
      <SelectItem key={country} value={country}>
        <Checkbox
          checked={selectedFilters.includes(country)}
          onChange={() => handleFilterChange(country)}
        />
        <span className="text-sm">{country}</span>
      </SelectItem>
    ))}
  </SelectContent>
</Select>

{/* Account Owner Filter */}
<Select>
  <SelectTrigger className="w-full h-9 text-sm">
    <Filter className="mr-2 h-4 w-4" />
    <SelectValue placeholder="Account Owner filter" />
  </SelectTrigger>
  <SelectContent>
    {["Owner1", "Owner2", "Owner3"].map((owner) => (
      <SelectItem key={owner} value={owner}>
        <Checkbox
          checked={selectedFilters.includes(owner)}
          onChange={() => handleFilterChange(owner)}
        />
        <span className="text-sm">{owner}</span>
      </SelectItem>
    ))}
  </SelectContent>
</Select>

{/* Category Filter */}
<Select>
  <SelectTrigger className="w-full h-9 text-sm">
    <Filter className="mr-2 h-4 w-4" />
    <SelectValue placeholder="Category filter" />
  </SelectTrigger>
  <SelectContent>
    {["Category1", "Category2", "Category3"].map((category) => (
      <SelectItem key={category} value={category}>
        <Checkbox
          checked={selectedFilters.includes(category)}
          onChange={() => handleFilterChange(category)}
        />
        <span className="text-sm">{category}</span>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
         </div>
         {/* Search Input */}
         <Input
            placeholder="Search..."
            className="max-w-xs h-9"
            value={searchTerm}
            onChange={handleSearchChange}
            list="autocomplete-options"
          />
          <datalist id="autocomplete-options">
            {companies.map((company) => (
              <option key={company.id} value={company.name} />
            ))}
          </datalist>
      </div>


      {/* Table Card */}
      <Card>
        {/* Removed CardHeader as controls are now outside */}
        <CardContent className="pt-4"> {/* Added padding top */}
          <Suspense fallback={<div className="p-4 text-center text-lg font-bold text-red-500">Loading companies...</div>}>
            {companies.length > 0 ? (
              <CompaniesTable companies={companies} />
            ) : (
              <div className="p-4 text-center text-lg font-bold text-red-500">
                No companies found. Please check the database connection.
              </div>
            )}
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
