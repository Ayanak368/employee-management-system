import API from "../api";

// Get the logged-in user's profile
export const getMyProfile = () =>
  API.get("profile/");

// Change the logged-in user's password
export const changePassword = (data) =>
  API.post("http://127.0.0.1:8000/accounts/change-password/", data);