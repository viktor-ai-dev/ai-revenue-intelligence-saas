"use client";

import { useState } from "react";
import { AIAnalyzeResponse } from "@/types/ai";

export default function Chat({ companyId }: any) {
  const [question, setQuestion] = useState("");
  const [responseAnalyze, setResponseAnalyze] = useState<AIAnalyzeResponse>();
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question) return;

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          company_id: companyId,
        }),
      });

      if (!res.ok) throw new Error("Failed request");

      const data = await res.json();

      // ✅ FIX: backend returnerar redan rätt struktur
      setResponseAnalyze(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-4">
      {/* HEADER */}
      <h2 className="font-bold text-lg">Ask AI</h2>

      {/* INPUT */}
      <input
        className="border p-2 w-full rounded"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about revenue, profit, risks..."
      />

      <button
        className="bg-black text-white px-4 py-2 rounded w-full"
        onClick={askAI}
      >
        Ask AI
      </button>

      {/* 🧠 OUTPUT */}
      <div className="space-y-6">

        {/* LOADING */}
        {loading && (
          <p className="text-gray-500">Thinking...</p>
        )}

        {/* SUMMARY */}
        {!loading && responseAnalyze?.summary && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <p className="text-sm text-blue-700 font-medium">
              AI Summary
            </p>
            <p className="text-lg font-semibold text-blue-900">
              {responseAnalyze.summary}
            </p>
          </div>
        )}

        {/* PRODUCTS */}
        {!loading && responseAnalyze?.products?.length > 0 && (
          <div className="space-y-4">
            {responseAnalyze.products.map((p, i) => (
              <div
                key={i}
                className="border rounded-xl p-4 shadow-sm space-y-2"
              >
                {/* NAME */}
                <h3 className="font-bold text-lg">
                  {p.name}
                </h3>

                {/* PROFIT */}
                <p className="text-sm text-gray-600">
                  Profit:{" "}
                  <span
                    className={`font-semibold ${
                      p.profit < 8000
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {p.profit}
                  </span>
                </p>

                {/* INSIGHTS */}
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Insights:
                  </p>

                  <ul className="list-disc ml-5 text-sm text-gray-600">
                    {p.insights.map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !responseAnalyze && (
          <p className="text-gray-400">
            Ask a question to get insights...
          </p>
        )}
      </div>
    </div>
  );
}