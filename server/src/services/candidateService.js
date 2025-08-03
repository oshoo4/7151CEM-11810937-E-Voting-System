const candidateRepository = require('../repositories/candidateRepository');

class CandidateService {
  async getCandidatesForPosition(positionId) {
    return await candidateRepository.findByPositionId(positionId);
  }

  async addCandidateToPosition(positionId, fullName, partyAffiliation) {
    return await candidateRepository.create(positionId, fullName, partyAffiliation);
  }
}

module.exports = new CandidateService();