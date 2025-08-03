const dotenv = require('dotenv');
dotenv.config();

const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error('Azure Storage Connection string not found.');
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerName = 'voter-photos';

class BlobStorageService {
  async uploadImage(imageBuffer, originalName = 'photo.jpeg') {
    try {
      const containerClient = blobServiceClient.getContainerClient(containerName);
      
      const blobName = `${uuidv4()}-${originalName}`;

      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.upload(imageBuffer, imageBuffer.length, {
        blobHTTPHeaders: { blobContentType: 'image/jpeg' }
      });

      return blockBlobClient.url;
    } catch (error) {
      console.error("Azure Blob Storage Error:", error.message);
      throw new Error('Failed to upload image to Azure Blob Storage.');
    }
  }
}

module.exports = new BlobStorageService();
