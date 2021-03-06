import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getBimbinganPA } from '../service/siakad';

export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const { payload } = jwt.decode(req.cookies.AuthToken, { complete: true });
    let mhs = await getBimbinganPA(parseInt(payload.data.iddosen), 374);
    const countAngkatan = mhs
      .map((val: any) => {
        return `20${val.nim.substring(5, 7)}`;
      })
      .reduce((map: any, val: any) => {
        map[val] = (map[val] || 0) + 1;
        return map;
      }, {});
    if (mhs.length < 1) {
      res.status(500).json(mhs);
    }
    mhs = mhs.slice(0, 5);
    res.render('dosen/index', { mhs: mhs, angkatan: countAngkatan });
  } catch (error) {
    console.error(error);
    res.status(500).render('_500');
  }
};

export const logbook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { payload } = jwt.decode(req.cookies.AuthToken, { complete: true });
    const mhs = await getBimbinganPA(parseInt(payload.data.iddosen), 374);
    const tanggal = tampilTanggal();
    if (mhs.length < 1) {
      res.status(500).json(mhs);
    }
    res.render('dosen/logbook', { mhs: mhs });
  } catch (error) {
    console.error(error);
    res.status(500).render('_500');
  }
};

export const logbookDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nim } = req.params;
    const { payload } = jwt.decode(req.cookies.AuthToken, { complete: true });
    const { iddosen } = payload.data;
    const mhs = await getMhs(nim, iddosen);
    res.render('dosen/logbook-detail', { mhs: mhs });
  } catch (error) {
    console.error(error);
    res.status(500).render('_500');
  }
};

export const konsultasi = async (req: Request, res: Response): Promise<void> => {
  try {
    const { payload } = jwt.decode(req.cookies.AuthToken, { complete: true });
    const mhs = await getBimbinganPA(parseInt(payload.data.iddosen), 374);
    res.render('konsultasi', { mhs: mhs });
  } catch (error) {
    console.error(error);
    res.status(500).render('_500');
  }
};

const getMhs = async (nim: string, iddosen: number) => {
  const mhs = await getBimbinganPA(iddosen, 374);
  const data = mhs.find((e: any) => {
    return e.nim === nim;
  });
  data.angkatan = `20${data.nim.substring(5, 7)}`;
  return data;
};

export const tampilTanggal = () => {
  const date = new Date();

  const tahun = date.getFullYear();
  const month = date.getMonth();
  const tanggal = date.getDate();
  const day = date.getDay();
  let hari: string;
  let bulan: string;

  switch (day) {
    case 0:
      hari = 'Minggu';
      break;
    case 1:
      hari = 'Senin';
      break;
    case 2:
      hari = 'Selasa';
      break;
    case 3:
      hari = 'Rabu';
      break;
    case 4:
      hari = 'Kamis';
      break;
    case 5:
      hari = "Jum'at";
      break;
    case 6:
      hari = 'Sabtu';
      break;
  }

  switch (month) {
    case 0:
      bulan = 'Januari';
      break;
    case 1:
      bulan = 'Februari';
      break;
    case 2:
      bulan = 'Maret';
      break;
    case 3:
      bulan = 'April';
      break;
    case 4:
      bulan = 'Mei';
      break;
    case 5:
      bulan = 'Juni';
      break;
    case 6:
      bulan = 'Juli';
      break;
    case 7:
      bulan = 'Agustus';
      break;
    case 8:
      bulan = 'September';
      break;
    case 9:
      bulan = 'Oktober';
      break;
    case 10:
      bulan = 'November';
      break;
    case 11:
      bulan = 'Desember';
      break;
  }
  return `${tanggal} ${bulan} ${tahun}`;
};
