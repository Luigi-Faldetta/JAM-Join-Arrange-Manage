import { validate } from "uuid";
import { resBody } from "../utils";
import {User, Event, EventChat} from "../models/associations";

export const addMessageSocket = async (options: {message: string, userId: string, eventId:string}) => {
    const { message, userId, eventId } = options;
    if (!message) {
        return resBody(false, "400", null, "Missing input message");
    }

    if (!validate(userId) || !validate(eventId)) {
        return resBody(false, "400", null, "Wrong event and/or user id")
    }

    const user = await User.findOne({
        where: { userId }
      })
    
      if (!user) {
        return resBody(false, "400", null, "User could not be found")
      }


  const event = await Event.findOne({
    where: { eventId }
  })

  if (!event) {
    return resBody(false, "400", null, "Event could not be found")
  }

  try {
    const eventChat = await EventChat.create({ ...options, date: Date.now() as any})
    const eventToReturn = await EventChat.findOne({where : { userId, eventId, message, date: eventChat.date}, 
        include: [{
            model: User,
            attributes: ['name', 'profilePic'],
          }]})
    return resBody(true, null, eventToReturn, 'Chat message succesfully posted')
  } catch (error: any) {
    process.env.NODE_ENV !== 'test' && console.error(error);
    return resBody(false, "500", null, error.message);
  }
}