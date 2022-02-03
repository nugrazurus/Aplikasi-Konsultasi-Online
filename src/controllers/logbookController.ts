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
      console.log('ade');
      
      if (req.file.mimetype == 'application/pdf') {
        const filename = slug(`${update._id} Lampiran ${update.nimMahasiswa}`)+`${path.extname(req.file.originalname)}`;
        fs.writeFile(path.join(__dirname, `../uploads/${filename}`), req.file.buffer, async (err) => {
          if (err) {
            console.error(err);
          } else {
            await update.updateOne({
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
      console.log('ndak ade file');
      console.log(req.body);
      
      await update.updateOne(req.body)
    }

    res.json({
      status: true,
      message: 'success',
      data: await Logbook.findOne({_id: req.params.id}),
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
    const destroy = await Logbook.findOne({ _id: req.params.id });
    fs.rm(path.join(__dirname, `../uploads/${destroy.attachments.file}`), (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Success delete file');
      }
    })
    await destroy.deleteOne()
    res.json({
      status: true,
      message: 'success',
      data: destroy,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
