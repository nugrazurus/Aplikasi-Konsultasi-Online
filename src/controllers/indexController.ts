import { Request, Response } from 'express';
import { getPicByNim, getPicByNip } from '../service/siakad';

export const index = async (req: Request, res: Response): Promise<void> => {
  res.redirect('/login');
};

export const getMhsPicByNim = async (req: Request, res: Response): Promise<void> => {
  try {
    const img = await getPicByNim(req.params.nim);
    if (img.includes('Error')) {
      return res.status(404).render('_404');
    } else {
      res.writeHead(200, {
        'Content-Type': 'image/jpg',
      });
      res.end(img);
    }
  } catch (error) {
    res.render('_404');
  }
};

export const getDosenPicByNip = async (req: Request, res: Response): Promise<void> => {
  try {
    const img = await getPicByNip(req.params.nip);
    if (img.includes('Error')) {
      return res.status(404).render('_404');
    } else {
      res.writeHead(200, {
        'Content-Type': 'image/jpg',
      });
      res.end(img);
    }
  } catch (error) {
    res.status(500).render('_404');
  }
};
