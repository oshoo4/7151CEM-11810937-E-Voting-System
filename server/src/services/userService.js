const userRepository = require('../repositories/userRepository');

class UserService {
  async getAllStaff() {
    return await userRepository.findAllStaff();
  }

  async setUserStatus(userId, isActive) {
    return await userRepository.updateUserStatus(userId, isActive);
  }
}

module.exports = new UserService();
