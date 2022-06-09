import Logbook from '../models/logbook';
import fs from 'fs';
import slug from 'slug';
import path from 'path';
import { Request, Response } from 'express';
import { getEmailMahasiswa, getEmailDosen, createEventCalendarGCR } from '../service/googleCalendar';

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
    const logbook = await Logbook.find({ nimMahasiswa: req.params.nim })
      .sort([['createdAt', 1]])
      .exec();
    // const apiNgage = {
    //   apiId: process.env.API_ID,
    //   apiKey: process.env.API_KEY,
    // };
    const data = logbook.map((val) => {
      const url = `http://${req.headers.host}/bimbingan/mahasiswa/${val.roomName}`;
      return { ...val.toObject(), url };
    });
    res.json({
      status: true,
      message: 'success',
      data: data,
      // apiNgage: apiNgage,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const showByNip = async (req: Request, res: Response): Promise<void> => {
  try {
    const logbook = await Logbook.find({ nipDosen: req.params.nip }).sort([['createdAt', 1]]);
    // const data = logbook.map((val) => {
    //   const url = `http://${req.headers.host}/bimbingan/mahasiswa/${val.roomName}`;
    //   return { ...val.toObject(), url };
    // });
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
    // const roomName = `${randomString()}-${randomString()}-${randomString()}`;
    // req.body.roomName = roomName;
    const emailMahasiswa = await getEmailMahasiswa(req.body.nimMahasiswa);
    const emailDosen = await getEmailDosen(req.body.nipDosen);
    const data = req.body;
    console.log(data);
    if (data.platform !== 'google-meet') throw new Error('Platform yang tersedia hanya google meet');
    const meetLink = await createEventCalendarGCR({
      timestampMulai: new Date(data.date).getTime(),
      durasi: 120,
      judul: 'Bimbingan Online',
      deskripsi: `Konsultasi Online / Bimbingan Online ${data.namaMahasiswa}:${data.nimMahasiswa} ${data.namaDosen}:${data.nipDosen}`,
      peserta: `${emailDosen},${emailMahasiswa}`,
    });
    req.body.emailMahasiswa = emailMahasiswa;
    req.body.emailDosen = emailDosen;
    req.body.meetLink = meetLink;
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

export const createNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const update = await Logbook.findOne({ _id: req.params.id });
    if (req.file) {
      console.log('ade');

      if (req.file.mimetype == 'application/pdf') {
        const filename =
          slug(`${new Date().getTime()} Lampiran ${update.nimMahasiswa}`) + `${path.extname(req.file.originalname)}`;
        fs.writeFile(path.join(__dirname, `../uploads/${filename}`), req.file.buffer, async (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log('file successfully saved');
            console.log(req.file.originalname);
            await update.updateOne({
              $push: {
                notes: {
                  title: req.body.titleMasalah,
                  content: req.body.contentMasalah,
                  attachments: {
                    file: filename,
                    orginalName: req.file.originalname,
                    originalExt: path.extname(req.file.originalname),
                  },
                  actions: {
                    title: null,
                    content: null,
                  },
                },
              },
            });
          }
        });
      } else {
        throw new Error('File yang diupload bukan PDF');
      }
    } else {
      console.log('ndak ade file');
      console.log(req.body);
      await update.updateOne({
        $push: {
          notes: {
            title: req.body.titleMasalah,
            content: req.body.contentMasalah,
            attachments: {
              file: null,
              orginalName: null,
              originalExt: null,
            },
            actions: {
              title: null,
              content: null,
            },
          },
        },
      });
    }

    res.json({
      status: true,
      message: 'success',
      data: await Logbook.findOne({ _id: req.params.id }),
      // body: req.body,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const destroyNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const destroy = await Logbook.findOne({ _id: req.params.id });
    const notes = destroy.toObject().notes;
    const file = notes.find((elem: any) => elem._id.toString() === req.params.note_id);
    console.log(file);
    if (file) {
      console.log('ada file untuk di delete');
      fs.rmSync(path.join(__dirname, `../uploads/${file.attachments.file}`), { recursive: true, force: true });
    }
    await destroy.updateOne({
      $pull: {
        notes: {
          _id: req.params.note_id,
        },
      },
    });
    res.json(destroy);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const destroy = await Logbook.findOne({ _id: req.params.id });
    if (destroy.notes) {
      destroy.notes.map((note: any) => {
        fs.rm(path.join(__dirname, `../uploads/${note.attachments.file}`), (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log('Success delete file');
          }
        });
      });
    }
    await destroy.deleteOne();
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
