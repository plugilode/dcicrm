import { NextResponse } from 'next/server';
import { query } from '@/config.js';
import { Company } from '@/lib/api';

export async function GET() {
  console.log("Received request for companies");
  try {
    console.log("Querying database for companies");
    const result = await query('SELECT * FROM companies ORDER BY created_at DESC');
    const companies = result.rows.map((company: Company) => ({
      id: company.id,
      name: company.name,
      logo_url: company.logo_url || '/placeholder-logo.svg',
      city: company.city || 'N/A',
      foundation_date: company.foundation_date || null,
      domain: company.domain || 'N/A',
      employee_range: company.employee_range || '1-10',
      categories: company.categories || [],
      industry: company.industry || 'N/A',
      address: company.address || 'N/A',
      contact_email: company.contact_email || 'N/A',
      revenue: company.revenue || 0,
      active: company.active || true,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    }));
    return NextResponse.json(companies);
  } catch (error: any) {
    console.error("Database error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { name, industry, address, contact_email } = await request.json();
  try {
    const result = await query(
      'INSERT INTO companies (name, industry, address, contact_email) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, industry, address, contact_email]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
