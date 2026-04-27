from fastapi import APIRouter, Depends
from database import SessionLocal
from services.rag import search_products
from ai import generate_answer
from schemas import AIQuery

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
    results = search_products(db, question)

    # skicka med relevant kontext
    context = ""
    for r in results:
        context += f"Name: {r.name}, Price: {r.price}, Sales: {r.sales}\n"

    answer = generate_answer(question, context)

    return {"answer": answer}