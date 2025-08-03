const voterService = require('../services/voterService');
const voterRepository = require('../repositories/voterRepository');

exports.registerVoter = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Voter photo is required.' });
    }
    
    const voterData = {
      FullName: req.body.fullName,
      DateOfBirth: req.body.dateOfBirth,
      PublicVoterID: `VOTER-${Date.now()}`
    };

    const newVoter = await voterService.registerVoter(voterData, req.file);
    res.status(201).json({ message: 'Voter registered successfully', voter: newVoter });

  } catch (error) {
    res.status(500).json({ message: 'Server error during voter registration', error: error.message });
  }
};

exports.verifyVoter = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Live voter photo is required.' });
    }
    const { publicVoterId } = req.body;
    
    const result = await voterService.authenticateVoter(publicVoterId, req.file.buffer);
    
    res.json(result);

  } catch (error) {
    res.status(401).json({ success: false, message: 'Authentication Failed', error: error.message });
  }
};

exports.getVoterByPublicId = async (req, res) => {
    try {
      const voter = await voterRepository.findByPublicVoterID(req.params.publicVoterId);
      if (!voter) {
        return res.status(404).json({ message: 'Voter not found.' });
      }
      res.json({
        PublicVoterID: voter.PublicVoterID,
        FullName: voter.FullName,
        DateOfBirth: voter.DateOfBirth
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
