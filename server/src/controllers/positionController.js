const positionService = require('../services/positionService');

exports.getPositionsForElection = async (req, res) => {
  try {
    const positions = await positionService.getPositionsForElection(req.params.electionId);
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addPosition = async (req, res) => {
  const { title } = req.body;
  const { electionId } = req.params;
  try {
    const position = await positionService.addPositionToElection(electionId, title);
    res.status(201).json({ message: 'Position created successfully', positionId: position.PositionID });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updatePosition = async (req, res) => {
  try {
    const { title } = req.body;
    const updatedPosition = await positionService.updatePosition(req.params.positionId, title);
    res.json(updatedPosition);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deletePosition = async (req, res) => {
  try {
    await positionService.deletePosition(req.params.positionId);
    res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
