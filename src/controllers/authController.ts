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
          res.render('login', {message: 'Username atau password anda salah'})
          // res.status(200).json({
          //   status: false,
          //   message: 'Username atau password anda salah',
          // });
        }
        break;
      default:
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
    const username: string = req.body.username;
    const password: string = encodeURI(req.body.password);
    console.log(req.body);
    console.log(username, password);
    const response = await axios
      .get(`${process.env.SIAKAD_ENDPOINT}/loginmhs/${username}/X${password}`)
      .then((res) => {
        delete res.data.result[0].passwd;
        const data = res.data.result[0];
        console.log(data);
        if (data.idmhs === '0') {
          return null;
        } else {
          return generateToken(data);
        }
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
    if (response !== null) {
      res.status(200).json({
        status: true,
        message: 'success',
        token: response,
      });
    } else {
      res.json({ status: false, message: 'username atau password anda salah' });
      res.redirect('/');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('AuthToken');
  res.redirect('/');
};
