import {Request, Response} from 'express';
import { RoomModel } from '../models/room';

export const create = async(req: Request, res: Response): Promise<void> => {
    try {
        const create = await RoomModel.create({
            roomName: req.body.roomName,
            roomUrl: req.body.roomUrl,
            startTime: Date.now(),
        });
        res.json({
            status: true,
            message: "success",
            data: create
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
} 

export const show = async (req: Request, res: Response): Promise<void> => {
    try {
        const read = await RoomModel.findOne({
            roomName: req.params.roomName
        });
        res.json({
            status: true,
            message: "success",
            data: read
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
}

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const roomName = req.params.roomName;
        const roomNameUpdate = req.body.roomName;
        const roomUrlUpdate = req.body.roomUrl;
        const update = await RoomModel.updateOne({roomName: roomName}, {
            roomName: roomNameUpdate,
            roomUrl: roomUrlUpdate
        });
        res.json({
            status: true,
            message: 'success',
            data: update
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
}

export const destroy = async (req: Request, res: Response): Promise<void> => {
    try {
        res.json({
            status: true,
            message: 'success'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
}

export const coba = async (req: Request, res: Response): Promise<void> => {
    try {
        res.render('index', {
            apiID: 'TEST',
            apiKey: 'TEST',
            roomName: 'coba'
        });
    } catch (error) {
        
    }
}