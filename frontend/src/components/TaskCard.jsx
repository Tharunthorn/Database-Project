import React from 'react';

const LABEL_CLASSES = {
    bug: 'label-bug',
    feature: 'label-feature',
    improvement: 'label-improvement',
    urgent: 'label-urgent',
};

export default function TaskCard({ task, onClick }) {
    return (
        <div className="task-card" onClick={() => onClick && onClick(task)}>
            {task.labels && task.labels.length > 0 && (
                <div className="task-card-labels">
                    {task.labels.map((label, i) => (
                        <span
                            key={i}
                            className={`task-label ${LABEL_CLASSES[label] || 'label-default'}`}
                        >
                            {label}
                        </span>
                    ))}
                </div>
            )}
            <div className="task-card-title">{task.title}</div>
            {task.description && (
                <div className="task-card-desc">{task.description}</div>
            )}
            <div className="task-card-meta">
                <div className="task-card-meta-item">
                    <span className={`priority-dot priority-${task.priority}`}></span>
                    {task.priority}
                </div>
                {task.due_date && (
                    <div className="task-card-meta-item">📅 {task.due_date}</div>
                )}
                {task.checklist && task.checklist.length > 0 && (
                    <div className="task-card-meta-item">
                        ✅ {task.checklist.filter((c) => c.done).length}/{task.checklist.length}
                    </div>
                )}
            </div>
        </div>
    );
}
