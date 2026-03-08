import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('taskflow-theme');
        return saved || 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('taskflow-theme', theme);
    }, [theme]);

    return (
        <div className="theme-toggle">
            <button
                className={`theme-toggle-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
                title="Light mode"
                aria-label="Switch to light mode"
            >
                <FiSun />
            </button>
            <button
                className={`theme-toggle-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
                title="Dark mode"
                aria-label="Switch to dark mode"
            >
                <FiMoon />
            </button>
        </div>
    );
}
