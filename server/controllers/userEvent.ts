import { Request, Response } from 'express';
import UserEvents from '../models/userEvent';

const joinEvent = async (req: Request, res: Response) => {

  try {
    await UserEvents.create(req.body);
    res.status(201)
      .json({
        success: true,
        error: null,
        data: null,
        message: 'User joined the activity.',
      });

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.log(err);
    res.status(500)
      .json({ message: err.message });
  }
};

const leaveEvent = async (req: Request, res: Response) => {

  try {
    await UserEvents.destroy({
      where: req.body,
    });
    res.status(200)
      .json({
        success: true,
        error: null,
        data: null,
        message: 'User left the activity.',
      });

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.log(err);
    res.status(400)
      .json({ message: err.message });
  }
};

export default { joinEvent, leaveEvent };
