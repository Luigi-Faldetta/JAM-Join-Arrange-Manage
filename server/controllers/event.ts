import { Request, Response } from 'express';
import { Event, User, UserEvent } from '../models/associations.js';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { resBody } from '../utils';
import { Op } from 'sequelize';

/**
 * Create a new event - ORIGINAL SIGNATURE PRESERVED
 * @param req needs body with at least {"title"} and params.userid
 */
const newEvent = async (req: Request, res: Response) => {
  // Validate userid parameter (keeping original validation)
  if (!uuidValidate(req.params.userid)) {
    return res.status(400).json(resBody(false, '400', null, 'Wrong uuid'));
  }

  // Check if user exists (keeping original validation)
  const user = await User.findOne({
    where: { userId: req.params.userid },
  });

  if (!user) {
    return res.status(400).json(resBody(false, '400', null, 'Wrong host id'));
  }

  // Validate required fields (keeping original validation)
  if (!req.body.title) {
    return res
      .status(400)
      .json(resBody(false, '400', null, 'Missing input data'));
  }

  try {
    // Create event (enhanced with additional fields but backward compatible)

    const eventData = {
      eventId: uuidv4(),
      title: req.body.title,
      description: req.body.description || null,
      date: req.body.date || new Date(),
      location: req.body.location || null,
      coverPic: req.body.coverPic || null,
      hostId: req.params.userid,
    };

    const event = await Event.create(eventData);

    // Create host relationship (keeping original logic)
    await UserEvent.create({
      userId: req.params.userid,
      eventId: event.eventId,
      isHost: true,
    });

    // Return event in original format
    const eventToReturn = await Event.findOne({
      where: { eventId: event.eventId },
      include: [
        {
          model: UserEvent,
          where: { userId: req.params.userid },
          attributes: ['isHost', 'isGoing'],
        },
      ],
    });

    res
      .status(201)
      .json(
        resBody(true, null, eventToReturn, 'Event created and linked to host')
      );
  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500).json(resBody(false, '500', null, err.message));
  }
};

/**
 * Get event by ID - ORIGINAL SIGNATURE PRESERVED
 * @param req needs req.params.eventid
 */
const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findOne({
      where: { eventId: req.params.eventid },
      include: [
        {
          model: UserEvent,
          attributes: ['userId', 'isHost', 'isGoing'],
          include: [
            {
              model: User,
              attributes: ['name', 'profilePic'],
            },
          ],
        },
      ],
    });

    if (!event) {
      return res
        .status(404)
        .json(resBody(false, '404', null, 'No event found'));
    }

    res.status(200).json(resBody(true, null, event, 'Event fetched'));
  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500).json(resBody(false, '500', null, err.message));
  }
};

/**
 * Update event - ORIGINAL SIGNATURE PRESERVED
 * @param req needs req.params.eventid and body with what has changed
 */
const updateEvent = async (req: Request, res: Response) => {
  try {
    const updatedEvent = await Event.update(req.body, {
      where: { eventId: req.params.eventid },
      returning: true,
    });
    res
      .status(200)
      .json(resBody(true, null, updatedEvent[1][0], 'Event updated'));
  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500).json(resBody(false, '500', null, err.message));
  }
};

/**
 * Delete event - ORIGINAL SIGNATURE PRESERVED
 * @param req needs req.params.eventid
 */
const deleteEvent = async (req: Request, res: Response) => {
  try {
    const eventExists = await Event.findOne({
      where: { eventId: req.params.eventid },
    });

    if (!eventExists) {
      return res
        .status(400)
        .json(resBody(false, '400', null, 'Wrong event id'));
    }

    const deletedEvent = await Event.destroy({
      where: { eventId: req.params.eventid },
    });

    res.status(200).json(resBody(true, null, deletedEvent, 'Event deleted'));
  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(400).json(resBody(false, '500', null, err.message));
  }
};

/**
 * Get user events - ORIGINAL SIGNATURE PRESERVED
 * @param req needs req.params.userid
 */
const getUserEvents = async (req: Request, res: Response) => {
  try {
    const eventIds = await UserEvent.findAll({
      where: { userId: req.params.userid },
    });

    if (eventIds.length) {
      const eventsArray = [];
      for (const event of eventIds) {
        eventsArray.push(event.dataValues.eventId);
      }

      const events = await Event.findAll({
        where: { eventId: eventsArray },
        include: {
          model: UserEvent,
          where: { userId: req.params.userid },
          attributes: ['isHost', 'isGoing'],
        },
      });

      res.status(200).json(resBody(true, null, events, 'User events fetched'));
    } else {
      throw new Error('No events where found');
    }
  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500).json(resBody(false, '500', null, err.message));
  }
};

export default { newEvent, getEvent, updateEvent, deleteEvent, getUserEvents };
