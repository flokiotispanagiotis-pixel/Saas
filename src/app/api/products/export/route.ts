import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { toCsv } from '@/lib/csv';

export async function GET() {
  const products = await prisma.product.findMany();
  const rows = products.map((p) => ({
    name: p.name,
    sku: p.sku,
    category: p.category || '',
    description: p.description || '',
    cost_price: p.cost_price,
    sell_price: p.sell_price,
    stock_qty: p.stock_qty,
    min_stock: p.min_stock,
    image: p.image || ''
  }));

  const csv = toCsv(rows);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="products.csv"'
    }
  });
}
