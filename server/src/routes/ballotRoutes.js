const express = require('express');
const router = express.Router();
const { getBallot } = require('../controllers/ballotController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

router.get(
  '/:electionId', 
  [authMiddleware, checkRole(['Staff'])], 
  getBallot
);

module.exports = router;