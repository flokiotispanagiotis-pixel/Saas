import { prisma } from './db';
import dayjs from 'dayjs';

export async function getMonthlySales() {
  const sales = await prisma.sales.groupBy({
    by: ['date'],
    _sum: { total_amount: true }
  });

  const map = new Map<string, number>();
  sales.forEach((s) => {
    const month = dayjs(s.date).format('YYYY-MM');
    map.set(month, (map.get(month) || 0) + (s._sum.total_amount || 0));
  });

  return Array.from(map.entries()).map(([month, total]) => ({ month, total }));
}

export async function getMonthlyProfit() {
  const items = await prisma.saleItem.findMany({
    include: { product: true, sale: true }
  });

  const map = new Map<string, number>();
  items.forEach((it) => {
    const month = dayjs(it.sale.date).format('YYYY-MM');
    const profitPerUnit = it.price - it.product.cost_price;
    const profit = profitPerUnit * it.qty;
    map.set(month, (map.get(month) || 0) + profit);
  });

  return Array.from(map.entries()).map(([month, profit]) => ({ month, profit }));
}

export async function getTopProducts(limit = 10) {
  const items = await prisma.saleItem.groupBy({
    by: ['productId'],
    _sum: { qty: true }
  });

  const withProducts = await Promise.all(
    items.map(async (i) => ({
      product: await prisma.product.findUnique({ where: { id: i.productId } }),
      qty: i._sum.qty || 0
    }))
  );

  return withProducts
    .filter((x) => x.product)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, limit);
}

export async function getLowStock() {
  return prisma.product.findMany({
    where: {
      stock_qty: { lte: prisma.product.fields.min_stock }
    }
  });
}

export async function getInventoryValue() {
  const products = await prisma.product.findMany();
  return products.reduce((sum, p) => sum + p.stock_qty * p.cost_price, 0);
}

export async function getSalesSummary() {
  const now = dayjs();
  const startOfToday = now.startOf('day').toDate();
  const startOfWeek = now.startOf('week').toDate();
  const startOfMonth = now.startOf('month').toDate();

  const [today, week, month] = await Promise.all([
    prisma.sales.aggregate({
      _sum: { total_amount: true },
      where: { date: { gte: startOfToday } }
    }),
    prisma.sales.aggregate({
      _sum: { total_amount: true },
      where: { date: { gte: startOfWeek } }
    }),
    prisma.sales.aggregate({
      _sum: { total_amount: true },
      where: { date: { gte: startOfMonth } }
    })
  ]);

  return {
    today: today._sum.total_amount || 0,
    week: week._sum.total_amount || 0,
    month: month._sum.total_amount || 0
  };
}

export async function getRecentStockMovements() {
  return prisma.stockMovement.findMany({
    include: { product: true },
    orderBy: { date: 'desc' },
    take: 20
  });
}
