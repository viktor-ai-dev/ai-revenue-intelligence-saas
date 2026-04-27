
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

export async function GetAIAlerts(products:[any]){

    try {
        const result = await fetch("http://www.localhost:8000/ai/alerts", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({products})
        });

        if(!result.ok){
            throw new Error("error fetching alerts");
        }

        return await result.json();

    } catch(error){
        console.log("Error: ", error.message);
    }
}

export async function analyze(question: string) {

    try {
        const result = await fetch("http://localhost:8000/ai/analyze",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({question})
        });
    
        if(!result.ok){
            throw new Error("analyze request failed");
        }
        
        return await result.json();

    } catch(error){
        console.log("Error: ", error.message);
    }
}