"use client";

import { analyze } from "@/lib/api";
import { useState } from "react";

// List[ProductResponse]
export default function AIInsights({products}: any){
    const [loading, setLoading] = useState(false);
    const [insights, setInsights] = useState("")

    const generateInsights = async () => {
        setLoading(true);

        try {
            const question = `
            Analyze this business data and give insights:

            Products: ${JSON.stringify(products)}

            Focus on:
            - revenue trends
            - profit issues
            - top performing products
            - risks
            `;

            const res = await analyze(question);
            setInsights(res.answer);

        } catch(err){
            setInsights("Error generating insights");
        }

        setLoading(false);
    };

    return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">
      
      <h2 className="font-bold text-lg">AI Insights</h2>

      <button
        onClick={generateInsights}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Analyzing..." : "Generate Insights"}
      </button>

      {insights && (
        <div className="mt-3 text-sm whitespace-pre-line text-gray-700">
          {insights}
        </div>
      )}

    </div>
  );
}