from pydantic import BaseModel
from typing import List, Any

class ProductCreate(BaseModel):
    name: str
    price: float
    cost: float
    sales: int

class AIQuery(BaseModel):
    question: str
    company_id: str

class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    cost: float
    sales: int

    class config:
        orm_mode = True

class AISeed(BaseModel):
    company_id: str



class AIResponse(BaseModel):
    summary: str
    products: List[Any]
    answer: str