import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/voters/`;

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
};

const register = (fullName, dateOfBirth, imageBlob) => {
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('voterPhoto', imageBlob, 'voter.jpeg');

    return axios.post(API_URL + 'register', formData, {
        headers: getAuthHeader(),
    });
};

const verify = (publicId, imageBlob) => {
  const formData = new FormData();
  formData.append('publicVoterId', publicId);
  formData.append('voterPhoto', imageBlob, 'verification.jpeg');
  
  return axios.post(API_URL + 'verify', formData, {
      headers: getAuthHeader(),
  });
};

const findByPublicId = (publicId) => {
  return axios.get(API_URL + publicId, { headers: getAuthHeader() });
};

const voterService = {
  register,
  findByPublicId,
  verify,
};

export default voterService;
