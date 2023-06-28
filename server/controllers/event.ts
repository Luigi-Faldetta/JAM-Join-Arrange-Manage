import { Request, Response } from 'express';
import { Event, UserEvents } from '../models/associations'

// Needs body with at least {"title"} 
const newEvent = async (req: Request, res: Response) => {
  const { title, host } = req.body;

  if (!title || !host) {
    return res.status(400)
      .send({ error: "400", message: "Missing input data" })
  }

  try {
    const event = await Event.create(req.body)
    res.status(201).json({
      success: true,
      data: event,
      message: 'Event created',
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

// Needs req.params.eventid
const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findOne({
      where: { eventId: req.params.eventid }
    })

    // if (!event) { console.log('hello there') }

    res.status(200).json({
      success: true,
      data: event,
      message: 'Event fetched',
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

// Needs req.params.eventid
// Needs body with the changes 
const updateEvent = async (req: Request, res: Response) => {
  try {
    const updatedEvent = await Event.update(req.body, { where: { eventId: req.params.eventid }, returning: true })
    res.status(200).json({
      success: true,
      data: updatedEvent[1][0],
      message: 'Event updated',
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

// Needs req.params.eventid
const deleteEvent = async (req: Request, res: Response) => {
  try {
    const deletedEvent = await Event.destroy({ where: { eventId: req.params.eventid } })
    res.status(200).json({
      success: true,
      data: deletedEvent,
      message: 'Event deleted',
    });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

// Needs req.params.userid
const getUserEvents = async (req: Request, res: Response) => {
  try {
    const eventIds = await UserEvents.findAll({ 
      where: { userId: req.params.userid } 
    })
    if (eventIds.length) {
      const eventsArray = []
      for (const event of eventIds) { 
        eventsArray.push(event.dataValues.eventId) 
      }

      const events = await Event.findAll({ where: { eventId: eventsArray } })
      res.status(200).json({
        success: true,
        data: events,
        message: 'User events fetched',
      });
    } else {
      throw new Error('No events where found')
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

export default { newEvent, getEvent, updateEvent, deleteEvent, getUserEvents }
