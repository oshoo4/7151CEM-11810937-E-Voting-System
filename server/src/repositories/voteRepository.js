const { sql } = require('../config/db');

class VoteRepository {

  async createVotes(electionId, selections) {
    const transaction = new sql.Transaction();
    await transaction.begin();

    try {
      for (const positionId in selections) {
        const request = new sql.Request(transaction);
        const candidateId = selections[positionId];
        await request.query`INSERT INTO Votes (ElectionID, CandidateID) VALUES (${electionId}, ${candidateId})`;
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async getResults(electionId) {
    const request = new sql.Request();
    const result = await request
      .input('ElectionID', sql.Int, electionId)
      .query(`
        SELECT 
          c.CandidateID, 
          c.FullName, 
          c.PartyAffiliation, 
          p.Title AS PositionTitle,
          COUNT(v.VoteID) AS VoteCount
        FROM Candidates c
        JOIN Positions p ON c.PositionID = p.PositionID
        LEFT JOIN Votes v ON c.CandidateID = v.CandidateID AND v.ElectionID = @ElectionID
        WHERE p.ElectionID = @ElectionID
        GROUP BY c.CandidateID, c.FullName, c.PartyAffiliation, p.Title
        ORDER BY p.Title, VoteCount DESC;
      `);
    return result.recordset;
  }
}

module.exports = new VoteRepository();
