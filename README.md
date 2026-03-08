# TaskFlow – Task Management System

A modern Kanban-style task management web application powered by **MySQL** (relational) and **MongoDB** (NoSQL document) databases.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite, React Router, Axios |
| **Backend** | FastAPI (Python 3.11) |
| **Relational DB** | MySQL 8.0 (via SQLAlchemy ORM) |
| **NoSQL DB** | MongoDB 7.0 (via PyMongo) |
| **Deployment** | Docker Compose |

## 📐 Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│    MySQL     │
│  (React +    │     │  (FastAPI)   │     │  (Users,     │
│   Nginx)     │     │              │────▶│  Projects,   │
│  Port 3000   │     │  Port 8000   │     │  Boards)     │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   MongoDB    │
                     │  (Tasks,     │
                     │  Activities) │
                     └──────────────┘
```

## 🗄️ Database Roles

### MySQL (Relational – Structured Data)
- **Users** – User accounts with roles (admin/member)
- **Projects** – Projects with ownership relationships
- **Boards** – Kanban boards within projects

### MongoDB (NoSQL – Flexible Documents)
- **Tasks** – Tasks with flexible fields (labels, checklist, priority, due dates)
- **Activities** – Activity log for tracking all operations

## 🚀 Quick Start

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed

### Run the Application

```bash
# Clone the repository
git clone https://github.com/<your-username>/Database-Project.git
cd Database-Project

# Start all services
docker-compose up --build

# Wait for all containers to start (MySQL health check takes ~30s)
```

### Access the Application
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs) *(Swagger UI)*

### Stop the Application
```bash
docker-compose down

# To also remove volumes (database data):
docker-compose down -v
```

## 📁 Project Structure

```
Database-Project/
├── docker-compose.yml          # Orchestrates all 4 services
├── README.md                   # This file
├── DATABASE_DESIGN.md          # Database design document
│
├── backend/                    # FastAPI backend
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py             # FastAPI app entry point
│       ├── config.py           # Database configuration
│       ├── mysql_database.py   # SQLAlchemy setup
│       ├── mongo_database.py   # PyMongo setup
│       ├── mysql_models.py     # ORM models
│       ├── schemas.py          # Pydantic schemas
│       └── routers/
│           ├── users.py        # User CRUD (MySQL)
│           ├── projects.py     # Project CRUD (MySQL)
│           ├── boards.py       # Board CRUD (MySQL)
│           ├── tasks.py        # Task CRUD (MongoDB)
│           └── activities.py   # Activity log (MongoDB)
│
├── frontend/                   # React frontend
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── api.js              # API client
│       ├── components/         # Reusable UI components
│       └── pages/              # Page components
│
└── mysql-init/
    └── init.sql               # MySQL schema + seed data
```

## ✨ Features

- **CRUD Operations** on both MySQL and MongoDB
- **Soft Delete** – Data is marked as deleted, not physically removed
- **Kanban Board** – Visual task management with To Do / In Progress / Done columns
- **Task Details** – Labels, priority, due dates, checklist items
- **Activity Log** – Automatic logging of all task operations
- **Modern UI** – Dark theme with glassmorphism, gradients, and micro-animations
- **Responsive** – Works on desktop and mobile browsers
- **API Documentation** – Auto-generated Swagger UI at `/docs`

## 🔧 API Endpoints

| Method | Endpoint | Database | Description |
|--------|----------|----------|-------------|
| GET/POST/PUT/DELETE | `/api/users/` | MySQL | User management |
| GET/POST/PUT/DELETE | `/api/projects/` | MySQL | Project management |
| GET/POST/PUT/DELETE | `/api/boards/` | MySQL | Board management |
| GET/POST/PUT/DELETE | `/api/tasks/` | MongoDB | Task management |
| GET | `/api/activities/` | MongoDB | Activity log |

## 👥 Team Members

*(Add your team members here)*

| Name | Student ID | Role |
|------|-----------|------|
| | | |
| | | |
| | | |