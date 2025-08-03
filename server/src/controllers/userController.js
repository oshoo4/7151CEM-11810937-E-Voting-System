const userService = require('../services/userService');

exports.getAllStaff = async (req, res) => {
  try {
    const staffUsers = await userService.getAllStaff();
    res.json(staffUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    const updatedUser = await userService.setUserStatus(userId, isActive);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
