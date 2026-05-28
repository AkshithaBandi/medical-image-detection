from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.predict import router as predict_router
from routes.history import router as history_router
from fastapi.staticfiles import StaticFiles
from auth.auth import router as auth_router

app = FastAPI()
app.mount("/heatmaps", StaticFiles(directory="heatmaps"), name="heatmaps")
app.mount("/reports", StaticFiles(directory="reports"), name="reports")
# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Medical Image Detection API Running"}

# Include prediction routes
app.include_router(predict_router)
app.include_router(history_router)
app.include_router(auth_router)