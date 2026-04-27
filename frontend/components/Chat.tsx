"use client";

import { useState } from "react";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      // 🔥 FIX: ta rätt field
      setResponse(data.answer);
    } catch (err) {
      console.error(err);
      setResponse("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">
      <h2 className="font-bold">Ask Questions</h2>

      <input
        className="border p-2 w-full"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about revenue..."
      />

      <button
        className="bg-black text-white px-4 py-2 rounded"
        onClick={askAI}
      >
        Ask AI
      </button>

      <p className="text-sm text-gray-700">
        {loading
          ? "Thinking..."
          : response || "Waiting for question..."}
      </p>
    </div>
  );
}