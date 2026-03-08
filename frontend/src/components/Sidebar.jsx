import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiFolder, FiActivity } from 'react-icons/fi';

export default function Sidebar() {
    const location = useLocation();

    const links = [
        { to: '/', icon: <FiHome />, label: 'Dashboard' },
        { to: '/users', icon: <FiUsers />, label: 'Users' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">T</div>
                <span className="sidebar-brand">TaskFlow</span>
            </div>
            <nav className="sidebar-nav">
                <div className="sidebar-section-title">Navigation</div>
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                        }
                        end
                    >
                        <span className="icon">{link.icon}</span>
                        {link.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
