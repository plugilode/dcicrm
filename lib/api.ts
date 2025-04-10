export interface Company {
  id: string;
  name: string;
  logo_url?: string;
  city?: string;
  source_of_lead?: string;
  domain?: string;
  employee_range?: string;
  categories?: string[];
  industry?: string;
  address?: string;
  contact_email?: string;
  revenue?: number;
  active?: boolean;
  catchallEmailDomain?: string;
  cleanedPhoneNumber?: string;
  additionalIndustries?: string[];
  alexaRank?: number;
  angelListProfileUrl?: string;
  blogUrl?: string;
  businessIndustries?: string[];
  countryName?: string;
  crunchbaseUrl?: string;
  employeeEstimate?: number;
  facebookProfileUrl?: string;
  fullAddress?: string;
  linkedinId?: string;
  linkedinProfileUrl?: string;
  mainDomain?: string;
  mainPhoneCleanedNumber?: string;
  mainPhoneNumber?: string;
  mainPhoneSource?: string;
  searchKeywords?: string[];
  spokenLanguages?: string[];
  stateName?: string;
  stockExchange?: string;
  stockSymbol?: string;
  storeCount?: number;
  twitterProfileUrl?: string;
  websiteUrl?: string;
  yearFounded?: number;
  zipCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
  foundation_date?: number | null; // Added foundation_date property
}

export async function getCompanies(): Promise<Company[]> {
  console.log("Fetching companies from API");
  const response = await fetch('/api/unternehmen');
  console.log("Response status:", response.status);
  if (!response.ok) {
    throw new Error('Fehler beim Laden der Unternehmen')
  }
  return response.json()
}
