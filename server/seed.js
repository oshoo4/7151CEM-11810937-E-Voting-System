const sql = require('mssql');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

const seedAdmin = async () => {
  const { SEED_ADMIN_FULLNAME, SEED_ADMIN_USERNAME, SEED_ADMIN_PASSWORD } = process.env;
  if (!SEED_ADMIN_FULLNAME || !SEED_ADMIN_USERNAME || !SEED_ADMIN_PASSWORD) {
    return;
  }

  try {
    await sql.connect(sqlConfig);
    console.log('Database connected...');

    const request = new sql.Request();

    const userExistsResult = await request.input('Username', sql.NVarChar, SEED_ADMIN_USERNAME).query('SELECT * FROM Users WHERE Username = @Username');
    if (userExistsResult.recordset.length > 0) {
      console.log(`Admin user '${SEED_ADMIN_USERNAME}' already exists. Seeding skipped.`);
      sql.close();
      return;
    }
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(SEED_ADMIN_PASSWORD, salt);

    const insertRequest = new sql.Request();
    await insertRequest
      .input('Username', sql.NVarChar, SEED_ADMIN_USERNAME)
      .input('PasswordHash', sql.NVarChar, passwordHash)
      .input('FullName', sql.NVarChar, SEED_ADMIN_FULLNAME)
      .input('Role', sql.NVarChar, 'Admin')
      .query(`
        INSERT INTO Users (Username, PasswordHash, FullName, Role) 
        VALUES (@Username, @PasswordHash, @FullName, @Role);
      `);
      
    
  } catch (err) {
    console.error('Error during seeding:', err.message);
  } finally {
    await sql.close();
  }
};

seedAdmin();
