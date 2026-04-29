

export async function fetchProducts() {
    try {
        const result = await fetch("http://localhost:8000/ingest/products");

        console.log("STATUS:", result.status);

        const data = await result.json();
        console.log("DATA FROM API:", data);

        return data;

    } catch (error) {
        console.log("Error:", error.message);
        return [];
    }
}

export async function GetAIAlerts(products: any[]){

    try {
        console.log("products:", products);
        const payload = products.map( (p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            cost: p.cost,
            sales: p.sales,
        }));

        const result = await fetch("http://www.localhost:8000/ai/alerts", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        if(!result.ok){
            throw new Error("error fetching alerts");
        }

        return await result.json();

    } catch(error){
        console.log("Error: ", error.message);
        return { alerts: ["Failed to generate AI alerts."] };
    }
}

export async function analyze(question: string, companyId: string) {
    
    try {
        const result = await fetch("http://localhost:8000/ai/analyze",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                question: question, 
                company_id: companyId,
            })
        });
    
        if(!result.ok){
            throw new Error("analyze request failed");
        }
        
        return await result.json();

    } catch(error){
        console.log("Error: ", error.message);
    }
}

export async function GetAIActionSystem(products:any[]) {
    
    try {
         const payload = products.map( (p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            cost: p.cost,
            sales: p.sales,
        }));

        const result = await fetch("http://localhost:8000/ai/actions", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(payload)
        });

        if(!result.ok){
            throw new Error("Get AI actions failed");
        }

        return await result.json();

    } catch(error) {
        console.log("Error", error.message);
    }
}


export async function runDecisionAgent(products:any[]) {
    
    try {
         const payload = products.map( (p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            cost: p.cost,
            sales: p.sales,
        }));

        const result = await fetch("http://localhost:8000/ai/decision", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(payload)
        });

        if(!result.ok){
            throw new Error("Failed to get decisions");
        }

        return await result.json();

    } catch(error){
        console.log("Error", error.message);
    }
}


export async function seedData(companyId: string) {
  const result = await fetch("http://localhost:8000/ai/seed", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({"company_id": companyId}),
    });

  if (!result.ok) {
    throw new Error("Failed to seed data");
  }

  return await result.json();
}