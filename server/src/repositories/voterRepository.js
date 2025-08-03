const { sql } = require('../config/db');

class VoterRepository {
  async create(voterData) {
    const { PublicVoterID, FullName, DateOfBirth, AzurePersonID, PhotoUrl } = voterData;
    const request = new sql.Request();

    const result = await request
      .input('PublicVoterID', sql.NVarChar, PublicVoterID)
      .input('FullName', sql.NVarChar, FullName)
      .input('DateOfBirth', sql.Date, DateOfBirth)
      .input('AzurePersonID', sql.UniqueIdentifier, AzurePersonID)
      .input('PhotoUrl', sql.NVarChar, PhotoUrl)
      .query(`
        INSERT INTO Voters (PublicVoterID, FullName, DateOfBirth, AzurePersonID, PhotoUrl)
        VALUES (@PublicVoterID, @FullName, @DateOfBirth, @AzurePersonID, @PhotoUrl);

        SELECT * FROM Voters WHERE VoterID = SCOPE_IDENTITY();
      `);
    return result.recordset[0];
  }

  async findByPublicVoterID(publicVoterId) {
    const request = new sql.Request();
    const result = await request
      .input('PublicVoterID', sql.NVarChar, publicVoterId)
      .query('SELECT * FROM Voters WHERE PublicVoterID = @PublicVoterID');
    return result.recordset[0];
  }
}

module.exports = new VoterRepository();