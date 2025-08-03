const { sql } = require('../config/db');

class ElectionRepository {
  async create(electionData) {
    const { Title, RegistrationStartDate, RegistrationEndDate, VotingStartDate, VotingEndDate, Status } = electionData;
    const request = new sql.Request();
    const result = await request
      .input('Title', sql.NVarChar, Title)
      .input('RegistrationStartDate', sql.DateTime2, RegistrationStartDate)
      .input('RegistrationEndDate', sql.DateTime2, RegistrationEndDate)
      .input('VotingStartDate', sql.DateTime2, VotingStartDate)
      .input('VotingEndDate', sql.DateTime2, VotingEndDate)
      .input('Status', sql.NVarChar, Status)
      .query(`
        INSERT INTO Elections (Title, RegistrationStartDate, RegistrationEndDate, VotingStartDate, VotingEndDate, Status)
        VALUES (@Title, @RegistrationStartDate, @RegistrationEndDate, @VotingStartDate, @VotingEndDate, @Status);
        SELECT SCOPE_IDENTITY() AS ElectionID;
      `);
    return result.recordset[0];
  }

  async findAll() {
    const request = new sql.Request();
    const result = await request.query('SELECT * FROM Elections ORDER BY VotingStartDate DESC');
    return result.recordset;
  }

  async findById(electionId) {
    const request = new sql.Request();
    const result = await request
      .input('ElectionID', sql.Int, electionId)
      .query('SELECT * FROM Elections WHERE ElectionID = @ElectionID');
    return result.recordset[0];
  }

  async findAllByElectionId(electionId) {
    const request = new sql.Request();
    const result = await request
      .input('ElectionID', sql.Int, electionId)
      .query('SELECT * FROM Positions WHERE ElectionID = @ElectionID ORDER BY PositionID');
    return result.recordset;
  }

  async findActive() {
    const request = new sql.Request();
    const result = await request
      .query("SELECT * FROM Elections WHERE Status = 'VotingOpen'");
    return result.recordset[0];
  }

  async updateStatus(electionId, newStatus) {
    const request = new sql.Request();
    const result = await request
      .input('ElectionID', sql.Int, electionId)
      .input('Status', sql.NVarChar, newStatus)
      .query(`
        UPDATE Elections
        SET Status = @Status
        OUTPUT inserted.*
        WHERE ElectionID = @ElectionID;
      `);
    return result.recordset[0];
  }
}

module.exports = new ElectionRepository();
