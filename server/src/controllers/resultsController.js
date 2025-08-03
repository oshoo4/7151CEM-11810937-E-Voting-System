const voteRepository = require('../repositories/voteRepository');

exports.getResultsByElectionId = async (req, res) => {
  try {
    const results = await voteRepository.getResults(req.params.electionId);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};