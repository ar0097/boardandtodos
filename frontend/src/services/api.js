const API_BASE_URL = 'https://boardandtodos.vercel.app/api';

export const getToken = () => localStorage.getItem('token');

export const setToken = (token) => {
    localStorage.setItem('token', token);
};

export const removeToken = () => {
    localStorage.removeItem('token');
};

export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = () => {
    localStorage.removeItem('user');
};

const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options.headers || {}),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || 'Something went wrong');
    }

    return response.json();
};

export const register = (name, email, password) =>
    apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    });

export const login = (email, password) =>
    apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

export const getBoards = () => apiRequest('/boards');

export const createBoard = (title) =>
    apiRequest('/boards', {
        method: 'POST',
        body: JSON.stringify({ title }),
    });

export const updateBoard = (boardId, title) =>
    apiRequest(`/boards/${boardId}`, {
        method: 'PUT',
        body: JSON.stringify({ title }),
    });

export const deleteBoard = (boardId) =>
    apiRequest(`/boards/${boardId}`, {
        method: 'DELETE',
    });

export const getTodos = (boardId) =>
    apiRequest(`/todos/${boardId}`);

export const createTodo = (title, description, boardId) =>
    apiRequest('/todos', {
        method: 'POST',
        body: JSON.stringify({ title, description, boardId }),
    });

export const updateTodo = (todoId, title, description, boardId) =>
    apiRequest(`/todos/${todoId}`, {
        method: 'PUT',
        body: JSON.stringify({ title, description, boardId }),
    });

export const deleteTodo = (todoId) =>
    apiRequest(`/todos/${todoId}`, {
        method: 'DELETE',
    });
