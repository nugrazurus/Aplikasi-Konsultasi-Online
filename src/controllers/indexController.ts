import {Request, Response} from 'express';

export const index = async (req: Request, res: Response): Promise<void> => {
    res.json({
        status: true,
        message: "success"
    });
}
