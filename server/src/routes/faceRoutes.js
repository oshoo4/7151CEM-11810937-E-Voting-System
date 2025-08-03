const express = require('express');
const router = express.Router();
const { createLivenessSession, getLivenessSessionResult, deleteLivenessSession } = require('../controllers/faceController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

router.use(authMiddleware, checkRole(['Staff']));

router.post('/liveness-session', createLivenessSession);

router.get('/liveness-session/:sessionId', getLivenessSessionResult);

router.delete('/liveness-session/:sessionId', deleteLivenessSession);

module.exports = router;
