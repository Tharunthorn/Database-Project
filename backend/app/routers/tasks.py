from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime, timezone
from bson import ObjectId
from app.mongo_database import tasks_collection, activities_collection
from app.schemas import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter(prefix="/api/tasks", tags=["Tasks (MongoDB)"])


def task_to_response(task: dict) -> TaskResponse:
    """Convert MongoDB document to TaskResponse."""
    return TaskResponse(
        id=str(task["_id"]),
        title=task["title"],
        description=task.get("description", ""),
        board_id=task["board_id"],
        column=task.get("column", "To Do"),
        position=task.get("position", 0),
        priority=task.get("priority", "medium"),
        labels=task.get("labels", []),
        assignee_id=task.get("assignee_id"),
        due_date=task.get("due_date"),
        checklist=task.get("checklist", []),
        is_deleted=task.get("is_deleted", False),
        created_at=str(task.get("created_at", "")),
        updated_at=str(task.get("updated_at", "")),
    )


def log_activity(board_id: int, action: str, entity_type: str, entity_id: str, details: str, project_id: int = 0):
    """Log an activity to MongoDB."""
    activities_collection.insert_one({
        "project_id": project_id,
        "user_id": None,
        "action": action,
        "entity_type": entity_type,
        "entity_id": entity_id,
        "details": details,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })


@router.get("/", response_model=List[TaskResponse])
def list_tasks(board_id: int):
    """List all active tasks for a board."""
    tasks = tasks_collection.find({"board_id": board_id, "is_deleted": False}).sort("position", 1)
    return [task_to_response(t) for t in tasks]


@router.post("/", response_model=TaskResponse, status_code=201)
def create_task(data: TaskCreate):
    """Create a new task."""
    now = datetime.now(timezone.utc).isoformat()
    doc = data.model_dump()
    doc["is_deleted"] = False
    doc["created_at"] = now
    doc["updated_at"] = now
    # Convert checklist items to dicts
    doc["checklist"] = [item if isinstance(item, dict) else item.model_dump() for item in doc.get("checklist", [])]

    result = tasks_collection.insert_one(doc)
    task = tasks_collection.find_one({"_id": result.inserted_id})

    log_activity(
        board_id=data.board_id,
        action="created_task",
        entity_type="task",
        entity_id=str(result.inserted_id),
        details=f"Created task '{data.title}'",
    )

    return task_to_response(task)


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: str):
    """Get a specific task by ID."""
    try:
        task = tasks_collection.find_one({"_id": ObjectId(task_id), "is_deleted": False})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid task ID format")

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task_to_response(task)


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: str, data: TaskUpdate):
    """Update a task."""
    try:
        oid = ObjectId(task_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid task ID format")

    task = tasks_collection.find_one({"_id": oid, "is_deleted": False})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = data.model_dump(exclude_unset=True)
    if "checklist" in update_data:
        update_data["checklist"] = [
            item if isinstance(item, dict) else item.model_dump()
            for item in update_data["checklist"]
        ]
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    tasks_collection.update_one({"_id": oid}, {"$set": update_data})
    updated = tasks_collection.find_one({"_id": oid})

    log_activity(
        board_id=task["board_id"],
        action="updated_task",
        entity_type="task",
        entity_id=task_id,
        details=f"Updated task '{updated['title']}'",
    )

    return task_to_response(updated)


@router.delete("/{task_id}", response_model=TaskResponse)
def delete_task(task_id: str):
    """Soft-delete a task."""
    try:
        oid = ObjectId(task_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid task ID format")

    task = tasks_collection.find_one({"_id": oid, "is_deleted": False})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    tasks_collection.update_one({"_id": oid}, {"$set": {
        "is_deleted": True,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }})
    updated = tasks_collection.find_one({"_id": oid})

    log_activity(
        board_id=task["board_id"],
        action="deleted_task",
        entity_type="task",
        entity_id=task_id,
        details=f"Deleted task '{task['title']}'",
    )

    return task_to_response(updated)
