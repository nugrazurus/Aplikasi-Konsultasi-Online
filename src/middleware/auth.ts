import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.headers);
  const tokenHeader = `${req.headers['authorization']}`;
  if (tokenHeader.split(' ')[0] !== 'Bearer') {
    return res.status(403).json({
      status: false,
      message: 'Invalid token format',
    });
  }
  const token = tokenHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({
      status: false,
      message: 'no token provided',
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: err,
      });
    }
    console.log(decoded);
    next();
  });
};

export const redirectIfAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = `${req.cookies.AuthToken}`;
  if (!token) {
    return res.redirect('/login');
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || decoded.data.role !== 'dosen') {
      res.clearCookie('AuthToken');
      return res.redirect('/login');
    }
    res.locals.user = decoded;
    next();
  });
};
