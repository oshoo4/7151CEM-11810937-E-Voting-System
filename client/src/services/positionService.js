import axios from 'axios';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/elections/`;

const getPositionsForElection = (electionId) => {
  return axios.get(API_URL + `${electionId}/positions`, { headers: getAuthHeader() });
};

const create = (electionId, title) => {
  return axios.post(API_URL + `${electionId}/positions`, { title }, { headers: getAuthHeader() });
};

const update = (electionId, positionId, newTitle) => {
  const url = `${API_URL}${electionId}/positions/${positionId}`;
  return axios.patch(url, { title: newTitle }, { headers: getAuthHeader() });
};

const deleteById = (electionId, positionId) => {
  const url = `${API_URL}${electionId}/positions/${positionId}`;
  return axios.delete(url, { headers: getAuthHeader() });
};

const positionService = {
  getPositionsForElection,
  create,
  update,
  deleteById,
};

export default positionService;
