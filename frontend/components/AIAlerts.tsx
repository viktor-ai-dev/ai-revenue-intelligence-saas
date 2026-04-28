"use Client";


import {useEffect, useState} from "react"
import { GetAIAlerts } from "@/lib/api";

export default function AIAlerts({products}:any){

    const [alerts, setAlerts] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(()=>{

        if(!products.length) return;

        const fetchAlerts = async () => {
            setLoading(true);
            try{
                const result = await GetAIAlerts(products);
                setAlerts(result?.alerts ?? []);
            } catch(err){
                console.error(err);
                setAlerts(["Failed to generate AI alerts."]);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, [products]);


    return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2">
      <h2 className="font-bold text-lg">AI Alerts</h2>

      {loading ? (
        <p className="text-gray-500">Analyzing risks...</p>
      ) : alerts.length === 0 ? (
        <p className="text-gray-500">No alerts</p>
      ) : (
        alerts.map((a, i) => (
          <div
            key={i}
            className="bg-yellow-100 text-yellow-800 p-2 rounded"
          >
            ⚠️ {a}
          </div>
        ))
      )}
    </div>
  );
}