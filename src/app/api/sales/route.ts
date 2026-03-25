import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest, requireRole } from '@/lib/permissions';
import { generateInvoicePdf, generateDeliveryNotePdf } from '@/lib/pdf';

export async function GET() {
  const sales = await prisma.sales.findMany({
    include: { customer: true, items: { include: { product: true } } },
    orderBy: { date: 'desc' }
  });
  return NextResponse.json(sales);
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  requireRole(user, ['ADMIN', 'STAFF']); // Staff μπορεί να κάνει πωλήσεις

  const body = await req.json();
  const { customerId, date, invoice_number, payment_method, items } = body;

  const result = await prisma.$transaction(async (tx) => {
    const sale = await tx.sales.create({
      data: {
        customerId,
        date: new Date(date),
        invoice_number,
        payment_method,
        total_amount: items.reduce((s: number, it: any) => s + it.subtotal, 0)
      }
    });

    for (const it of items) {
      await tx.saleItem.create({
        data: {
          saleId: sale.id,
          productId: it.productId,
          qty: it.qty,
          price: it.price,
          subtotal: it.subtotal
        }
      });

      // Decrease stock
      await tx.product.update({
        where: { id: it.productId },
        data: { stock_qty: { decrement: it.qty } }
      });

      // StockMovement
      await tx.stockMovement.create({
        data: {
          productId: it.productId,
          type: 'SALE',
          qty: it.qty,
          reference_id: sale.id
        }
      });
    }

    // Generate PDFs (μπορείς να τα σώσεις σε S3 ή local /public)
    const invoiceBuffer = await generateInvoicePdf(sale.id);
    const deliveryBuffer = await generateDeliveryNotePdf(sale.id);

    const invoicePath = `/invoices/invoice-${sale.id}.pdf`;
    const deliveryPath = `/delivery-notes/dn-${sale.id}.pdf`;

    // εδώ απλά demo: θα χρειαστείς fs writeFile σε server περιβάλλον
    const fs = await import('fs');
    const path = await import('path');
    const invoicesDir = path.join(process.cwd(), 'public', 'invoices');
    const dnDir = path.join(process.cwd(), 'public', 'delivery-notes');
    if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir, { recursive: true });
    if (!fs.existsSync(dnDir)) fs.mkdirSync(dnDir, { recursive: true });

    fs.writeFileSync(path.join(process.cwd(), 'public', invoicePath), invoiceBuffer);
    fs.writeFileSync(path.join(process.cwd(), 'public', deliveryPath), deliveryBuffer);

    const updated = await tx.sales.update({
      where: { id: sale.id },
      data: {
        pdf_url: invoicePath,
        delivery_note_pdf: deliveryPath
      }
    });

    return updated;
  });

  return NextResponse.json(result, { status: 201 });
}
