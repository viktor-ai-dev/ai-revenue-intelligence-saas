"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueChart({ products }: any) {
  const data = products.map((p: any) => ({
    name: p.name,
    revenue: p.price * p.sales,
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-bold mb-2">Revenue per product</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}