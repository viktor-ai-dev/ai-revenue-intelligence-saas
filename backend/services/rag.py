from sqlalchemy import text
from embeddings import get_embedding

# Vi omvandlar användarens fråga till en embedding och jämför den med varje produkts 
# embedding i databasen. PostgreSQL använder pgvector för att räkna avstånd mellan vektorer, 
# sorterar resultaten efter minsta avstånd (mest likhet), och returnerar de 5 mest relevanta produkterna.
#
# Vi gör en semantisk search(av betydelse/likhet)
# fetchall() returnerar en [] med row produkter
def search_products(db, query: str, company_id: int):
    query_vector = get_embedding(query)
    vector_str = f"[{','.join(map(str, query_vector))}]"

    results = db.execute(
        text("""
        SELECT name, price, sales
        FROM products
        WHERE company_id = :cid
        ORDER BY embedding <-> :qvec
        LIMIT 5
        """),
        {"qvec": vector_str, "cid":company_id}
    ).fetchall()

    return results