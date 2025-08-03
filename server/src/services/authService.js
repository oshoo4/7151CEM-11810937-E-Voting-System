const dotenv = require('dotenv');
dotenv.config();

const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  async register(username, password, fullName, role) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    return await userRepository.createUser(username, passwordHash, fullName, role);
  }

  async login(username, password) {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.IsActive) {
        throw new Error('Your account has been deactivated. Please contact an administrator.');
    }

    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const payload = { 
      userId: user.UserID, 
      role: user.Role 
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    return { 
      token, 
      user: { 
        userId: user.UserID, 
        fullName: user.FullName, 
        role: user.Role 
      } 
    };
  }
}

module.exports = new AuthService();
