import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/users/`;
const AUTH_API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/`;

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

const getAllStaff = () => {
  return axios.get(API_URL + 'staff', { headers: getAuthHeader() });
};

const createStaff = (staffData) => {
  return axios.post(AUTH_API_URL + 'register', { ...staffData, role: 'Staff' }, { headers: getAuthHeader() });
};

const updateUserStatus = (userId, isActive) => {
  return axios.patch(API_URL + `${userId}/status`, { isActive }, { headers: getAuthHeader() });
};

const userService = {
  getAllStaff,
  createStaff,
  updateUserStatus,
};

export default userService;
