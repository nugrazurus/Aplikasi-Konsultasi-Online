import { Request, Response } from 'express';
import { getPeriode } from '../service/siakad';

export const getPeriodeLirs = async (req: Request, res: Response): Promise<void> => {
  try {
    const periode = await getPeriode();
    res.json(periode);
  } catch (error) {
    res.json(error);
  }
};
