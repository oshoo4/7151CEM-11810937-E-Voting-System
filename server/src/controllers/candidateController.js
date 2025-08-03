const candidateService = require('../services/candidateService');

exports.getCandidatesForPosition = async (req, res) => {
  try {
    const candidates = await candidateService.getCandidatesForPosition(req.params.positionId);
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addCandidate = async (req, res) => {
  const { fullName, partyAffiliation } = req.body;
  const { positionId } = req.params;
  try {
    const candidate = await candidateService.addCandidateToPosition(positionId, fullName, partyAffiliation);
    res.status(201).json({ message: 'Candidate created successfully', candidateId: candidate.CandidateID });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};