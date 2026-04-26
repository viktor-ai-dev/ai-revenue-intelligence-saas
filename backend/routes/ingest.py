from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas import ProductCreate
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
def add_product(data: ProductCreate, db: Session = Depends(get_db)):

    text = f"""
        Product: {data.name}
        Price:   {data.price}
        Cost:    {data.cost}
        Sales:   {data.sales}
    """
    embedding = get_embedding(text)

    product = models.Product(
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
