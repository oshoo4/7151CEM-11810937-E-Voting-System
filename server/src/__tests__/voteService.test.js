const voteService = require('../services/voteService');

const voteRepository = require('../repositories/voteRepository');
const voterElectionStatusRepository = require('../repositories/voterElectionStatusRepository');

jest.mock('../repositories/voteRepository');
jest.mock('../repositories/voterElectionStatusRepository');

describe('VoteService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('castVote', () => {

    it('should call repositories to create votes and mark voter as voted', async () => {
      const votePayload = { voterId: 1, electionId: 1 };
      const selections = { 'pos1': 'cand1', 'pos2': 'cand2' };

      voteRepository.createVotes.mockResolvedValue();
      voterElectionStatusRepository.markAsVoted.mockResolvedValue();

      const result = await voteService.castVote(votePayload, selections);

      expect(voteRepository.createVotes).toHaveBeenCalledTimes(1);
      expect(voteRepository.createVotes).toHaveBeenCalledWith(votePayload.electionId, selections);

      expect(voterElectionStatusRepository.markAsVoted).toHaveBeenCalledTimes(1);
      expect(voterElectionStatusRepository.markAsVoted).toHaveBeenCalledWith(votePayload.voterId, votePayload.electionId);
      
      expect(result).toEqual({ success: true, message: 'Vote cast successfully.' });
    });

    it('should throw an error and not mark voter as voted if creating votes fails', async () => {
        const votePayload = { voterId: 1, electionId: 1 };
        const selections = { 'pos1': 'cand1' };
        const errorMessage = 'Database transaction failed';

        voteRepository.createVotes.mockRejectedValue(new Error(errorMessage));

        await expect(voteService.castVote(votePayload, selections))
            .rejects.toThrow(errorMessage);

        expect(voterElectionStatusRepository.markAsVoted).not.toHaveBeenCalled();
    });

  });
});
