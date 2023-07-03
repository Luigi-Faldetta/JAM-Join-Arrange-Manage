import { Request, Response } from 'express';
import { resBody } from '../utils'
import UserEvent from '../models/userEvent';

/**
 * @param req needs body with at least {"userId", "eventId"} Optional "isHost" and "isGoing"
 */
const joinEvent = async (req: Request, res: Response) => {

  try {
    await UserEvent.create(req.body);
    res.status(201)
      .json(resBody(true, null, null, 'User joined the activity'));

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.log(err);
    res.status(500)
      .json(resBody(false, null, null, err.message));
  }
};

/**
 * @param req needs body with "userId", "eventId" and updates to "isHost" and/or "isGoing"
 */
const updateEvent = async (req: Request, res: Response) => {

  try {
    const updatedEvent = await UserEvent.update(req.body,
      {
        where: { userId: req.body.userId, eventId: req.body.eventId },
        returning: true
      })

    res.status(200)
      .json(resBody(true, null, updatedEvent[1][0], 'User event properties updated'));

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500)
      .json(resBody(false, null, null, err.message));
  }
};

/**
 * @param req needs body with {"userId", "eventId"}
 */
const leaveEvent = async (req: Request, res: Response) => {

  try {
    await UserEvent.destroy({
      where: req.body,
    });
    res.status(200)
      .json(resBody(true, null, null, 'User left the activity'));

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.log(err);
    res.status(400)
      .json(resBody(false, null, null, err.message));
  }
};

export default { joinEvent, updateEvent, leaveEvent };
