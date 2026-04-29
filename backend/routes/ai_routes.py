from fastapi import APIRouter, Depends
from database import SessionLocal
from services.rag import search_products
from ai import generate_answer
from schemas import AIQuery
from schemas import ProductResponse
import json
from openai import OpenAI
from dotenv import load_dotenv
import os
from agents import decision_agent

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/analyze")
def analyze(data: AIQuery, db=Depends(get_db)):
    question = data.question

    # omvandlar question till embedded, söker efter 5 liknande 
    # produkter och returnerar en lista med row-objekt
    results = search_products(db, question, data.company_id)

    # skicka med relevant kontext
    context = ""
    for r in results:
        context += f"Name: {r.name}, Price: {r.price}, Sales: {r.sales}\n"

    answer = generate_answer(question, context)

    return {"answer": answer}

@router.post("/alerts")
def generate_alerts(data:list[ProductResponse], db=Depends(get_db)):

    prompt=f"""
        You are an AI revenue monitoring system.
        Analyze the following product data and generate alert messages.

        Rules:
        - Return only short messages that are max 1 sentence each.
        - Focus on: 
            1. revenue issues
            2. profit issues
            3. sales anomalies
            4. top performers

        - Return ONLY valid JSON in this format:
        {{
            "alerts": [
             {{
                "type": "risk | opportunity | anomaly",
                "severity": "low | medium | high",
                "title": "...",
                "explanation": "..."
                "recommendation": "..."
             }}
            ]
        }}

        Data:
        {data}
    """
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role":"user", "content": prompt}],
        temperature=0.3   
    )

    return json.loads(response.choices[0].message.content)    


@router.post("/actions")
def ai_actions(data:list[ProductResponse], db=Depends(get_db)):

    prompt=f"""

    You are an senior growth strategist AI.

    Analyze these prodcts:
    {data}

    Return ONLY valid JSON:
    {{
        actions: [
            {{
                "priority": "low | medium | high",
                "action": "...",
                "reason": "...",
                "expectedImpact": "...",
                "risk": "low | medium | high"
            }}
        ]
    }}

    Focus on:
    - revenue growth
    - profit optimization
    - pricing strategy
    - marketing actions
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role":"user", "content": prompt}],
        temperature=0.3
    )

    return json.loads(response.choices[0].message.content)


@router.post("/decision")
def run_decision_agent(data: list[ProductResponse]):
    return decision_agent(data)