import { Request, Response } from 'express';
import { Event, UserEvents } from '../models/associations'

// Needs body like {"title": "test title", "host": id} 
const newEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.create(req.body)
    res.status(201).json(event);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

// Needs req.params.eventId*
const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findOne({
      where: { eventId: req.params.eventid }
    })
    res.status(200).json(event);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

// Review return body
// Needs req.params.eventId*
const updateEvent = async (req: Request, res: Response) => {
  try {
    const updatedEvent = await Event.update(req.body, { where: { eventId: req.params.eventid }, returning: true })
    res.status(200).json(updatedEvent);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

// Needs req.params.eventId*
const deleteEvent = async (req: Request, res: Response) => {
  try {
    const deletedEvent = await Event.destroy({ where: { eventId: req.params.eventid } })
    res.status(200).json(deletedEvent);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

// Needs req.params.userId*
const getUserEvents = async (req: Request, res: Response) => {
  try {
    const eventIds = await UserEvents.findAll({
      where: { userId: req.params.userid }
    })
    if (eventIds) {
      const eventsArray = []
      for (const event of eventIds) {
        eventsArray.push(event.dataValues.eventId)
      }
      const events = await Event.findAll({ where: { eventId: eventsArray } })
      res.status(200).json(events);
    } else {
      throw 'No events where found'
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

export default { newEvent, getEvent, updateEvent, deleteEvent, getUserEvents }
