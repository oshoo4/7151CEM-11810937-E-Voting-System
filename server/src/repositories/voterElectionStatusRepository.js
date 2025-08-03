const { sql } = require('../config/db');

class VoterElectionStatusRepository {
  async hasVoted(voterId, electionId) {
    const request = new sql.Request();
    const result = await request
      .input('VoterID', sql.Int, voterId)
      .input('ElectionID', sql.Int, electionId)
      .query('SELECT HasVoted FROM VoterElectionStatus WHERE VoterID = @VoterID AND ElectionID = @ElectionID');

    return result.recordset.length > 0 && result.recordset[0].HasVoted === true;
  }

  async markAsVoted(voterId, electionId) {
    const request = new sql.Request();
    const query = `
      IF EXISTS (SELECT 1 FROM VoterElectionStatus WHERE VoterID = @VoterID AND ElectionID = @ElectionID)
        UPDATE VoterElectionStatus SET HasVoted = 1, VerificationTimestamp = GETDATE() WHERE VoterID = @VoterID AND ElectionID = @ElectionID
      ELSE
        INSERT INTO VoterElectionStatus (VoterID, ElectionID, HasVoted, VerificationTimestamp) VALUES (@VoterID, @ElectionID, 1, GETDATE())
    `;
    await request
      .input('VoterID', sql.Int, voterId)
      .input('ElectionID', sql.Int, electionId)
      .query(query);
  }
}

module.exports = new VoterElectionStatusRepository();