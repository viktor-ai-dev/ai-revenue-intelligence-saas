from sqlalchemy import Column, Integer, String, Float
from pgvector.sqlalchemy import Vector
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    company_id = Column(String)
    
    name = Column(String)
    price = Column(Float)
    cost = Column(Float)
    sales = Column(Integer)

    embedding = Column(Vector(384))


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)