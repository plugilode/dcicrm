"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCompanyById } from '@/lib/api';
import CompanyDetails from '@/components/ui/company-details';
import { Company } from '@/lib/api';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const data = await getCompanyById(id as string);
        setCompany(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground text-red-500">{error}</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Company not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <CompanyDetails companyId={id as string} />
    </div>
  );
}
