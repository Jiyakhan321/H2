from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from src.api.auth_router import auth_router
from src.api.task_router import task_router
from src.database import create_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic - create database tables
    create_tables()
    yield
    # Shutdown logic can go here

app = FastAPI(
    title="Todo Web Application API",
    description="REST API for the Full-Stack Multi-User Todo Web Application",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware - configure origins based on your frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001", "*"],  # More specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(task_router, prefix="/tasks", tags=["Tasks"])

@app.get("/")
def read_root():
    return {"message": "Todo Web Application API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}