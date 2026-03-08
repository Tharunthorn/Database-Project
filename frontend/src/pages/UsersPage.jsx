import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { getUsers, createUser, updateUser, deleteUser } from '../api';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ username: '', email: '', full_name: '', role: 'member' });
    const [toast, setToast] = useState(null);

    const load = async () => {
        try {
            const res = await getUsers();
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { load(); }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const openCreate = () => {
        setEditing(null);
        setForm({ username: '', email: '', full_name: '', role: 'member' });
        setShowModal(true);
    };

    const openEdit = (user) => {
        setEditing(user);
        setForm({ username: user.username, email: user.email, full_name: user.full_name, role: user.role });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await updateUser(editing.id, form);
                showToast('User updated!');
            } else {
                await createUser(form);
                showToast('User created!');
            }
            setShowModal(false);
            load();
        } catch (err) {
            showToast(err.response?.data?.detail || 'Error', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this user?')) return;
        try {
            await deleteUser(id);
            showToast('User deleted!');
            load();
        } catch (err) {
            showToast(err.response?.data?.detail || 'Error', 'error');
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Users</h1>
                    <p className="page-subtitle">Manage user accounts (MySQL)</p>
                </div>
                <button className="btn btn-primary" onClick={openCreate}>
                    <FiPlus /> Add User
                </button>
            </div>

            <div className="card">
                {users.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">👤</div>
                        <div className="empty-state-text">No users yet. Add your first user!</div>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Full Name</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>{u.full_name}</td>
                                    <td>
                                        <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button className="btn-icon" onClick={() => openEdit(u)} title="Edit">
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button
                                                className="btn-icon"
                                                onClick={() => handleDelete(u.id)}
                                                title="Delete"
                                                style={{ color: 'var(--danger)' }}
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{editing ? 'Edit User' : 'New User'}</h2>
                            <button className="btn-icon" onClick={() => setShowModal(false)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Username</label>
                                <input
                                    className="form-input"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="Enter username..."
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    className="form-input"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Enter email..."
                                    required
                                    type="email"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    className="form-input"
                                    name="full_name"
                                    value={form.full_name}
                                    onChange={handleChange}
                                    placeholder="Enter full name..."
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <select className="form-input" name="role" value={form.role} onChange={handleChange}>
                                    <option value="member">Member</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editing ? 'Update' : 'Create'} User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}
