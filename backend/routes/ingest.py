from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas import ProductCreate, ProductResponse
import models
from embeddings import get_embedding


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/product")
def add_product(data: ProductCreate, company_id:int, db: Session = Depends(get_db)):

    text = f"""
        Product: {data.name}
        Price:   {data.price}
        Cost:    {data.cost}
        Sales:   {data.sales}
    """
    embedding = get_embedding(text)

    product = models.Product(
        company_id = company_id,
        name = data.name,
        price = data.price,
        cost = data.cost,
        sales = data.sales,
        embedding = embedding # save embedding, for reading from database
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return {"message": f"Product {data.name} created"}


# FastAPI behöver typbeskrivning
# [ProductRespone] = en faktiskt lista med objekt
# list[ProductResponse] = en typ: lista av ProductResponse
#
# Eftersom response_model returnerar en lista av pydantic modell:
# - Varje python objekt konverteras till JSON och skicka detta i response
# - Alltså skickas en array av json object
# - list[ProductResponse] = varje element är en Pydantic, som kommer omvandlas till python-dict(python versionen av JSON objekt)
# - Detta skickas sedan som response med FastAPI för serialisering, dessa blir JSON objekt.
#   [
#       {"name": "A", "price": 10},
#       {"name": "B", "price": 20},
#   ]
@router.get("/products", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    return products
    