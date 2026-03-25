import { Suspense } from 'react';

async function fetchKpis() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/kpis`, {
    cache: 'no-store'
  });
  return res.json();
}

export default async function DashboardPage() {
  const data = await fetchKpis();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 border rounded">
          <div className="text-sm text-gray-500">Sales Today</div>
          <div className="text-2xl font-bold">{data.salesSummary.today.toFixed(2)} €</div>
        </div>
        <div className="p-3 border rounded">
          <div className="text-sm text-gray-500">This Week</div>
          <div className="text-2xl font-bold">{data.salesSummary.week.toFixed(2)} €</div>
        </div>
        <div className="p-3 border rounded">
          <div className="text-sm text-gray-500">This Month</div>
          <div className="text-2xl font-bold">{data.salesSummary.month.toFixed(2)} €</div>
        </div>
      </div>

      {/* Charts & tables – μπορείς να χρησιμοποιήσεις οποιοδήποτε chart lib */}
      {/* Monthly Sales, Monthly Profit, Top Products, Low Stock, Inventory Value, Recent Movements */}
    </div>
  );
}
