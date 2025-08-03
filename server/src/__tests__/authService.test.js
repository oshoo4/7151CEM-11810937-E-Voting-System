const authService = require('../services/authService');

const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../repositories/userRepository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');


describe('AuthService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {

    it('should return a token and user data for a valid login', async () => {
      const username = 'testuser';
      const password = 'password123';
      const hashedPassword = 'hashed_password_string';
      const mockUser = {
        UserID: 1,
        Username: username,
        PasswordHash: hashedPassword,
        FullName: 'Test User',
        Role: 'Staff',
        IsActive: true,
      };

      userRepository.findByUsername.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake_jwt_token');

      const result = await authService.login(username, password);

      expect(result).toBeDefined();
      expect(result.token).toBe('fake_jwt_token');
      expect(userRepository.findByUsername).toHaveBeenCalledWith(username);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should throw an error if the user is not found', async () => {
      userRepository.findByUsername.mockResolvedValue(undefined);

      await expect(authService.login('nonexistent', 'password123'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should throw an error for an incorrect password', async () => {
      const mockUser = { UserID: 1, IsActive: true, PasswordHash: 'hashed_password' };
      userRepository.findByUsername.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login('testuser', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should throw an error if the user is inactive', async () => {
      const mockUser = {
        UserID: 1,
        IsActive: false,
        PasswordHash: 'hashed_password'
      };
      userRepository.findByUsername.mockResolvedValue(mockUser);
      
      await expect(authService.login('inactiveuser', 'password123'))
        .rejects.toThrow('Your account has been deactivated. Please contact an administrator.');

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });
});
