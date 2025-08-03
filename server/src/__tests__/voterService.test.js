const voterService = require('../services/voterService');

const voterRepository = require('../repositories/voterRepository');
const faceApiService = require('../services/faceApiService');
const blobStorageService = require('../services/blobStorageService');

jest.mock('../repositories/voterRepository');
jest.mock('../services/faceApiService');
jest.mock('../services/blobStorageService');


describe('VoterService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerVoter', () => {

    it('should enroll face, upload photo, and create a voter record successfully', async () => {
      const voterData = { FullName: 'Test Voter', DateOfBirth: '2000-01-01' };
      const imageFile = { buffer: Buffer.from('fake-image'), originalname: 'test.jpg' };

      const fakePersonId = 'azure-person-id-123';
      const fakePhotoUrl = 'https://storage.blob.core.windows.net/test.jpg';
      const fakeCreatedVoter = { VoterID: 1, ...voterData, AzurePersonID: fakePersonId, PhotoUrl: fakePhotoUrl };

      faceApiService.enrollFace.mockResolvedValue(fakePersonId);
      blobStorageService.uploadImage.mockResolvedValue(fakePhotoUrl);
      voterRepository.create.mockResolvedValue(fakeCreatedVoter);

      const result = await voterService.registerVoter(voterData, imageFile);

      expect(faceApiService.enrollFace).toHaveBeenCalledWith(imageFile.buffer);
      expect(blobStorageService.uploadImage).toHaveBeenCalledWith(imageFile.buffer, imageFile.originalname);
      
      expect(voterRepository.create).toHaveBeenCalledWith({
        ...voterData,
        AzurePersonID: fakePersonId,
        PhotoUrl: fakePhotoUrl
      });
      
      expect(result).toEqual(fakeCreatedVoter);
    });

    it('should throw an error if the Face API enrollment fails', async () => {
        const voterData = { FullName: 'Test Voter', DateOfBirth: '2000-01-01' };
        const imageFile = { buffer: Buffer.from('fake-image'), originalname: 'test.jpg' };
        const errorMessage = 'Face API Error';

        faceApiService.enrollFace.mockRejectedValue(new Error(errorMessage));
        blobStorageService.uploadImage.mockResolvedValue('some-url');

        await expect(voterService.registerVoter(voterData, imageFile))
            .rejects.toThrow('Failed to process voter image with Azure services.');
        
        expect(voterRepository.create).not.toHaveBeenCalled();
    });

  });
});
