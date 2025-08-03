const axios = require('axios');

const FACE_API_ENDPOINT = process.env.FACE_API_ENDPOINT;
const FACE_API_KEY = process.env.FACE_API_KEY;

const faceApiClient = axios.create({
  baseURL: FACE_API_ENDPOINT,
  headers: {
    'Ocp-Apim-Subscription-Key': FACE_API_KEY
  }
});

class FaceApiService {
  async createLivenessSession() {
    try {
      const response = await faceApiClient.post(
        '/face/v1.2/detectLiveness-sessions',
        {
          livenessOperationMode: 'PassiveActive',
          deviceCorrelationId: `e-voting-session-${Date.now()}`
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      console.error("Azure Liveness Session Creation Error:", error.response?.data?.error || error.message);
      throw new Error('Failed to create liveness session.');
    }
  }

  async enrollFace(imageBuffer) {
    try {
      const personGroupId = 'evoting-voters-group';
      const createPersonResponse = await faceApiClient.post(
        `/face/v1.2/persongroups/${personGroupId}/persons`,
        { name: 'New Voter' },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const personId = createPersonResponse.data.personId;

      await faceApiClient.post(
        `/face/v1.2/persongroups/${personGroupId}/persons/${personId}/persistedfaces`,
        imageBuffer,
        { 
            headers: { 'Content-Type': 'application/octet-stream' },
            params: { detectionModel: 'detection_03' }
        }
      );
      
      await faceApiClient.post(`/face/v1.2/persongroups/${personGroupId}/train`);
      return personId;
    } catch (error) {
      console.error("Azure Face API Enroll Error:", error.response?.data?.error || error.message);
      throw new Error('Failed to enroll face with Azure Face API.');
    }
  }

  async verifyFace(imageBuffer, personId) {
    try {
      const detectResponse = await faceApiClient.post(
        '/face/v1.2/detect',
        imageBuffer,
        { 
          headers: { 'Content-Type': 'application/octet-stream' },
          params: { 
            returnFaceId: true, 
            detectionModel: 'detection_03', 
            recognitionModel: 'recognition_04' 
          }
        }
      );

      if (detectResponse.data.length === 0) {
        throw new Error('No face detected in the provided image.');
      }
      const faceId = detectResponse.data[0].faceId;

      const verifyResponse = await faceApiClient.post(
        '/face/v1.2/verify',
        { faceId: faceId, personId: personId, personGroupId: 'evoting-voters-group' },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return verifyResponse.data;
    } catch (error) {
      console.error("Azure Face API Verify Error:", error.response?.data?.error || error.message);
      throw new Error('Failed to verify face with Azure Face API.');
    }
  }
}

module.exports = new FaceApiService();
