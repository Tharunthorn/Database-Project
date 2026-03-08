from fastapi import APIRouter
from typing import List
from app.mongo_database import activities_collection
from app.schemas import ActivityResponse

router = APIRouter(prefix="/api/activities", tags=["Activities (MongoDB)"])


def activity_to_response(doc: dict) -> ActivityResponse:
    """Convert MongoDB document to ActivityResponse."""
    return ActivityResponse(
        id=str(doc["_id"]),
        project_id=doc.get("project_id", 0),
        user_id=doc.get("user_id"),
        action=doc.get("action", ""),
        entity_type=doc.get("entity_type", ""),
        entity_id=str(doc.get("entity_id", "")),
        details=doc.get("details", ""),
        timestamp=str(doc.get("timestamp", "")),
    )


@router.get("/", response_model=List[ActivityResponse])
def list_activities(limit: int = 50):
    """List recent activities across all projects."""
    docs = activities_collection.find().sort("timestamp", -1).limit(limit)
    return [activity_to_response(d) for d in docs]


@router.get("/board/{board_id}", response_model=List[ActivityResponse])
def list_board_activities(board_id: int, limit: int = 50):
    """List activities for a specific board (by searching task entity)."""
    docs = activities_collection.find(
        {"entity_type": "task"}
    ).sort("timestamp", -1).limit(limit)
    return [activity_to_response(d) for d in docs]
