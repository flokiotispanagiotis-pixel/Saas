import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest, requireRole } from '@/lib/permissions';

export async function GET() {
  const settings = await prisma.companySettings.findFirst();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const user = getUserFromRequest(req);
  requireRole(user, ['ADMIN']);

  const body = await req.json();
  const existing = await prisma.companySettings.findFirst();

  const data = {
    business_name: body.business_name,
    address: body.address,
    phone: body.phone,
    email: body.email,
    vat_number: body.vat_number,
    tax_office: body.tax_office,
    logo: body.logo,
    invoice_notes: body.invoice_notes
  };

  const settings = existing
    ? await prisma.companySettings.update({ where: { id: existing.id }, data })
    : await prisma.companySettings.create({ data });

  return NextResponse.json(settings);
}
