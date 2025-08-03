const express = require('express');
const router = express.Router();
const { getResultsByElectionId } = require('../controllers/resultsController');

router.get('/:electionId', getResultsByElectionId);

module.exports = router;