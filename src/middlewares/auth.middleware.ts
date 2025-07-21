import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Extend Express Request type for user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: 'Access token missing' });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.user = { id: payload.userId }; // 👈 Matches what controller expects
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

export default authenticateToken;
export type { AuthenticatedRequest }; // So you can import it in controller
