"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";

import Chat from "@/components/Chat";
import RevenueChart from "@/components/RevenueChart";
import AIInsights from "@/components/AIInsights";
import AIAlerts from "@/components/AIAlerts";
import ProfitSimulator from "@/components/ProfitSimulator";
import AuthGate from "@/components/AuthGate";

import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user, isLoaded } = useUser();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🧠 TEMP companyId (sen: organization.id)
  const companyId = user?.id || 1;

  useEffect(() => {
    if (!isLoaded) return;

    fetchProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isLoaded]);

  const revenue = products.reduce(
    (prev, curr) => prev + curr.price * curr.sales,
    0
  );

  const profit = products.reduce(
    (prev, curr) => prev + (curr.price - curr.cost) * curr.sales,
    0
  );

  return (
    <AuthGate hasData={products.length > 0}>
      <main className="p-6 space-y-6">

        {/* 🧠 LOADING STATE */}
        {loading && (
          <p className="text-gray-500">Loading dashboard...</p>
        )}

        {/* 🧠 EMPTY STATE */}
        {!loading && products.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p>No products yet</p>
            <p className="text-sm text-gray-500">
              Add data to start generating insights
            </p>
          </div>
        )}

        {/* 🟢 MAIN DASHBOARD */}
        {!loading && products.length > 0 && (
          <>
            {/* KPI */}
            <div className="grid grid-cols-2 gap-4">
              
              <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="text-gray-500">Revenue</h3>
                <p className="text-2xl font-bold">
                  {revenue.toFixed(0)}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="text-gray-500">Profit</h3>
                <p className="text-2xl font-bold">
                  {profit.toFixed(0)}
                </p>
              </div>
            </div>

            {/* Dashboard */}
            <Chat />
            <RevenueChart products={products} />
            <ProfitSimulator products={products} />
            <AIAlerts products={products} />

            {/* 🔥 FIX: skicka companyId */}
            <AIInsights
              products={products}
              companyId={companyId}
            />
          </>
        )}

      </main>
    </AuthGate>
  );
}