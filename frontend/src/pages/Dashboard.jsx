import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiFolder, FiUsers, FiCheckSquare, FiActivity, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getProjects, createProject, getUsers, getActivities } from '../api';

export default function Dashboard() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [activities, setActivities] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name: '', description: '', owner_id: '' });
    const [toast, setToast] = useState(null);

    const load = async () => {
        try {
            const [pRes, uRes, aRes] = await Promise.all([
                getProjects(),
                getUsers(),
                getActivities(20),
            ]);
            setProjects(pRes.data);
            setUsers(uRes.data);
            setActivities(aRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { load(); }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!form.name || !form.owner_id) return;
        try {
            await createProject({ ...form, owner_id: parseInt(form.owner_id) });
            setShowModal(false);
            setForm({ name: '', description: '', owner_id: '' });
            showToast('Project created!');
            load();
        } catch (err) {
            showToast(err.response?.data?.detail || 'Error', 'error');
        }
    };

    const formatTime = (ts) => {
        if (!ts) return '';
        try {
            const d = new Date(ts);
            return d.toLocaleString();
        } catch { return ts; }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Overview of your workspace</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <FiPlus /> New Project
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{projects.length}</div>
                    <div className="stat-label">Projects</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{users.length}</div>
                    <div className="stat-label">Users</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{activities.length}</div>
                    <div className="stat-label">Recent Activities</div>
                </div>
            </div>

            {/* Projects Grid */}
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
                    <FiFolder style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Projects
                </h2>
                {projects.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📁</div>
                        <div className="empty-state-text">No projects yet. Create your first project!</div>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {projects.map((p) => (
                            <div
                                key={p.id}
                                className="project-card"
                                onClick={() => navigate(`/projects/${p.id}`)}
                            >
                                <div className="project-card-name">{p.name}</div>
                                <div className="project-card-desc">
                                    {p.description || 'No description'}
                                </div>
                                <div className="project-card-footer">
                                    <span className="badge badge-primary">
                                        Owner: {users.find(u => u.id === p.owner_id)?.username || `#${p.owner_id}`}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {formatTime(p.created_at)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Activity Feed */}
            {activities.length > 0 && (
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">
                            <FiActivity style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                            Recent Activity
                        </span>
                    </div>
                    <div className="activity-feed">
                        {activities.map((a) => (
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

            {/* Create Project Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">New Project</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)}>
                                <FiPlus style={{ transform: 'rotate(45deg)' }} size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateProject}>
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input
                                    className="form-input"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Project name..."
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Describe the project..."
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Owner</label>
                                <select
                                    className="form-input"
                                    value={form.owner_id}
                                    onChange={(e) => setForm({ ...form, owner_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select owner...</option>
                                    {users.map((u) => (
                                        <option key={u.id} value={u.id}>{u.full_name} ({u.username})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">Create Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}
