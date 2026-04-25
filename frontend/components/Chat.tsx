"use client"

import {useState} from "react"

export default function Chat(){

    const [question, setQuestion] = useState("")
    const [response, setResponse] = useState("")

    const askAI = async () => {
        const res = await fetch("http://localhost:8000/ai/analyze", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({question})
        })

        const data = await res.json()
        setResponse(data)
    }

    return (
        <div>
            <input
                value={question}
                onChange={(e) => (setQuestion(e.target.value))}
                placeholder="Ask abour revenue..." />

            <button onClick={askAI}>Ask AI</button>

            <p>
                response && { response } : { "Waiting for response..."}
            </p>
        </div>
        
    );
}