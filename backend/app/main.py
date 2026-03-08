from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.mysql_database import engine, Base
from app.routers import users, projects, boards, tasks, activities

# Create MySQL tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Task Manager API",
    description="A Task Management System using MySQL + MongoDB",
    version="1.0.0",
)

# CORS – allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(boards.router)
app.include_router(tasks.router)
app.include_router(activities.router)


@app.get("/")
def root():
    return {"message": "Task Manager API is running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "healthy"}
