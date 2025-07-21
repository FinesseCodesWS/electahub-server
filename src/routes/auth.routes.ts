import { Router } from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/user.controller';
import authenticateToken from '../middlewares/auth.middleware';
import { loginRateLimiter, registerRateLimiter } from '../middlewares/rateLimiter';
import { refreshAccessToken } from '../controllers/auth.controller';
const router = Router();

router.post('/register', registerUser, registerRateLimiter);
router.post('/login', loginUser);
router.get('/profile', authenticateToken, getUserProfile);
router.post('/login', loginRateLimiter, refreshAccessToken);
router.post('/refresh-token', refreshAccessToken);

export default router;
