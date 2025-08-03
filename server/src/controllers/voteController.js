const voteService = require('../services/voteService');
const voteRepository = require('../repositories/voteRepository');

exports.submitVote = async (req, res) => {
  try {
    const { votePayload, body } = req;
    const result = await voteService.castVote(votePayload, body.selections);

    const latestResults = await voteRepository.getResults(votePayload.electionId);
    
    const io = req.app.get('socketio');
    
    io.emit(`results_updated_${votePayload.electionId}`, latestResults);
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error while casting vote', error: error.message });
  }
};
