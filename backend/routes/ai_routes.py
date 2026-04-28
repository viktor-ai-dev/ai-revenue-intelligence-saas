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
            1. low profit margins
            2. revenue concentration risk
            3. high-risk patterns
            4. unusual patterns
            5. underperforming products

        - return a string of alert messages separated by ','.
        - Example: "message1,message2,message3"

        Data:
        {data}
    """
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role":"user", "content": prompt}],
        temperature=0.8   
    )

    text = response.choices[0].message.content

    alerts = text.split(",")
    return {"alerts":alerts}