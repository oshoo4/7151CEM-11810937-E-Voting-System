const express = require('express');
const router = express.Router();
const { submitVote } = require('../controllers/voteController');
const votingAuthMiddleware = require('../middleware/votingAuthMiddleware');

router.post('/', votingAuthMiddleware, submitVote);

module.exports = router;