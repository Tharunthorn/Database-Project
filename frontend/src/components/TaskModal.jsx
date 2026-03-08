import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';

const COLUMNS = ['To Do', 'In Progress', 'Done'];
const PRIORITIES = ['low', 'medium', 'high'];

export default function TaskModal({ task, onSave, onDelete, onClose }) {
    const isEdit = !!task;

    const [form, setForm] = useState({
        title: '',
        description: '',
        column: 'To Do',
        priority: 'medium',
        labels: [],
        due_date: '',
        checklist: [],
    });
    const [newLabel, setNewLabel] = useState('');
    const [newCheckItem, setNewCheckItem] = useState('');

    useEffect(() => {
        if (task) {
            setForm({
                title: task.title || '',
                description: task.description || '',
                column: task.column || 'To Do',
                priority: task.priority || 'medium',
                labels: task.labels || [],
                due_date: task.due_date || '',
                checklist: task.checklist || [],
            });
        }
    }, [task]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addLabel = () => {
        if (newLabel.trim() && !form.labels.includes(newLabel.trim())) {
            setForm({ ...form, labels: [...form.labels, newLabel.trim().toLowerCase()] });
            setNewLabel('');
        }
    };

    const removeLabel = (label) => {
        setForm({ ...form, labels: form.labels.filter((l) => l !== label) });
    };

    const addCheckItem = () => {
        if (newCheckItem.trim()) {
            setForm({
                ...form,
                checklist: [...form.checklist, { text: newCheckItem.trim(), done: false }],
            });
            setNewCheckItem('');
        }
    };

    const toggleCheckItem = (index) => {
        const updated = [...form.checklist];
        updated[index] = { ...updated[index], done: !updated[index].done };
        setForm({ ...form, checklist: updated });
    };

    const removeCheckItem = (index) => {
        setForm({ ...form, checklist: form.checklist.filter((_, i) => i !== index) });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        onSave(form);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{isEdit ? 'Edit Task' : 'New Task'}</h2>
                    <button className="btn-icon" onClick={onClose}>
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            className="form-input"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter task title..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-input"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe the task..."
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="form-group">
                            <label className="form-label">Column</label>
                            <select
                                className="form-input"
                                name="column"
                                value={form.column}
                                onChange={handleChange}
                            >
                                {COLUMNS.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Priority</label>
                            <select
                                className="form-input"
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                            >
                                {PRIORITIES.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Due Date</label>
                        <input
                            className="form-input"
                            type="date"
                            name="due_date"
                            value={form.due_date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Labels</label>
                        <div className="labels-container">
                            {form.labels.map((label) => (
                                <span key={label} className="label-chip">
                                    {label}
                                    <button type="button" onClick={() => removeLabel(label)}>×</button>
                                </span>
                            ))}
                        </div>
                        <div className="add-checklist-row">
                            <input
                                className="form-input"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                placeholder="Add label (e.g. bug, feature)..."
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                            />
                            <button type="button" className="btn btn-secondary btn-sm" onClick={addLabel}>
                                <FiPlus />
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Checklist</label>
                        <div className="checklist">
                            {form.checklist.map((item, i) => (
                                <div key={i} className="checklist-item">
                                    <input
                                        type="checkbox"
                                        checked={item.done}
                                        onChange={() => toggleCheckItem(i)}
                                    />
                                    <span className={`checklist-item-text ${item.done ? 'done' : ''}`}>
                                        {item.text}
                                    </span>
                                    <button
                                        type="button"
                                        className="btn-icon"
                                        onClick={() => removeCheckItem(i)}
                                        style={{ marginLeft: 'auto' }}
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="add-checklist-row" style={{ marginTop: '8px' }}>
                            <input
                                className="form-input"
                                value={newCheckItem}
                                onChange={(e) => setNewCheckItem(e.target.value)}
                                placeholder="Add checklist item..."
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCheckItem())}
                            />
                            <button type="button" className="btn btn-secondary btn-sm" onClick={addCheckItem}>
                                <FiPlus />
                            </button>
                        </div>
                    </div>

                    <div className="modal-actions">
                        {isEdit && onDelete && (
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => onDelete(task.id)}
                                style={{ marginRight: 'auto' }}
                            >
                                <FiTrash2 /> Delete
                            </button>
                        )}
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {isEdit ? 'Update' : 'Create'} Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
