import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus, FiArrowLeft } from 'react-icons/fi';
import { getBoard, getTasks, createTask, updateTask, deleteTask, getActivities } from '../api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const COLUMNS = [
    { key: 'To Do', dot: 'todo' },
    { key: 'In Progress', dot: 'in-progress' },
    { key: 'Done', dot: 'done' },
];

export default function BoardPage() {
    const { boardId } = useParams();
    const navigate = useNavigate();
    const [board, setBoard] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [activities, setActivities] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [createColumn, setCreateColumn] = useState('To Do');
    const [toast, setToast] = useState(null);

    const load = async () => {
        try {
            const [bRes, tRes, aRes] = await Promise.all([
                getBoard(boardId),
                getTasks(boardId),
                getActivities(15),
            ]);
            setBoard(bRes.data);
            setTasks(tRes.data);
            setActivities(aRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { load(); }, [boardId]);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const openCreate = (column = 'To Do') => {
        setEditingTask(null);
        setCreateColumn(column);
        setShowModal(true);
    };

    const openEdit = (task) => {
        setEditingTask(task);
        setShowModal(true);
    };

    const handleSave = async (formData) => {
        try {
            if (editingTask) {
                await updateTask(editingTask.id, formData);
                showToast('Task updated!');
            } else {
                await createTask({
                    ...formData,
                    board_id: parseInt(boardId),
                    column: createColumn,
                });
                showToast('Task created!');
            }
            setShowModal(false);
            load();
        } catch (err) {
            showToast(err.response?.data?.detail || 'Error', 'error');
        }
    };

    const handleDelete = async (taskId) => {
        if (!confirm('Delete this task?')) return;
        try {
            await deleteTask(taskId);
            setShowModal(false);
            showToast('Task deleted!');
            load();
        } catch (err) {
            showToast(err.response?.data?.detail || 'Error', 'error');
        }
    };

    const getColumnTasks = (column) =>
        tasks.filter((t) => t.column === column).sort((a, b) => a.position - b.position);

    const formatTime = (ts) => {
        if (!ts) return '';
        try { return new Date(ts).toLocaleString(); } catch { return ts; }
    };

    if (!board) {
        return (
            <div className="page-container">
                <div className="empty-state">
                    <div className="empty-state-text">Loading board...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: '8px' }}>
                        <FiArrowLeft /> Back
                    </button>
                    <h1 className="page-title">{board.name}</h1>
                    <p className="page-subtitle">Kanban board — Tasks stored in MongoDB</p>
                </div>
            </div>

            {/* Kanban Columns */}
            <div className="board-columns">
                {COLUMNS.map(({ key, dot }) => {
                    const colTasks = getColumnTasks(key);
                    return (
                        <div key={key} className="board-column">
                            <div className="column-header">
                                <div className="column-title">
                                    <span className={`column-dot ${dot}`}></span>
                                    {key}
                                    <span className="column-count">{colTasks.length}</span>
                                </div>
                                <button className="btn-icon" onClick={() => openCreate(key)} title="Add task">
                                    <FiPlus size={16} />
                                </button>
                            </div>
                            <div className="column-body">
                                {colTasks.map((task) => (
                                    <TaskCard key={task.id} task={task} onClick={openEdit} />
                                ))}
                                {colTasks.length === 0 && (
                                    <div style={{
                                        textAlign: 'center', padding: '20px',
                                        color: 'var(--text-muted)', fontSize: '0.8rem',
                                    }}>
                                        No tasks
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Activity sidebar (below on this layout) */}
            {activities.length > 0 && (
                <div className="card" style={{ marginTop: '24px' }}>
                    <div className="card-header">
                        <span className="card-title">Recent Activity</span>
                    </div>
                    <div className="activity-feed">
                        {activities.slice(0, 10).map((a) => (
                            <div key={a.id} className="activity-item">
                                <div className="activity-dot"></div>
                                <div>
                                    <div className="activity-text">{a.details}</div>
                                    <div className="activity-time">{formatTime(a.timestamp)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Task Modal */}
            {showModal && (
                <TaskModal
                    task={editingTask}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    onClose={() => setShowModal(false)}
                />
            )}

            {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}
