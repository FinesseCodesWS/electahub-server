// middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per window
  message: 'Too many login attempts. Try again later.',
});
export const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 registration requests per window
  message: 'Too many registration attempts. Try again later.',
});