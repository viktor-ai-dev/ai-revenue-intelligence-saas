"use client";

import { analyze } from "@/lib/api";
import { useEffect, useState } from "react";
import { AIAnalyzeResponse } from "@/types/ai";

// List[ProductResponse]
// insyn = transparency
// insight = förståelse
export default function AIInsights({products, company_id}: any){
    const [loading, setLoading] = useState(false);
    const [analyzeResponse, setAnalyzeResponse] = useState<AIAnalyzeResponse>();

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

            const res = await analyze(question, company_id);
            setAnalyzeResponse(res.answer);

        } catch(err){
            console.log("Error: ", err);
        }

        setLoading(false);
    };

    useEffect(()=>{
      if(products.length > 0 && company_id){
        generateInsights();
      }
    }, [products, company_id]);

    return (
    <div className="bg-white p-4 rounded-xl shadow space-y-3">
      
      <h2 className="font-bold text-lg">AI Insights Live</h2>

      {loading ? (
        <p className="text-gray-500">Analyzing data...</p>
      ) : (  
        <pre className="text-sm whitespace-pre-wrap text-gray-700">
          {analyzeResponse?.summary}
        </pre>
      )}

    </div>
  );
}