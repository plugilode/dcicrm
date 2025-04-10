export interface Company {
  id: string
  name: string
  industry: string
  type: 'kunde' | 'partner' | 'prospect'
  address: string
  zip: string
  city: string
  country: string
  website: string
  email: string
  phone: string
  employees: number
  revenue?: string
  foundedYear?: string
  description: string
  products?: string[]
  socialMedia?: {
    linkedin?: string
    twitter?: string
    facebook?: string
    xing?: string
  }
}

export async function getCompanyById(id: string): Promise<Company | null> {
  try {
    const res = await fetch(`/api/unternehmen/${id}`);
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      industry: data.industry,
      type: 'kunde', // default type if not provided by API
      address: data.address,
      zip: '', // not provided by API
      city: data.city,
      country: '', // not provided by API
      website: data.domain,
      email: data.contact_email,
      phone: '', // not provided by API
      employees: 0, // not provided by API
      revenue: data.revenue,
      foundedYear: data.foundation_date ? new Date(data.foundation_date).getFullYear().toString() : '',
      description: '', // not provided by API
      products: Array.isArray(data.categories) ? data.categories : [],
      socialMedia: {}
    };
  } catch (error) {
    console.error("Failed to fetch company data:", error);
    return null;
  }
}
