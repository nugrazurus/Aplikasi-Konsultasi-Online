import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { loginSiakadDosen, loginSiakadMahasiswa } from '../service/siakad';

interface User {
  idmhs: number;
  idprogdi: number;
  idprogram: number;
  idperiode: number;
  statakd: number;
  nama: string;
  progdi: string;
  fakultas: string;
  ips: number;
  maxsks: number;
  ipk: number;
  thakad: string;
  smt: number;
  iden: number;
  username: string;
}

const generateToken = (user: User) => {
  const jwtExp: number = parseInt(process.env.JWT_EXPIRATION_IN_MINUTES);
  const expiration: number = 60 * jwtExp;
  const token = jwt.sign(
    {
      data: user,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: expiration,
    },
  );
  return token;
};

export const loginIndex = async (req: Request, res: Response): Promise<void> => {
  try {
    res.locals.message = ''
    res.status(200).render('login');
  } catch (error) {
    res.status(500).render('_404');
  }
};

export const loginServerSide = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, role } = req.body;
    let response;
    switch (role) {
      case 'mahasiswa':
        response = await loginSiakadMahasiswa(username, password);
        if (response.result[0].idmhs !== '0') {
          const data = response.result[0];
          data.role = 'mahasiswa';
          delete data.passwd;
          res.cookie('AuthToken', generateToken(data));
          res.redirect('mahasiswa');
        } else {
          res.status(200).json({
            status: false,
            message: 'Username atau password anda salah',
          });
        }
        break;
      case 'dosen':
        response = await loginSiakadDosen(username, password);
        if (!response.result) {
          throw new Error(response.data.error);
        }
        if (response.result[0].stat !== 'gagal') {
          const data = response.result[0];
          data.nip = username;
          data.role = 'dosen';
          res.cookie('AuthToken', generateToken(data));
          res.status(200).redirect('dosen');
        } else {
          res.status(403).render('login', {message: 'Username atau password anda salah'})
        }
        break;
      default:
        res.render('login', {message: 'Anda belum memilih role'});
        break;
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, role } = req.body;
    let response;
    switch (role) {
      case 'mahasiswa':
        response = await loginSiakadMahasiswa(username, password);
        if (!response.result) {
          throw new Error(response.data.error);
        }
        if (response.result[0].idmhs !== '0') {
          const data = response.result[0];
          data.role = 'mahasiswa';
          delete data.passwd;
          res.json({
            status: true,
            message: 'Berhasil generate token',
            token: generateToken(data)
          });
        } else {
          throw new Error("Username atau password anda salah");
        }
        break;
      case 'dosen':
        response = await loginSiakadDosen(username, password);
        if (!response.result) {
          throw new Error(response.data.error);
        }
        if (response.result[0].stat !== 'gagal') {
          const data = response.result[0];
          data.nip = username;
          data.role = 'dosen';
          res.json({
            status: true,
            message: 'Berhasil generate token',
            token: generateToken(data)
          });
        } else {
          throw new Error("Username atau password anda salah");
        }
        break;
      default:
        throw new Error("Role tidak ditemukan");
    }
  } catch (error) {
    res.status(403).json({
      status: false,
      message: error
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('AuthToken');
  res.redirect('/');
};
