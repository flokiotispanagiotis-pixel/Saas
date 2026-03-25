import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest, requireRole } from '@/lib/permissions';

export async function GET() {
  const purchases = await prisma.purchase.findMany({
    include: { supplier: true, items: { include: { product: true } } },
    orderBy: { date: 'desc' }
  });
  return NextResponse.json(purchases);
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  requireRole(user, ['ADMIN']); // μόνο admin για αγορές, αν θες μπορείς να χαλαρώσεις

  const body = await req.json();
  const { supplierId, date, invoice_number, items } = body;

  const result = await prisma.$transaction(async (tx) => {
    const purchase = await tx.purchase.create({
      data: {
        supplierId,
        date: new Date(date),
        invoice_number,
        total_amount: items.reduce((s: number, it: any) => s + it.subtotal, 0)
      }
    });

    for (const it of items) {
      await tx.purchaseItem.create({
        data: {
          purchaseId: purchase.id,
          productId: it.productId,
          qty: it.qty,
          price: it.price,
          subtotal: it.subtotal
        }
      });

      // Increase stock
      await tx.product.update({
        where: { id: it.productId },
        data: { stock_qty: { increment: it.qty } }
      });

      // StockMovement
      await tx.stockMovement.create({
        data: {
          productId: it.productId,
          type: 'PURCHASE',
          qty: it.qty,
          reference_id: purchase.id
        }
      });
    }

    return purchase;
  });

  return NextResponse.json(result, { status: 201 });
}
