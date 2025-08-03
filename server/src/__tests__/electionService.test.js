const electionService = require('../services/electionService');

const electionRepository = require('../repositories/electionRepository');

jest.mock('../repositories/electionRepository');

describe('ElectionService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateElectionStatus', () => {

    it('should call the repository to update the status and return the result', async () => {
      const testElectionId = 1;
      const newStatus = 'VotingOpen';

      const mockUpdatedElection = {
        ElectionID: testElectionId,
        Title: 'Test Election',
        Status: newStatus
      };

      electionRepository.updateStatus.mockResolvedValue(mockUpdatedElection);

      const result = await electionService.updateElectionStatus(testElectionId, newStatus);

      expect(result).toBeDefined();
      expect(result.Status).toBe(newStatus);
      expect(result.ElectionID).toBe(testElectionId);

      expect(electionRepository.updateStatus).toHaveBeenCalledTimes(1);
      expect(electionRepository.updateStatus).toHaveBeenCalledWith(testElectionId, newStatus);
    });

    it('should throw an error if the repository fails', async () => {
        const errorMessage = 'Database error';
        electionRepository.updateStatus.mockRejectedValue(new Error(errorMessage));

        await expect(electionService.updateElectionStatus(1, 'Closed'))
            .rejects.toThrow(errorMessage);
    });

  });

});
