# Database Design Document – TaskFlow

## System Overview

TaskFlow is a task management application that uses **two databases** meaningfully:
- **MySQL** for structured, relational data that requires referential integrity
- **MongoDB** for flexible, schema-free document data that benefits from dynamic fields

---

## MySQL Database Schema (Relational Data)

### Why MySQL?
Users, projects, and boards have **fixed schemas** and **relationships between them** (foreign keys). MySQL enforces data integrity through constraints.

### Tables

```
┌─────────────────────────────────────────┐
│ users                                   │
├─────────────────────────────────────────┤
│ id          INT (PK, AUTO_INCREMENT)    │
│ username    VARCHAR(50) UNIQUE NOT NULL  │
│ email       VARCHAR(100) UNIQUE NOT NULL│
│ full_name   VARCHAR(100) NOT NULL       │
│ role        VARCHAR(20) DEFAULT 'member'│
│ is_active   BOOLEAN DEFAULT TRUE        │
│ created_at  DATETIME                    │
└─────────────────────────────────────────┘
        │ 1:N
        ▼
┌─────────────────────────────────────────┐
│ projects                                │
├─────────────────────────────────────────┤
│ id          INT (PK, AUTO_INCREMENT)    │
│ name        VARCHAR(100) NOT NULL       │
│ description TEXT                        │
│ owner_id    INT (FK → users.id)         │
│ is_deleted  BOOLEAN DEFAULT FALSE       │
│ created_at  DATETIME                    │
│ updated_at  DATETIME                    │
└─────────────────────────────────────────┘
        │ 1:N
        ▼
┌─────────────────────────────────────────┐
│ boards                                  │
├─────────────────────────────────────────┤
│ id          INT (PK, AUTO_INCREMENT)    │
│ name        VARCHAR(100) NOT NULL       │
│ project_id  INT (FK → projects.id)      │
│ position    INT DEFAULT 0               │
│ is_deleted  BOOLEAN DEFAULT FALSE       │
│ created_at  DATETIME                    │
└─────────────────────────────────────────┘
```

### Relationships
- **users → projects**: One user owns many projects (`owner_id` FK)
- **projects → boards**: One project contains many boards (`project_id` FK)

---

## MongoDB Document Structure (NoSQL Data)

### Why MongoDB?
Tasks have **dynamic, flexible fields** (labels, checklists, custom metadata) that vary per task. Activity logs are **append-heavy** and don't need relational constraints. MongoDB's schema-free nature is ideal here.

### `tasks` Collection

```json
{
  "_id": "ObjectId",
  "title": "Fix login page bug",
  "description": "Users can't login on mobile browsers",
  "board_id": 1,
  "column": "In Progress",
  "position": 0,
  "priority": "high",
  "labels": ["bug", "urgent"],
  "assignee_id": 2,
  "due_date": "2026-03-15",
  "checklist": [
    { "text": "Reproduce the issue", "done": true },
    { "text": "Fix CSS media queries", "done": false },
    { "text": "Test on Safari", "done": false }
  ],
  "is_deleted": false,
  "created_at": "2026-03-01T10:00:00Z",
  "updated_at": "2026-03-08T14:30:00Z"
}
```

### `activities` Collection

```json
{
  "_id": "ObjectId",
  "project_id": 1,
  "user_id": null,
  "action": "created_task",
  "entity_type": "task",
  "entity_id": "65f1a2b3c...",
  "details": "Created task 'Fix login page bug'",
  "timestamp": "2026-03-08T14:30:00Z"
}
```

---

## Role of Each Database

| Database | Data Stored | Reason |
|----------|-------------|--------|
| **MySQL** | Users, Projects, Boards | Fixed schema, foreign key relationships, data integrity |
| **MongoDB** | Tasks, Activity Logs | Flexible fields (labels, checklists), schema-free, fast writes for logs |

---

## CRUD Operations Summary

| Operation | MySQL (Users, Projects, Boards) | MongoDB (Tasks, Activities) |
|-----------|--------------------------------|----------------------------|
| **Create** | `INSERT INTO` via SQLAlchemy ORM | `insert_one()` via PyMongo |
| **Read** | `SELECT` with filters | `find()` with filters |
| **Update** | `UPDATE SET` via ORM | `update_one()` with `$set` |
| **Delete** | Soft delete (`is_active=FALSE` / `is_deleted=TRUE`) | Soft delete (`is_deleted=true`) |
