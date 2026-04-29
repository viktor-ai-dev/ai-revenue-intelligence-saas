from fastapi import APIRouter, Depends
from database import SessionLocal
from services.rag import search_products
from ai import generate_answer
from schemas import AIQuery, AISeed, ProductResponse, AIResponse
import schemas
import json
from openai import OpenAI
from dotenv import load_dotenv
import os
from agents import decision_agent
import models


load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def normalize(ai):
    return {
        "summary": ai.get("summary", ""),
        "products": ai.get("products", []),
        "answer": ai.get("answer", "")
    }

@router.post("/analyze", response_model=AIResponse)
def analyze(data: AIQuery, db=Depends(get_db)):
    
    # omvandlar question till embedded, söker efter 5 liknande 
    # produkter och returnerar en lista med row-objekt
    results = search_products(db, data.question, data.company_id)

    # skicka med relevant kontext
    context = "\n".join(
        f"Name: {r.name}, Price: {r.price}, Sales: {r.sales}\n" for r in results
    )

    answer = generate_answer(data.question, context)

    print("RAW AI:", answer)

    return AIResponse(**normalize(answer))

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


@router.post("/seed")
def seed_data(seed: AISeed, db = Depends(get_db)):
     
    products = [
        {"name": "Wireless Headphones", "price": 120, "cost": 60, "sales": 80},
        {"name": "Smart Watch", "price": 200, "cost": 120, "sales": 40},
        {"name": "Gaming Mouse", "price": 50, "cost": 20, "sales": 150},
    ]

    for p in products:
        db.add(models.Product(**p, company_id=seed.company_id))

    db.commit()

    return {"status": "seeded"}