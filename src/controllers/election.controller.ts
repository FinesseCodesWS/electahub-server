import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// Create Election
export const createElection = async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, endsAt, candidates } = req.body;
  const userId = req.user?.id;

  if (!candidates || candidates.length < 2) {
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
  } catch (err) {
    res.status(500).json({ error: 'Failed to create election', details: err });
  }
};

// Vote in Election
export const voteInElection = async (req: AuthenticatedRequest, res: Response) => {
  const { electionId, candidateId } = req.body;
  const userId = req.user?.id;

  try {
    const vote = await prisma.vote.create({
      data: {
        userId: userId!,
        electionId,
        candidateId,
      },
    });

    res.status(201).json({ message: 'Vote cast successfully', vote });
  } catch (err: any) {
    if (err.code === 'P2002') {
      res.status(400).json({ message: 'You have already voted in this election.' });
    } else {
      res.status(500).json({ error: 'Voting failed', details: err });
    }
  }
};

// Get election results
export const getResults = async (req: Request, res: Response) => {
  const { electionId } = req.params;

  try {
    const candidates = await prisma.candidate.findMany({
      where: { electionId },
      include: { votes: true },
    });

    const results = candidates.map(c => ({
      candidate: c.name,
      votes: c.votes.length,
    }));

    res.json({ electionId, results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve results' });
  }
};
