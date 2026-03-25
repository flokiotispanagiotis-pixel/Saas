import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, requireRole } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { generateInvoicePdf } from '@/lib/pdf';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  requireRole(user, ['ADMIN']); // μόνο admin για re-generate

  const { saleId } = await req.json();
  const buffer = await generateInvoicePdf(saleId);

  const invoicePath = `/invoices/invoice-${saleId}.pdf`;
  const fullPath = path.join(process.cwd(), 'public', invoicePath);
  fs.writeFileSync(fullPath, buffer);

  await prisma.sales.update({
    where: { id: saleId },
    data: { pdf_url: invoicePath }
  });

  return NextResponse.json({ pdf_url: invoicePath });
}
