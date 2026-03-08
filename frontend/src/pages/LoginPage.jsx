import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { FiLogIn, FiUserPlus, FiMail, FiUser, FiLock } from 'react-icons/fi';

export default function LoginPage() {
    const { login, register } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ username: '', password: '', email: '', full_name: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isRegister) {
                await register(form);
            } else {
                await login(form.username, form.password);
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                {/* Logo */}
                <div className="login-logo">
                    <img src="/logo.png" alt="TaskFlow" width="64" height="64" style={{ borderRadius: '14px' }} />
                    <h1 className="login-brand">TaskFlow</h1>
                    <p className="login-tagline">Manage your work, your way</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    <h2 className="login-title">
                        {isRegister ? 'Create Account' : 'Welcome Back'}
                    </h2>

                    {error && <div className="login-error">{error}</div>}

                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <div className="login-input-wrapper">
                            <FiUser className="login-input-icon" />
                            <input
                                className="form-input login-input"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                required
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    {isRegister && (
                        <>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <div className="login-input-wrapper">
                                    <FiMail className="login-input-icon" />
                                    <input
                                        className="form-input login-input"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div className="login-input-wrapper">
                                    <FiUser className="login-input-icon" />
                                    <input
                                        className="form-input login-input"
                                        name="full_name"
                                        value={form.full_name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="login-input-wrapper">
                            <FiLock className="login-input-icon" />
                            <input
                                className="form-input login-input"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                autoComplete={isRegister ? 'new-password' : 'current-password'}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                        {loading ? 'Please wait...' : (
                            isRegister ? <><FiUserPlus /> Create Account</> : <><FiLogIn /> Sign In</>
                        )}
                    </button>

                    <div className="login-switch">
                        {isRegister ? 'Already have an account?' : "Don't have an account?"}
                        <button
                            type="button"
                            className="login-switch-btn"
                            onClick={() => { setIsRegister(!isRegister); setError(''); }}
                        >
                            {isRegister ? 'Sign In' : 'Create Account'}
                        </button>
                    </div>
                </form>

                <div className="login-footer">
                    <span>MySQL</span>
                    <span className="login-footer-dot">·</span>
                    <span>MongoDB</span>
                    <span className="login-footer-dot">·</span>
                    <span>FastAPI</span>
                </div>
            </div>
        </div>
    );
}
