const faceApiService = require('../services/faceApiService');

exports.createLivenessSession = async (req, res) => {
  try {
    const session = await faceApiService.createLivenessSession();
    res.json({ sessionId: session.sessionId, authToken: session.authToken });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create liveness session', error: error.message });
  }
};

exports.getLivenessSessionResult = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await faceApiService.getLivenessSessionResult(sessionId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get session result', error: error.message });
  }
};

exports.deleteLivenessSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await faceApiService.deleteLivenessSession(sessionId);
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete session', error: error.message });
  }
};
