const express = require('express');
const router = express.Router();
const { createElection, getAllElections, getActiveElection, getElectionById, updateElectionStatus } = require('../controllers/electionController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');
const positionRoutes = require('./positionRoutes');

router.get('/active', getActiveElection);

router.route('/')
  .post([authMiddleware, checkRole(['Admin'])], createElection)
  .get([authMiddleware, checkRole(['Admin'])], getAllElections);

router.get(
    '/:electionId',
    getElectionById
);

router.patch(
  '/:electionId/status',
  [authMiddleware, checkRole(['Admin'])],
  updateElectionStatus
);

router.use('/:electionId/positions', positionRoutes);

module.exports = router;
