const electionRepository = require('../repositories/electionRepository');
const candidateRepository = require('../repositories/candidateRepository');

class ElectionService {
  async createElection(electionData) {
    return await electionRepository.create(electionData);
  }

  async getAllElections() {
    return await electionRepository.findAll();
  }

  async updateElectionStatus(electionId, newStatus) {
    return await electionRepository.updateStatus(electionId, newStatus);
  }

  async getBallotData(electionId) {
    const positions = await electionRepository.findAllByElectionId(electionId);
    if (positions.length === 0) {
      return [];
    }

    const positionIds = positions.map(p => p.PositionID);
    const candidates = await candidateRepository.findByPositionIds(positionIds);

    const ballot = positions.map(position => {
      return {
        ...position,
        candidates: candidates.filter(c => c.PositionID === position.PositionID)
      };
    });

    return ballot;
  }
}

module.exports = new ElectionService();
