"use client";

import { useEffect, useState } from "react";
import { GetAIAlerts } from "@/lib/api";
import type { AIAlert } from "@/types/ai";

export default function AIAlerts({ products }: any) {
  const [alerts, setAlerts] = useState<AIAlert[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!products.length) return;

    const fetchAlerts = async () => {
      setLoading(true);

      try {
        const result = await GetAIAlerts(products);
        setAlerts(result?.alerts ?? []);
      } catch (err) {
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [products]);

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">
      <h2 className="font-bold text-lg">AI Business Intelligence</h2>

      {loading ? (
        <p className="text-gray-500">Analyzing business...</p>
      ) : alerts.length === 0 ? (
        <p className="text-gray-500">No issues detected</p>
      ) : (
        alerts.map((a, i) => (
          <div key={i} className="border p-3 rounded space-y-1">

            <div className="flex justify-between">
              <p className="font-bold">{a.title}</p>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                {a.severity}
              </span>
            </div>

            <p className="text-sm text-gray-600">
              {a.explanation}
            </p>

            <p className="text-sm text-green-700">
              💡 {a.recommendation}
            </p>

          </div>
        ))
      )}
    </div>
  );
}