import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

// Create Election
export const createElection = async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, endsAt, candidates } = req.body;
  const userId = req.user?.id;

  if (!title || !description || !endsAt || !Array.isArray(candidates)) {
    return res.status(400).json({ message: 'Missing required fields or invalid format.' });
  }

  if (candidates.length < 2) {
    return res.status(400).json({ message: 'Provide at least 2 candidates.' });
  }

  try {
    const election = await prisma.election.create({
      data: {
        title,
        description,
        endsAt: new Date(endsAt),
        creatorId: userId!,
        candidates: {
          create: candidates.map((name: string) => ({ name })),
        },
      },
      include: {
        candidates: true,
      },
    });

    res.status(201).json(election);
  } catch (err: any) {
    

    console.error('Election creation error:', err); // log error for debugging
    res.status(500).json({
      error: 'Failed to create election',
      details: {
        name: err.name,
        message: err.message,
        meta: err.meta,
      },
    });
  }
}

export const voteInElection = async (req: AuthenticatedRequest, res: Response) => {
  // logic
};

export const getResults = async (req: AuthenticatedRequest, res: Response) => {
  // logic
};
