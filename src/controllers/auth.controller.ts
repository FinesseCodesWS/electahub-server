import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { generateTokens } from '../utils/generateTokens';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

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
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    // Optional: Save refresh token in DB or cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ accessToken });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};
export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ error: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  // Placeholder for sending email
  console.log(`Send reset token to ${email}: ${token}`);

  res.status(200).json({ message: 'Reset token sent to email' });
};
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  const reset = await prisma.passwordResetToken.findFirst({
    where: {
      token,
      expiresAt: { gte: new Date() },
    },
  });

  if (!reset) return res.status(400).json({ error: 'Invalid or expired token' });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: reset.userId },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.deleteMany({
    where: { userId: reset.userId },
  });

  res.status(200).json({ message: 'Password reset successful' });
};