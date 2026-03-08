from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ─── User Schemas ───

class UserCreate(BaseModel):
    username: str
    email: str
    full_name: str
    role: str = "member"


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Project Schemas ───

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    owner_id: int


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    owner_id: int
    is_deleted: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─── Board Schemas ───

class BoardCreate(BaseModel):
    name: str
    project_id: int
    position: int = 0


class BoardUpdate(BaseModel):
    name: Optional[str] = None
    position: Optional[int] = None


class BoardResponse(BaseModel):
    id: int
    name: str
    project_id: int
    position: int
    is_deleted: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Task Schemas (MongoDB) ───

class ChecklistItem(BaseModel):
    text: str
    done: bool = False


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    board_id: int
    column: str = "To Do"
    position: int = 0
    priority: str = "medium"
    labels: List[str] = []
    assignee_id: Optional[int] = None
    due_date: Optional[str] = None
    checklist: List[ChecklistItem] = []


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    column: Optional[str] = None
    position: Optional[int] = None
    priority: Optional[str] = None
    labels: Optional[List[str]] = None
    assignee_id: Optional[int] = None
    due_date: Optional[str] = None
    checklist: Optional[List[ChecklistItem]] = None


class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    board_id: int
    column: str
    position: int
    priority: str
    labels: List[str]
    assignee_id: Optional[int]
    due_date: Optional[str]
    checklist: List[ChecklistItem]
    is_deleted: bool
    created_at: str
    updated_at: str


# ─── Activity Schemas (MongoDB) ───

class ActivityResponse(BaseModel):
    id: str
    project_id: int
    user_id: Optional[int]
    action: str
    entity_type: str
    entity_id: str
    details: str
    timestamp: str
