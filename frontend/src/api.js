import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({ baseURL: API_BASE });

// ─── Users (MySQL) ───
export const getUsers = () => api.get('/users/');
export const createUser = (data) => api.post('/users/', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// ─── Projects (MySQL) ───
export const getProjects = () => api.get('/projects/');
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects/', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// ─── Boards (MySQL) ───
export const getBoards = (projectId) => api.get(`/boards/?project_id=${projectId}`);
export const getBoard = (id) => api.get(`/boards/${id}`);
export const createBoard = (data) => api.post('/boards/', data);
export const updateBoard = (id, data) => api.put(`/boards/${id}`, data);
export const deleteBoard = (id) => api.delete(`/boards/${id}`);

// ─── Tasks (MongoDB) ───
export const getTasks = (boardId) => api.get(`/tasks/?board_id=${boardId}`);
export const getTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (data) => api.post('/tasks/', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// ─── Activities (MongoDB) ───
export const getActivities = (limit = 50) => api.get(`/activities/?limit=${limit}`);

export default api;
