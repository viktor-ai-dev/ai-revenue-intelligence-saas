from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    price: float
    cost: float
    sales: int

class AIQuery(BaseModel):
    question: str
    company_id: int

class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    cost: float
    sales: int

    class config:
        orm_mode = True