import Logbook from '../models/logbook';
import { Request, Response } from 'express';

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

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
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
    const update = await Logbook.findOneAndUpdate({ _id: req.body.id }, req.body);
    res.json({
      status: true,
      message: 'success',
      data: update,
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
