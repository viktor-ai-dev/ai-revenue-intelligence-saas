"use Client";

import {useState, useEffect} from "react";

export default function ProfitSimulator({products}:any){

    const [selected, setSelected] = useState(products[0]);
    const [price, setPrice] = useState(0);
    const [cost, setCost] = useState(0);
    const [sales, setSales] = useState(0);

    const handleSelect = (p:any) => {

        setSelected(p);
        setPrice(p.price);
        setCost(p.cost);
        setSales(p.sales);
    };

    useEffect(() => {
        if(products.length > 0){
            setSelected(products[0]);
            setPrice(products[0].price);
            setCost(products[0].cost);
            setSales(products[0].sales);
        }
    },[products]);

    // baseline
    const baseRevenue = selected?.price * selected?.sales;
    const baseProfit = (selected?.price - selected?.cost) * selected?.sales;

    // New simulated value
    const newRevenue = price * sales;
    const newProfit = (price - cost) * sales;


    return (
        <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <h2 className="font-bold text-lg">Profit Simulator</h2>

        {/* PRODUCT SELECT */}
        <select
            className="border p-2 w-full"
            onChange={(e) =>
                handleSelect(
                    products.find((p: any) => p.id == e.target.value)
                )
            }
        >
            {products.map((p: any) => (
            <option key={p.id} value={p.id}>
                {p.name}
            </option>
            ))}
        </select>

        {/* INPUTS */}
        <div className="grid grid-cols-3 gap-2">
            <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Price"
            className="border p-2"
            />

            <input
            type="number"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            placeholder="Cost"
            className="border p-2"
            />

            <input
            type="number"
            value={sales}
            onChange={(e) => setSales(Number(e.target.value))}
            placeholder="Sales"
            className="border p-2"
            />
        </div>

        {/* RESULTS */}
        <div className="grid grid-cols-2 gap-4">

            <div>
            <h4 className="text-gray-500">Current Profit</h4>
            <p className="font-bold">{baseProfit?.toFixed(0)}</p>
            </div>

            <div>
            <h4 className="text-gray-500">New Profit</h4>
            <p className="font-bold">{newProfit.toFixed(0)}</p>
            </div>

            <div>
            <h4 className="text-gray-500">Current Revenue</h4>
            <p>{baseRevenue?.toFixed(0)}</p>
            </div>

            <div>
            <h4 className="text-gray-500">New Revenue</h4>
            <p>{newRevenue.toFixed(0)}</p>
            </div>

        </div>

        {/* IMPACT */}
        <div className="bg-gray-100 p-3 rounded">
            <h4 className="font-bold">Impact</h4>
            <p>
            Profit change: {(newProfit - baseProfit).toFixed(0)}
            </p>
            <p>
            Revenue change: {(newRevenue - baseRevenue).toFixed(0)}
            </p>
        </div>
        </div>
    );
}

