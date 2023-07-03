import { Request, Response } from 'express';
import { EventChat, User, Event } from '../models/associations';
import { validate as uuidValidate } from 'uuid';

//@ts-ignore
const resBody = (success, error, data, message) => { return { success, error, data, message } }

/**
 * @param req needs req.params.eventid
 */
const getChat = async (req: Request, res: Response) => {

  if (!uuidValidate(req.params.eventid)) {
    return res.status(400)
      .json(resBody(false, "400", null, "Wrong event id"))
  }

  const event = await Event.findOne({
    where: { eventId: req.params.eventid }
  })

  if (!event) {
    return res.status(400)
      .json(resBody(false, "400", null, "Event could not be found"))
  }

  try {
    const chat = await EventChat.findAll({
      where: { eventId: req.params.eventid },
    })

    res.status(200)
      .json(resBody(true, null, chat, 'Chat fetched'));

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500)
      .json(resBody(false, "500", null, err.message));
  }

}

/**
 * @param req needs body with {"eventId", "userId", "message"}
 */
const newMessage = async (req: Request, res: Response) => {

  if (!req.body.message) {
    return res.status(400)
      .json(resBody(false, "400", null, "Missing input message"))
  }

  if (!uuidValidate(req.body.eventId) || !uuidValidate(req.body.userId)) {
    return res.status(400)
      .json(resBody(false, "400", null, "Wrong event and/or user id"))
  }

  const user = await User.findOne({
    where: { userId: req.body.userId }
  })

  if (!user) {
    return res.status(400)
      .json(resBody(false, "400", null, "User could not be found"))
  }

  const event = await Event.findOne({
    where: { eventId: req.body.eventId }
  })

  if (!event) {
    return res.status(400)
      .json(resBody(false, "400", null, "Event could not be found"))
  }

  try {
    const eventChat = await EventChat.create({ ...req.body, date: Date.now() })

    res.status(201)
      .json(resBody(true, null, eventChat, 'Chat message succesfully posted'));

  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500)
      .json(resBody(false, "500", null, err.message));
  }


}


export default { getChat, newMessage };
