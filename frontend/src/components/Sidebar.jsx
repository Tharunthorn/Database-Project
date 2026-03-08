import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../AuthContext';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = [
        { to: '/', icon: <FiHome />, label: 'Dashboard' },
        { to: '/users', icon: <FiUsers />, label: 'Users' },
    ];

    const closeMobile = () => setMobileOpen(false);

    return (
        <>
            {/* Mobile hamburger */}
            <button
                className="mobile-menu-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
            >
                {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            {/* Overlay for mobile */}
            {mobileOpen && <div className="sidebar-overlay" onClick={closeMobile} />}

            <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
                            <path d="M14 16h20v3H14zM14 23h14v3H14zM14 30h18v3H14z" fill="white" opacity="0.9" />
                            <rect x="34" y="22" width="4" height="12" rx="2" fill="white" />
                        </svg>
                    </div>
                    <span className="sidebar-brand">TaskFlow</span>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section-title">Navigation</div>
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                            end
                            onClick={closeMobile}
                        >
                            <span className="icon">{link.icon}</span>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* User info + logout */}
                <div className="sidebar-footer">
                    {user && (
                        <div className="sidebar-user">
                            <div className="sidebar-user-avatar">
                                {user.full_name?.[0] || user.username?.[0] || 'U'}
                            </div>
                            <div className="sidebar-user-info">
                                <div className="sidebar-user-name">{user.full_name || user.username}</div>
                                <div className="sidebar-user-role">{user.role}</div>
                            </div>
                        </div>
                    )}
                    <button className="sidebar-link sidebar-logout-btn" onClick={logout}>
                        <span className="icon"><FiLogOut /></span>
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
