import API from "../api";

// Get all managers (HR)
export const getManagers = () =>
  API.get("managers/");

// Create a new manager (HR)
export const createManager = (data) =>
  API.post("managers/", data);

// Delete a manager (HR)
export const deleteManager = (id) =>
  API.delete(`managers/${id}/`);

// Get employees belonging to the logged-in manager's department
export const getManagerEmployees = () =>
  API.get("manager/employees/");