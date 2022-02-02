import Logbook from '../models/logbook';
import fs from 'fs';
import slug from 'slug';
import path from 'path';
import { Request, Response } from 'express';

const randomString = () => {
  const anysize = 3; //the size of string
  const charset = 'abcdefghijklmnopqrstuvwxyz'; //from where to create
  let i = 0;
  let rand = '';
  while (i++ < anysize) rand += charset.charAt(Math.random() * charset.length);
  return rand;
};

export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const logbook = await Logbook.find({}).sort([['createdAt', -1]]);
    res.json({
      status: true,
      message: 'success',
      data: logbook,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const showByNim = async (req: Request, res: Response): Promise<void> => {
  try {
    const logbook = await Logbook.find({ nimMahasiswa: req.params.nim }).sort([['createdAt', 1]]);
    const apiNgage = {
      apiId: process.env.API_ID,
      apiKey: process.env.API_KEY,
    };
    res.json({
      status: true,
      message: 'success',
      data: logbook,
      apiNgage: apiNgage,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const logbook = await Logbook.findOne({ _id: req.params.id }).sort([['createdAt', 1]]);
    res.json({
      status: true,
      message: 'success',
      data: logbook,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const roomName = `${randomString()}-${randomString()}-${randomString()}`;
    req.body.roomName = roomName;
    const create = await Logbook.create(req.body);
    res.json({
      status: true,
      message: 'success',
      data: create,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const update = await Logbook.findOne({ _id: req.params.id });
    if(req.file){
      if (req.file.mimetype == 'application/pdf') {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = slug(`Lampiran ${update.nimMahasiswa} ${uniqueSuffix}`)+`${path.extname(req.file.originalname)}`;
        fs.writeFile(`./uploads/${filename}`, req.file.buffer, (err) => {
          if (err) {
            console.error(err);
          } else {
            update.updateOne({
              attachments:{
                file: filename,
                originalName: req.file.originalname,
                originalExt: path.extname(req.file.originalname)
              }
            })
            console.log('file successfully saved');
          }
        })
      } else {
        throw new Error("File yang diupload bukan PDF");
      }
    } else {
      update.updateOne(req.body)
    }

    res.json({
      status: true,
      message: 'success',
      data: update,
      body: req.body
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const destroy = await Logbook.deleteOne({ _id: req.body.id });
    res.json({
      status: true,
      message: 'success',
      data: destroy,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
