console.log("Election routes loaded");
import { Router } from 'express';
import * as electionController from '../controllers/election.controller';
import authenticateToken from '../middlewares/auth.middleware';

const router = Router();

console.log('createElection:', typeof electionController.createElection);
console.log('voteInElection:', typeof electionController.voteInElection);
console.log('getResults:', typeof electionController.getResults);

router.post('/create', authenticateToken, electionController.createElection);
router.post('/vote', authenticateToken, electionController.voteInElection);
router.get('/:electionId/results', electionController.getResults);

export default router;
