const positionRepository = require('../repositories/positionRepository');

class PositionService {
  async getPositionsForElection(electionId) {
    return await positionRepository.findByElectionId(electionId);
  }

  async addPositionToElection(electionId, title) {
    return await positionRepository.create(electionId, title);
  }

  async updatePosition(positionId, newTitle) {
    return await positionRepository.update(positionId, newTitle);
  }

  async deletePosition(positionId) {
    return await positionRepository.deleteById(positionId);
  }
}

module.exports = new PositionService();
