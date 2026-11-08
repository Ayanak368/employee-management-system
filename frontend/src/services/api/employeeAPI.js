import API from "../api";

// Get all employees (HR)
export const getEmployees = () => API.get("list/");

// Add a new employee (HR)
export const addEmployee = (data) => API.post("list/", data);

// Update employee details (HR)
export const updateEmployee = (id, data) =>
  API.patch(`list/${id}/`, data);

// Delete an employee (HR)
export const deleteEmployee = (id) =>
  API.delete(`list/${id}/`);

// Reset employee password (HR)
export const resetPassword = (id) =>
  API.post(`list/${id}/reset-password/`);

// Get HR dashboard statistics
export const getDashboardStats = () =>
  API.get("dashboard-stats/");