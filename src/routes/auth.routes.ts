import { Router } from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/user.controller';
import authenticateToken from '../middleware/auth.middleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateToken, getUserProfile);

export default router;
