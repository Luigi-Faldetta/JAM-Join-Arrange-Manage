import { Request, Response } from 'express';
import UserEvents from '../models/userEvent';

const joinEvent = async (req: Request, res: Response) => {
  try {
    const { userId, eventId } = req.body;
    await UserEvents.create({ userId, eventId });
    res.status(201).json({
      success: true,
      data: null,
      message: 'User joined the activity.',
    });
    
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

const leaveEvent = async (req: Request, res: Response) => {
  try {
    const { userId, eventId } = req.body;
    await UserEvents.destroy({
      where: {
        userId: userId,
        activityId: eventId,
      },
    });
    res.status(200).json({
      success: true,
      data: null,
      message: 'User left the activity.',
    });

  } catch (err: any) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

export default { joinEvent, leaveEvent };
