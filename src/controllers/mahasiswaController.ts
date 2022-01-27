import { Request, Response } from 'express';
import { getDosenPA } from '../service/siakad';
import { tampilTanggal } from './dosenController';

const tanggal = tampilTanggal();

export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    res.render('mahasiswa/index');
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error });
  }
};

export const logbook = async (req: Request, res: Response): Promise<void> => {
  try {
    const dosenPa = await getDosenPA(res.locals.user.data.username)
    res.render('mahasiswa/logbook', {dosenPa: dosenPa});
  } catch (error) {
    console.error(error);
    res.render('_404');
  }
};

export const konsultasi = async (req: Request, res: Response): Promise<void> => {
  try {
    res.render('mahasiswa/konsultasi');
  } catch (error) {
    console.error(error);
    res.render('_404');
  }
};
