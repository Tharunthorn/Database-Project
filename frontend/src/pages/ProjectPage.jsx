import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus, FiArrowLeft, FiEdit2, FiTrash2, FiX, FiLayout } from 'react-icons/fi';
import {
    getProject, updateProject, deleteProject,
    getBoards, createBoard, updateBoard, deleteBoard,
} from '../api';

export default function ProjectPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [boards, setBoards] = useState([]);
    const [showBoardModal, setShowBoardModal] = useState(false);
    const [showEditProject, setShowEditProject] = useState(false);
    const [editingBoard, setEditingBoard] = useState(null);
    const [boardForm, setBoardForm] = useState({ name: '', position: 0 });
    const [projectForm, setProjectForm] = useState({ name: '', description: '' });
    const [toast, setToast] = useState(null);

    const load = async () => {
        try {
            const [pRes, bRes] = await Promise.all([
                getProject(projectId),
                getBoards(projectId),
            ]);
            setProject(pRes.data);
            setBoards(bRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { load(); }, [projectId]);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Board CRUD
    const openCreateBoard = () => {
        setEditingBoard(null);
        setBoardForm({ name: '', position: boards.length });
        setShowBoardModal(true);
    };

    const openEditBoard = (board, e) => {
        e.stopPropagation();
        setEditingBoard(board);
        setBoardForm({ name: board.name, position: board.position });
        setShowBoardModal(true);
    };

    const handleBoardSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBoard) {
                await updateBoard(editingBoard.id, boardForm);
                showToast('Board updated!');
            } else {
                await createBoard({ ...boardForm, project_id: parseInt(projectId) });
                showToast('Board created!');
            }
            setShowBoardModal(false);
            load();
        } catch (err) {
            showToast(err.response?.data?.detail || 'Error', 'error');
        }
    };

    const handleDeleteBoard = async (boardId, e) => {
        e.stopPropagation();
        try {
            await deleteBoard(boardId);
            showToast('Board deleted!');
            load();
        } catch (err) {
            showToast(err.response?.data?.detail || 'Error deleting board', 'error');
        }
    };

    // Project edit/delete
    const openEditProject = () => {
        if (!project) return;
        setProjectForm({ name: project.name, description: project.description || '' });
        setShowEditProject(true);
    };

    const handleProjectUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateProject(projectId, projectForm);
            showToast('Project updated!');
            setShowEditProject(false);
            load();
        } catch (err) {
            showToast(err.response?.data?.detail || 'Error', 'error');
        }
    };

    const handleProjectDelete = async () => {
        try {
            await deleteProject(projectId);
            showToast('Project deleted!');
            navigate('/');
        } catch (err) {
            showToast(err.response?.data?.detail || 'Error deleting project', 'error');
        }
    };

    if (!project) {
        return (
            <div className="page-container">
                <div className="empty-state">
                    <div className="empty-state-text">Loading project...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ marginBottom: '8px' }}>
                        <FiArrowLeft /> Back to Dashboard
                    </button>
                    <h1 className="page-title">{project.name}</h1>
                    <p className="page-subtitle">{project.description || 'No description'}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary" onClick={openEditProject}>
                        <FiEdit2 /> Edit
                    </button>
                    <button className="btn btn-danger" onClick={handleProjectDelete}>
                        <FiTrash2 /> Delete
                    </button>
                </div>
            </div>

            {/* Boards Section */}
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    <FiLayout style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Boards
                </h2>
                <button className="btn btn-primary btn-sm" onClick={openCreateBoard}>
                    <FiPlus /> Add Board
                </button>
            </div>

            {boards.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <div className="empty-state-text">No boards yet. Create a board to start managing tasks!</div>
                    <button className="btn btn-primary" onClick={openCreateBoard}>
                        <FiPlus /> Create Board
                    </button>
                </div>
            ) : (
                <div className="boards-grid">
                    {boards.map((b) => (
                        <div key={b.id} className="board-item" onClick={() => navigate(`/boards/${b.id}`)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, fontSize: '1rem' }}>{b.name}</span>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <button className="btn-icon" onClick={(e) => openEditBoard(b, e)} title="Edit">
                                        <FiEdit2 size={15} />
                                    </button>
                                    <button
                                        className="btn-icon"
                                        onClick={(e) => handleDeleteBoard(b.id, e)}
                                        title="Delete"
                                        style={{ color: 'var(--danger)' }}
                                    >
                                        <FiTrash2 size={15} />
                                    </button>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                                Position: {b.position}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Board Modal */}
            {showBoardModal && (
                <div className="modal-overlay" onClick={() => setShowBoardModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editingBoard ? 'Edit Board' : 'New Board'}</h2>
                            <button className="btn-icon" onClick={() => setShowBoardModal(false)}><FiX size={20} /></button>
                        </div>
                        <form onSubmit={handleBoardSubmit}>
                            <div className="form-group">
                                <label className="form-label">Board Name</label>
                                <input
                                    className="form-input"
                                    value={boardForm.name}
                                    onChange={(e) => setBoardForm({ ...boardForm, name: e.target.value })}
                                    placeholder="e.g. Sprint 1, Backlog..."
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Position</label>
                                <input
                                    className="form-input"
                                    type="number"
                                    value={boardForm.position}
                                    onChange={(e) => setBoardForm({ ...boardForm, position: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowBoardModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingBoard ? 'Update' : 'Create'} Board</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Project Modal */}
            {showEditProject && (
                <div className="modal-overlay" onClick={() => setShowEditProject(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Edit Project</h2>
                            <button className="btn-icon" onClick={() => setShowEditProject(false)}><FiX size={20} /></button>
                        </div>
                        <form onSubmit={handleProjectUpdate}>
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input
                                    className="form-input"
                                    value={projectForm.name}
                                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input"
                                    value={projectForm.description}
                                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowEditProject(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Update Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}
