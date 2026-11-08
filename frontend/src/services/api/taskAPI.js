import API from "../api";

// Get all tasks for the logged-in user
export const getTasks = () =>
  API.get("http://127.0.0.1:8000/tasks/");

// Get my tasks (Employee Dashboard)
export const getMyTasks = () =>
  API.get("http://127.0.0.1:8000/tasks/");

// Add a new task (Manager)
export const addTask = (data) =>
  API.post("http://127.0.0.1:8000/tasks/", data);

// Update task details or status
export const updateTask = (id, data) =>
  API.patch(`http://127.0.0.1:8000/tasks/${id}/`, data);

// Delete a task (Manager)
export const deleteTask = (id) =>
  API.delete(`http://127.0.0.1:8000/tasks/${id}/`);