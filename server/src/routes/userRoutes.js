const express = require('express');
const router = express.Router();
const { getAllStaff, updateUserStatus } = require('../controllers/userController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

router.use(authMiddleware, checkRole(['Admin']));

router.get('/staff', getAllStaff);

router.patch('/:userId/status', updateUserStatus);

module.exports = router;
