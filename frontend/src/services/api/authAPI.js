import API from "../api";

// Login
export const loginUser = (data) =>
  API.post("http://127.0.0.1:8000/api/token/", data);

// Logout
export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");

  window.location.href = "/login";
};