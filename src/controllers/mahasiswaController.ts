import { Request, Response } from 'express';
import { getDosenPA } from '../service/siakad';

export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const dosenPa = await getDosenPA(res.locals.user.data.username);
    console.log(dosenPa);

    res.render('mahasiswa/index', { dosen: dosenPa });
  } catch (error) {
    console.error(error);
    res.status(500).render('_500');
  }
};

export const logbook = async (req: Request, res: Response): Promise<void> => {
  try {
    const dosenPa = await getDosenPA(res.locals.user.data.username);
    res.render('mahasiswa/logbook', { dosenPa: dosenPa });
  } catch (error) {
    console.error(error);
    res.status(500).render('_500');
  }
};

export const konsultasi = async (req: Request, res: Response): Promise<void> => {
  try {
    const dosenPa = await getDosenPA(res.locals.user.data.username);
    res.render('mahasiswa/konsultasi', { dosenPa: dosenPa });
  } catch (error) {
    res.status(500).render('_500');
  }
};
