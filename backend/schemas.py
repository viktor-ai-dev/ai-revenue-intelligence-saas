from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    price: float
    cost: float
    sales: int

class AIQuery(BaseModel):
    question: str