import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import ProjectPage from './pages/ProjectPage';
import BoardPage from './pages/BoardPage';

export default function App() {
    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
}
