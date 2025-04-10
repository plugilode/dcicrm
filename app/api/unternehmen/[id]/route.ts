import { NextResponse } from 'next/server';
import { query } from '@/config.js';
import { Company } from '@/lib/api';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await query('SELECT * FROM companies WHERE id = $1', [params.id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    const company = result.rows[0];
    return NextResponse.json({
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
    });
  } catch (error: any) {
    console.error("Database error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
