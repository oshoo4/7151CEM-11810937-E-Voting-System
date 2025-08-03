import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/votes`;

const castVote = (selections, votingToken) => {
  return axios.post(
    API_URL,
    { selections },
    {
      headers: {
        Authorization: 'Bearer ' + votingToken
      }
    }
  );
};

const voteService = {
  castVote,
};

export default voteService;