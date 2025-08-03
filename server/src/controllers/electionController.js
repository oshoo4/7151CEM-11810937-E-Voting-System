const electionService = require('../services/electionService');
const electionRepository = require('../repositories/electionRepository');

exports.createElection = async (req, res) => {
  try {
    const election = await electionService.createElection(req.body);
    res.status(201).json({ message: 'Election created successfully', electionId: election.ElectionID });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllElections = async (req, res) => {
  try {
    const elections = await electionService.getAllElections();
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getElectionById = async (req, res) => {
    try {
        const election = await electionRepository.findById(req.params.electionId);
        if (!election) { 
            return res.status(404).json({ message: 'Election not found.' }); 
        }
        res.json(election);
    } catch (error) { 
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getActiveElection = async (req, res) => {
  try {
    const election = await electionRepository.findActive();
    if (!election) {
      return res.status(404).json({ message: 'No active election found.' });
    }
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateElectionStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const election = await electionService.updateElectionStatus(req.params.electionId, status);
      res.json(election);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
