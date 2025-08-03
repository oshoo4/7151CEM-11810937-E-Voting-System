import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/face/`;

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

const createLivenessSession = () => {
  return axios.post(API_URL + 'liveness-session', {}, { headers: getAuthHeader() });
};

const getLivenessSessionResult = (sessionId) => {
    return axios.get(API_URL + `liveness-session/${sessionId}`, { headers: getAuthHeader() });
}

const faceService = {
  createLivenessSession,
  getLivenessSessionResult,
};

export default faceService;
