const express = require('express');
const router = express.Router();
const multer = require('multer');
const { registerVoter, verifyVoter, getVoterByPublicId } = require('../controllers/voterController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  '/register',
  [authMiddleware, checkRole(['Staff'])],
  upload.single('voterPhoto'),
  registerVoter
);

router.post(
  '/verify',
  [authMiddleware, checkRole(['Staff'])],
  upload.single('voterPhoto'),
  verifyVoter
);

router.get(
    '/:publicVoterId',
    [authMiddleware, checkRole(['Staff'])],
    getVoterByPublicId
  );

module.exports = router;
