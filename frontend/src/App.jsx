import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import ProjectPage from './pages/ProjectPage';
import BoardPage from './pages/BoardPage';
import LoginPage from './pages/LoginPage';

function ProtectedLayout() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100vh', background: 'var(--bg-primary)', color: 'var(--text-muted)',
                fontSize: '1rem',
            }}>
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="app-layout">
            <Sidebar />
            <Navbar />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/projects/:projectId" element={<ProjectPage />} />
                    <Route path="/boards/:boardId" element={<BoardPage />} />
                </Routes>
            </div>
        </div>
    );
}

function AuthGate() {
    const { user, loading } = useAuth();

    if (loading) return null;
    if (user) return <Navigate to="/" replace />;
    return <LoginPage />;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<AuthGate />} />
                    <Route path="/*" element={<ProtectedLayout />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
