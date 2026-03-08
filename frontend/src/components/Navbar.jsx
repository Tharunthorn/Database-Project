import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();

    const getTitle = () => {
        if (location.pathname === '/') return 'Dashboard';
        if (location.pathname === '/users') return 'User Management';
        if (location.pathname.startsWith('/projects/')) return 'Project Details';
        if (location.pathname.startsWith('/boards/')) return 'Kanban Board';
        return 'TaskFlow';
    };

    return (
        <nav className="navbar">
            <h1>{getTitle()}</h1>
            <div className="navbar-actions">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    MySQL + MongoDB
                </span>
            </div>
        </nav>
    );
}
