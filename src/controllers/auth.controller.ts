import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { generateTokens } from '../utils/generateTokens';
export const refreshToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: 'Refresh token missing' });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string };
    const newTokens = generateTokens(payload.userId);
    // Update refresh token in DB if needed
    return res.json(newTokens);
  } catch {
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};
