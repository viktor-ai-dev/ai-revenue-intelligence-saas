from fastapi import FastAPI
from routes import ingest,ai_routes

app = FastAPI()
app.include_router(ingest.router, prefix="/ingest")
app.include_router(ai_routes.router, prefix="/ai")

@app.get("/")
def root():
    return {"status": "AI Revenue API Intelligence running"}

