const { sql } = require('../config/db');

class UserRepository {
  async findByUsername(username) {
    const request = new sql.Request();
    const result = await request
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE Username = @username');
    return result.recordset[0];
  }

  async createUser(username, passwordHash, fullName, role) {
    const request = new sql.Request();
    const result = await request
      .input('username', sql.NVarChar, username)
      .input('passwordHash', sql.NVarChar, passwordHash)
      .input('fullName', sql.NVarChar, fullName)
      .input('role', sql.NVarChar, role)
      .query(`
        INSERT INTO Users (Username, PasswordHash, FullName, Role) 
        VALUES (@username, @passwordHash, @fullName, @role);
        SELECT SCOPE_IDENTITY() AS UserID;
      `);
    return result.recordset[0];
  }

  async findAllStaff() {
    const request = new sql.Request();
    const result = await request.query(
      "SELECT UserID, Username, FullName, IsActive, DateCreated FROM Users WHERE Role = 'Staff' ORDER BY DateCreated DESC"
    );
    return result.recordset;
  }

  async updateUserStatus(userId, isActive) {
    const request = new sql.Request();
    const result = await request
      .input('UserID', sql.Int, userId)
      .input('IsActive', sql.Bit, isActive)
      .query(`
        UPDATE Users
        SET IsActive = @IsActive
        OUTPUT inserted.UserID, inserted.Username, inserted.FullName, inserted.IsActive
        WHERE UserID = @UserID;
      `);
    return result.recordset[0];
  }
}

module.exports = new UserRepository();
