import { Request, Response } from 'express';
import UserEvent from '../models/userEvent';

// Needs body with at least {"userId", "eventId"}
const joinEvent = async (req: Request, res: Response) => {

  try {
    await UserEvent.create(req.body);
    res.status(201)
      .json({
        success: true,
        error: null,
        data: null,
        message: 'User joined the activity',
      });

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.log(err);
    res.status(500)
      .json({ message: err.message });
  }
};

// Needs body with at least {"userId", "eventId"} and "isHost" and/or "isGoing"
const updateEvent = async (req: Request, res: Response) => {

  try {
    const updatedEvent = await UserEvent.update(req.body,
      {
        where: { userId: req.body.userId, eventId: req.body.eventId },
        returning: true
      })
      
    res.status(200)
      .json({
        success: true,
        error: null,
        data: updatedEvent[1][0],
        message: 'User event properties updated',
      });

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500)
      .json({ message: err.message });
  }
};


// Needs body with {"userId", "eventId"}
const leaveEvent = async (req: Request, res: Response) => {

  try {
    await UserEvent.destroy({
      where: req.body,
    });
    res.status(200)
      .json({
        success: true,
        error: null,
        data: null,
        message: 'User left the activity',
      });

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.log(err);
    res.status(400)
      .json({ message: err.message });
  }
};

export default { joinEvent, updateEvent, leaveEvent };
