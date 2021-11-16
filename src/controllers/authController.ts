import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

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
  return `Bearer ${token}`;
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
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: error,
    });
  }
};
