from fastapi import FastAPI
from routes import ai_routes
from routes import ingest

app = FastAPI()
app.include_router(ingest.router, prefix="/ingest")
app.include_router(ai_routes.router, prefix="/ai")

@app.get("/")
def root():
    return {"status": "AI Revenue API Intelligence running"}

