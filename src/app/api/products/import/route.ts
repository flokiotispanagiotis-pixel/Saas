import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, requireRole } from '@/lib/permissions';
import { prisma } from '@/lib/db';
import { parseCsv } from '@/lib/csv';

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  requireRole(user, ['ADMIN']);

  const text = await req.text();
  const rows = parseCsv(text);

  for (const row of rows) {
    await prisma.product.upsert({
      where: { sku: row.sku },
      update: {
        name: row.name,
        category: row.category,
        description: row.description,
        cost_price: parseFloat(row.cost_price),
        sell_price: parseFloat(row.sell_price),
        stock_qty: parseInt(row.stock_qty || '0', 10),
        min_stock: parseInt(row.min_stock || '0', 10),
        image: row.image || null
      },
      create: {
        name: row.name,
        sku: row.sku,
        category: row.category,
        description: row.description,
        cost_price: parseFloat(row.cost_price),
        sell_price: parseFloat(row.sell_price),
        stock_qty: parseInt(row.stock_qty || '0', 10),
        min_stock: parseInt(row.min_stock || '0', 10),
        image: row.image || null
      }
    });
  }

  return NextResponse.json({ status: 'ok' });
}
