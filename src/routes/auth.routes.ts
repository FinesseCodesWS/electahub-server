import { Router } from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/user.controller';
import authenticateToken from '../middlewares/auth.middleware';
import { loginRateLimiter, registerRateLimiter } from '../middlewares/rateLimiter';
import { refreshAccessToken } from '../controllers/auth.controller';
import { requestPasswordReset, resetPassword } from '../controllers/password.controller';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Auth & user routes
router.post('/register', registerRateLimiter, registerUser);
router.post('/login', loginRateLimiter, loginUser);
router.get('/profile', authenticateToken, getUserProfile);

// Token handling
router.post('/refresh-token', refreshAccessToken);

// Password reset
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
