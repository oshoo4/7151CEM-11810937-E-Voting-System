const express = require('express');
const router = express.Router({ mergeParams: true });
const { getCandidatesForPosition, addCandidate } = require('../controllers/candidateController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

router.use(authMiddleware, checkRole(['Admin']));

router.route('/')
  .get(getCandidatesForPosition)
  .post(addCandidate);

module.exports = router;