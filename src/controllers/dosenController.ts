import { Request, response, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getBimbinganPA } from '../service/siakad';

export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const { payload } = jwt.decode(req.cookies.AuthToken, { complete: true });
    const mhs = await getBimbinganPA(parseInt(payload.data.iddosen), 374);
    if (mhs.length < 1) {
      res.status(500).json(mhs);
    }
    // res.json(mhs);
    res.render('index', { mhs: mhs });
  } catch (error) {
    // res.json('error');
  }
};
