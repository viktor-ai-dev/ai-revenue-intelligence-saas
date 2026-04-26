from fastapi import FastAPI
from routes import ai_routes
from routes import ingest
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # din Next.js app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest.router, prefix="/ingest")
app.include_router(ai_routes.router, prefix="/ai")

@app.get("/")
def root():
    return {"status": "AI Revenue API Intelligence running"}

