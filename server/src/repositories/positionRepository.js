const { sql } = require('../config/db');

class PositionRepository {
  async findByElectionId(electionId) {
    const request = new sql.Request();
    const result = await request
      .input('ElectionID', sql.Int, electionId)
      .query('SELECT * FROM Positions WHERE ElectionID = @ElectionID');
    return result.recordset;
  }

  async create(electionId, title) {
    const request = new sql.Request();
    const result = await request
      .input('ElectionID', sql.Int, electionId)
      .input('Title', sql.NVarChar, title)
      .query(`
        INSERT INTO Positions (ElectionID, Title) 
        VALUES (@ElectionID, @Title);
        SELECT SCOPE_IDENTITY() AS PositionID;
      `);
    return result.recordset[0];
  }

  async update(positionId, newTitle) {
    const request = new sql.Request();
    const result = await request
      .input('PositionID', sql.Int, positionId)
      .input('Title', sql.NVarChar, newTitle)
      .query(`
        UPDATE Positions 
        SET Title = @Title 
        OUTPUT inserted.* WHERE PositionID = @PositionID;
      `);
    return result.recordset[0];
  }

  async deleteById(positionId) {
    const transaction = new sql.Transaction();
    await transaction.begin();
    try {
      let request = new sql.Request(transaction);
      await request.input('PositionID_Cand', sql.Int, positionId).query('DELETE FROM Candidates WHERE PositionID = @PositionID_Cand');

      request = new sql.Request(transaction);
      
      await request.input('PositionID_Pos', sql.Int, positionId).query('DELETE FROM Positions WHERE PositionID = @PositionID_Pos');

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

module.exports = new PositionRepository();
