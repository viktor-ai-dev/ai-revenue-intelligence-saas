from database import SessionLocal
import models
from embeddings import get_embedding

def backfill():
    db = SessionLocal()

    products = db.query(models.Product).all()

    for p in products:
        text = f"{p.name} price {p.price} cost {p.cost} sales {p.sales}"
        p.embedding = get_embedding(text)

    db.commit()
    db.close()

# __name__ == "__main__": filen körs direkt
# __name__ == "filnamn" om den importeras

if __name__ == "__main__":
    backfill()