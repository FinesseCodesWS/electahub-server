import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

/**
 * Generates access and refresh tokens for a user.
 * @param userId - The ID of the user for whom to generate tokens.
 * @returns An object containing the access token and refresh token.
 */
export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};
