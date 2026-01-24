from sqlmodel import create_engine, Session
from contextlib import contextmanager
from typing import Generator
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/todo_db")

# Create the database engine
# Set echo=True for debugging database queries
engine = create_engine(DATABASE_URL, echo=False)

def get_session() -> Generator[Session, None, None]:
    """
    Dependency function for FastAPI to provide database sessions.
    """
    with Session(engine) as session:
        yield session

# Import models here to ensure they're registered with SQLModel before creating tables
def create_tables():
    """Create all database tables."""
    from sqlmodel import SQLModel
    from .models.user import User
    from .models.todo_task import TodoTask

    SQLModel.metadata.create_all(engine)