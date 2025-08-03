import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/elections/`;

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

const create = (electionData) => {
  return axios.post(API_URL, electionData, { headers: getAuthHeader() });
};

const getAll = () => {
  return axios.get(API_URL, { headers: getAuthHeader() });
};

const getById = (electionId) => {
  return axios.get(API_URL + electionId, { headers: getAuthHeader() });
};

const getActive = () => {
  return axios.get(API_URL + 'active', { headers: getAuthHeader() });
};

const updateStatus = (electionId, status) => {
  return axios.patch(API_URL + `${electionId}/status`, { status }, { headers: getAuthHeader() });
};

const electionService = {
  create,
  getAll,
  getById,
  getActive,
  updateStatus,
};

export default electionService;
