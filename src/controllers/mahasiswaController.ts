import { Request, Response } from 'express';
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
    res.render('mahasiswa/logbook');
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
