const express = require('express');
const router = express.Router({ mergeParams: true });
const { getPositionsForElection, addPosition, updatePosition, deletePosition } = require('../controllers/positionController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');
const candidateRoutes = require('./candidateRoutes');

router.use(authMiddleware, checkRole(['Admin']));

router.route('/')
  .get(getPositionsForElection)
  .post(addPosition);

router.route('/:positionId')
  .patch(updatePosition)
  .delete(deletePosition);

router.use('/:positionId/candidates', candidateRoutes);

module.exports = router;
