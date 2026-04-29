"use client";

import { useState } from "react";
import { runDecisionAgent } from "@/lib/api";
import { AIDecision } from "@/types/ai";

export default function AIAgent({ products }: any) {
  const [decisions, setDecisions] = useState<AIDecision[]>([]);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);

    try {
      const result = await runDecisionAgent(products);
      setDecisions(result?.decisions ?? []);
    } catch {
      setDecisions([]);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">
      <h2 className="font-bold text-lg">Autonomous AI Agent</h2>

      <button
        onClick={run}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Run Decision AI Agent
      </button>

      {loading && <p>Thinking...</p>}

      {decisions.map((d, i) => (
        <div key={i} className="border p-3 rounded space-y-1">
          <p className="font-bold">{d.action}</p>
          <p className="text-sm">{d.reason}</p>
          <p className="text-green-600">{d.impact}</p>
          <p className="text-xs">Priority: {d.priority}</p>
          <p className="text-xs">
            {d.execute ? "AUTO EXECUTE" : "Manual"}
          </p>
        </div>
      ))}
    </div>
  );
}