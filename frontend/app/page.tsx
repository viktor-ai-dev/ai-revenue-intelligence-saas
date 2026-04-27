"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import Chat from "@/components/Chat";
import RevenueChart from "@/components/RevenueChart";
import AIInsights from "@/components/AIInsights";
import Alerts from "@/components/Alerts";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const revenue = products.reduce(
    (prev, curr) => prev + curr.price * curr.sales,
    0
  );

  const profit = products.reduce(
    (prev, curr) => prev + (curr.price - curr.cost) * curr.sales,
    0
  );

  return (
    <main className="p-6 space-y-6">
      
      {/* KPI SECTION */}
      <div className="grid grid-cols-2 gap-4">
        
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500">Revenue</h3>
          <p className="text-2xl font-bold">
            {loading ? "..." : revenue.toFixed(0)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500">Profit</h3>
          <p className="text-2xl font-bold">
            {loading ? "..." : profit.toFixed(0)}
          </p>
        </div>
      </div>

      {/* CHAT */}
      <Chat />

      <RevenueChart products={products} />
      <Alerts products={products} />
      <AIInsights products={products} />
    </main>
  );
}