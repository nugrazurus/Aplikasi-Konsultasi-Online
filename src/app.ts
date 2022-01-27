import express from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';
import cors from 'cors';
import compressions from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import indexRoute from './routes/index';
import apiRoute from './routes/api';
import dosenRoute from './routes/dosen';
import mahasiswaRoute from './routes/mahasiswa';
dotenv.config();
export const app = express();

app.set('port', process.env.PORT || 8080);
// app.set('views', './views')
app.use(
  express.json({
    limit: '20mb',
  }),
);
app.use(
  express.urlencoded({
    limit: '20mb',
    extended: true,
  }),
);
app.use(cors());
app.use(cookieParser());
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, './public')));
app.use('/api', apiRoute);
app.use('/dosen', dosenRoute);
app.use('/mahasiswa', mahasiswaRoute);
app.use('/', indexRoute);
app.use(compressions());
app.use(helmet());
