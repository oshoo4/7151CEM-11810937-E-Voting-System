const voteRepository = require('../repositories/voteRepository');
const voterElectionStatusRepository = require('../repositories/voterElectionStatusRepository');

class VoteService {
  async castVote(votePayload, selections) {
    const { voterId, electionId } = votePayload;

    await voteRepository.createVotes(electionId, selections);

    await voterElectionStatusRepository.markAsVoted(voterId, electionId);

    return { success: true, message: 'Vote cast successfully.' };
  }
}

module.exports = new VoteService();