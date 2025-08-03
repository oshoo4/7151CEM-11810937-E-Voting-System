const electionService = require('../services/electionService');

exports.getBallot = async (req, res) => {
  try {
    const ballotData = await electionService.getBallotData(req.params.electionId);
    if (ballotData.length === 0) {
      return res.status(404).json({ message: 'No positions found for this election.' });
    }
    res.json(ballotData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};