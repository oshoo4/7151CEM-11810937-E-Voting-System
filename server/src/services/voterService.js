const dotenv = require('dotenv');
dotenv.config();

const voterRepository = require('../repositories/voterRepository');
const faceApiService = require('./faceApiService');
const blobStorageService = require('./blobStorageService');
const voterElectionStatusRepository = require('../repositories/voterElectionStatusRepository');
const electionRepository = require('../repositories/electionRepository');
const jwt = require('jsonwebtoken');

class VoterService {

  async registerVoter(voterData, imageFile) {
    let azurePersonId, photoUrl;
    
    try {
      [azurePersonId, photoUrl] = await Promise.all([
        faceApiService.enrollFace(imageFile.buffer),
        blobStorageService.uploadImage(imageFile.buffer, imageFile.originalname)
      ]);
    } catch (error) {
      throw new Error('Failed to process voter image with Azure services.');
    }

    if (!azurePersonId || !photoUrl) {
      throw new Error('Failed to process voter image with Azure services.');
    }

    const fullVoterData = {
      ...voterData,
      AzurePersonID: azurePersonId,
      PhotoUrl: photoUrl,
    };

    return await voterRepository.create(fullVoterData);
  }

  async authenticateVoter(publicVoterId, imageBuffer) {
    const voter = await voterRepository.findByPublicVoterID(publicVoterId);
    if (!voter) { throw new Error('Voter not found.'); }
    
    const activeElection = await electionRepository.findActive();
    if (!activeElection) {
      throw new Error('No active election is currently open for voting.');
    }
    const activeElectionId = activeElection.ElectionID;
    
    const hasVoted = await voterElectionStatusRepository.hasVoted(voter.VoterID, activeElectionId);
    if (hasVoted) {
      throw new Error('This voter has already cast their ballot for this election.');
    }

    const azurePersonIdAsString = String(voter.AzurePersonID).toLowerCase();
    const verificationResult = await faceApiService.verifyFace(imageBuffer, azurePersonIdAsString);
    if (!verificationResult.isIdentical || verificationResult.confidence < 0.75) {
      throw new Error('Facial verification failed. Confidence too low.');
    }

    const payload = { voterId: voter.VoterID, electionId: activeElectionId };
    const votingToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });

    return { 
      success: true, 
      message: 'Verification successful. Proceed to ballot.',
      voter: { FullName: voter.FullName },
      votingToken: votingToken, 
      electionId: payload.electionId,
      verificationResult: verificationResult
    };
  }
}

module.exports = new VoterService();