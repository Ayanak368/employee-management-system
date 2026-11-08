import API from "../api";

// Get all departments
export const getDepartments = () =>
  API.get("departments/");

// Add a new department
export const addDepartment = (data) =>
  API.post("departments/", data);

// Update department details
export const updateDepartment = (id, data) =>
  API.patch(`departments/${id}/`, data);

// Delete a department
export const deleteDepartment = (id) =>
  API.delete(`departments/${id}/`);