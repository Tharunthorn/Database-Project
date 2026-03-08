from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.mysql_database import get_db
from app.mysql_models import Board
from app.schemas import BoardCreate, BoardUpdate, BoardResponse

router = APIRouter(prefix="/api/boards", tags=["Boards (MySQL)"])


@router.get("/", response_model=List[BoardResponse])
def list_boards(project_id: int, db: Session = Depends(get_db)):
    """List all active boards for a project."""
    return db.query(Board).filter(
        Board.project_id == project_id, Board.is_deleted == False
    ).order_by(Board.position).all()


@router.post("/", response_model=BoardResponse, status_code=201)
def create_board(data: BoardCreate, db: Session = Depends(get_db)):
    """Create a new board."""
    board = Board(**data.model_dump())
    db.add(board)
    db.commit()
    db.refresh(board)
    return board


@router.get("/{board_id}", response_model=BoardResponse)
def get_board(board_id: int, db: Session = Depends(get_db)):
    """Get a specific board by ID."""
    board = db.query(Board).filter(
        Board.id == board_id, Board.is_deleted == False
    ).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    return board


@router.put("/{board_id}", response_model=BoardResponse)
def update_board(board_id: int, data: BoardUpdate, db: Session = Depends(get_db)):
    """Update board details."""
    board = db.query(Board).filter(
        Board.id == board_id, Board.is_deleted == False
    ).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(board, key, value)

    db.commit()
    db.refresh(board)
    return board


@router.delete("/{board_id}", response_model=BoardResponse)
def delete_board(board_id: int, db: Session = Depends(get_db)):
    """Soft-delete a board."""
    board = db.query(Board).filter(
        Board.id == board_id, Board.is_deleted == False
    ).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    board.is_deleted = True
    db.commit()
    db.refresh(board)
    return board
