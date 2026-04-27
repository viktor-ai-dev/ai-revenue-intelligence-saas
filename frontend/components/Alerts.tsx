"use Client";

import { useEffect, useState } from "react";

export default function Alerts({products}:any){
    const [alerts,setAlerts] = useState<string[]>([]);

    useEffect(()=>{

        if(!products || products.length === 0) return;

        const newAlerts: string[] = []

        products.forEach((p:any) => {
            const margin = (p.price - p.cost) / p.price;

            // profit margin
            if(margin < 0.2){
                newAlerts.push(
                    `${p.name} has low profit margin (${(margin*100).toFixed(1)}))`
                )
            }
        
            const totalRevenue = products.reduce(
                (acc:number, p:any) => acc + p.price * p.sales,
                0
            );

            const topProduct = products.reduce((prev:any, curr:any) => 
                    prev.price * prev.sales > curr.price * curr.sales ? prev : curr
            );

            const dominance = (topProduct.price * topProduct.sales) / totalRevenue;

            if(dominance > 0.5){
                newAlerts.push(`${topProduct.name} drives ${(dominance*100).toFixed(1)} % of revenue (risk)`);
            }
        });

        setAlerts(newAlerts);
    }, [products]);


    return (
        <div className="bg-white p-4 rounded-xl shadow space-y-2">
            <h2 className="font-bold text-lg">Alerts</h2>

            {alerts.length == 0 ? (
                <p className="text-gray-500"> No alerts</p>
            ) : (
                    alerts.map((s,i) => (
                        <div key={i} className="bg-red-100 text-red-700 p-2 rounded">{s}</div>
                    ))
                )
            }
        </div>
    );

}