const authService = require('../services/authService');

exports.registerUser = async (req, res) => {
  const { username, password, fullName, role } = req.body;
  try {
    const newUser = await authService.register(username, password, fullName, role);
    res.status(201).json({ message: 'User registered successfully', userId: newUser.UserID });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const data = await authService.login(username, password);
    res.json(data);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};