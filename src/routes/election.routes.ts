import { Router } from 'express';
import {
  createElection,
  voteInElection,
  getResults,
} from '../controllers/election.controller';
import authenticateToken from '../middleware/auth.middleware';

const router = Router();

router.post('/create', authenticateToken, createElection);
router.post('/vote', authenticateToken, voteInElection);
router.get('/:electionId/results', getResults);

export default router;
