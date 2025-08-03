const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
const voterElectionStatusRepository = require('../repositories/voterElectionStatusRepository');

const votingAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No voting token provided.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hasVoted = await voterElectionStatusRepository.hasVoted(decoded.voterId, decoded.electionId);
    if (hasVoted) {
      return res.status(403).json({ message: 'This voter has already cast their ballot.' });
    }

    req.votePayload = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Voting token is not valid or has expired.' });
  }
};

module.exports = votingAuthMiddleware;