"use Client";


import { useEffect, useState } from "react";
import { AIAction } from "@/types/ai";
import { GetAIActionSystem } from "@/lib/api";


export default function AIActionSystem({products}: any){

    const [actions,setActions] = useState<AIAction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(()=>{
        
        if(!products.length) return;

        const fetchActions = async()=>{
            setLoading(true);

            try {
                const res = await GetAIActionSystem(products);
                setActions(res?.actions ?? []);
            } catch(err){
                setActions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchActions();
    }, [products]);

     return (
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <h2 className="font-bold text-lg">AI Growth Actions</h2>

        {loading ? (
            <p className="text-gray-500">Generating growth strategy...</p>
        ) : actions.length === 0 ? (
            <p className="text-gray-500">No actions suggested</p>
        ) : (
            actions.map((a, i) => (
            <div key={i} className="border p-3 rounded space-y-1">

                <div className="flex justify-between">
                <p className="font-bold">{a.action}</p>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                    {a.priority}
                </span>
                </div>

                <p className="text-sm text-gray-600">
                {a.reason}
                </p>

                <p className="text-sm text-green-700">
                📈 {a.expectedImpact}
                </p>

                <p className="text-xs text-red-500">
                Risk: {a.risk}
                </p>

            </div>
            ))
        )}
        </div>
  );

}