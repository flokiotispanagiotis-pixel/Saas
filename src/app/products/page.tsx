async function fetchProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: 'no-store'
  });
  return res.json();
}

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Products</h1>
        <a
          href="/products/new"
          className="px-3 py-2 text-sm bg-blue-600 text-white rounded"
        >
          Add Product
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">SKU</th>
              <th className="text-right p-2">Stock</th>
              <th className="text-right p-2">Sell Price</th>
              <th className="text-right p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.sku}</td>
                <td className="p-2 text-right">{p.stock_qty}</td>
                <td className="p-2 text-right">{p.sell_price.toFixed(2)}</td>
                <td className="p-2 text-right">
                  <a
                    href={`/products/${p.id}`}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
