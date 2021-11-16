import { Request, Response } from 'express';
import { getPeriode } from './repositoryController';

export const getPeriodeLirs = async (req: Request, res: Response): Promise<void> => {
  try {
    const periode = await getPeriode();
    console.log(periode);
    res.json(periode);
  } catch (error) {
    res.json(error);
  }
};
