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

const getCandidatesForPosition = (electionId, positionId) => {
  const url = `${API_URL}${electionId}/positions/${positionId}/candidates`;
  return axios.get(url, { headers: getAuthHeader() });
};

const create = (electionId, positionId, candidateData) => {
  const url = `${API_URL}${electionId}/positions/${positionId}/candidates`;
  return axios.post(url, candidateData, { headers: getAuthHeader() });
};

const candidateService = {
  getCandidatesForPosition,
  create,
};

export default candidateService;
