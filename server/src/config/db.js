const dotenv = require('dotenv');
dotenv.config();

const sql = require('mssql');
const { SecretClient } = require('@azure/keyvault-secrets');
const { DefaultAzureCredential } = require('@azure/identity');

const config = {};

const connectDB = async () => {
  try {
    const keyVaultUrl = process.env.KEY_VAULT_URL;
    if (!keyVaultUrl) {
      throw new Error('KEY_VAULT_URL is not set in environment variables.');
    }
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(keyVaultUrl, credential);

    config.dbUser = (await client.getSecret('DB-USER')).value;
    config.dbPassword = (await client.getSecret('DB-PASSWORD')).value;
    config.dbServer = (await client.getSecret('DB-SERVER')).value;
    config.dbDatabase = (await client.getSecret('DB-DATABASE')).value;
    process.env.JWT_SECRET = (await client.getSecret('JWT-SECRET')).value;
    process.env.FACE_API_ENDPOINT = (await client.getSecret('FACE-API-ENDPOINT')).value;
    process.env.FACE_API_KEY = (await client.getSecret('FACE-API-KEY')).value;
    process.env.AZURE_STORAGE_CONNECTION_STRING = (await client.getSecret('AZURE-STORAGE-CONNECTION-STRING')).value;
    process.env.CLIENT_URL = (await client.getSecret('CLIENT-URL')).value;
    
    console.log('Successfully loaded secrets from Key Vault.');

    const sqlConfig = {
      user: config.dbUser,
      password: config.dbPassword,
      server: config.dbServer,
      database: config.dbDatabase,
      options: {
        encrypt: true,
        trustServerCertificate: false
      }
    };
    
    await sql.connect(sqlConfig);
    console.log('Azure SQL Database connected...');

  } catch (err) {
    console.error('Failed to initialize application:', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB, sql };
