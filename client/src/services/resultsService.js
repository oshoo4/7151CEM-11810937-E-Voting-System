import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/results/`;

const get = (electionId) => {
  return axios.get(API_URL + electionId);
};

export default {
  get,
};