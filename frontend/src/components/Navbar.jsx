import React from 'react';
import { useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

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
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    MySQL + MongoDB
                </span>
                <ThemeToggle />
            </div>
        </nav>
    );
}
