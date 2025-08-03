const { sql } = require('../config/db');

class CandidateRepository {
  async findByPositionId(positionId) {
    const request = new sql.Request();
    const result = await request
      .input('PositionID', sql.Int, positionId)
      .query('SELECT * FROM Candidates WHERE PositionID = @PositionID');
    return result.recordset;
  }

  async create(positionId, fullName, partyAffiliation) {
    const request = new sql.Request();
    const result = await request
      .input('PositionID', sql.Int, positionId)
      .input('FullName', sql.NVarChar, fullName)
      .input('PartyAffiliation', sql.NVarChar, partyAffiliation)
      .query(`
        INSERT INTO Candidates (PositionID, FullName, PartyAffiliation) 
        VALUES (@PositionID, @FullName, @PartyAffiliation);
        SELECT SCOPE_IDENTITY() AS CandidateID;
      `);
    return result.recordset[0];
  }

  async findByPositionIds(positionIds) {
    if (positionIds.length === 0) {
      return [];
    }
    const request = new sql.Request();
    const idList = positionIds.join(',');
    const result = await request.query(
      `SELECT * FROM Candidates WHERE PositionID IN (${idList})`
    );
    return result.recordset;
  }
}

module.exports = new CandidateRepository();