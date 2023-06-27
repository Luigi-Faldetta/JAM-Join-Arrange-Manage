import { Request, Response } from 'express';
import { Event, UserEvents } from '../models/associations'

// It works
// {"location": "here", "title": "test title",
// "host": id, "description": "Blah blah",
// "coverPic": "pic} 
const newEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.create(req.body)
    res.status(201).json(event);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

// It works
// /req.params.eventId*
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

// It works (review return body)
// /req.params.eventId*
const updateEvent = async (req: Request, res: Response) => {
  try {
    const updatedEvent = await Event.update(req.body, { where: { eventId: req.params.eventid }, returning: true })
    res.status(200).json(updatedEvent);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

// It works
// /req.params.eventId*
const deleteEvent = async (req: Request, res: Response) => {
  try {
    const deletedEvent = await Event.destroy({ where: { eventId: req.params.eventid } })
    res.status(200).json(deletedEvent);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

// /req.params.userId*
const getUserEvents = async (req: Request, res: Response) => {
  try {
    const eventIds = await UserEvents.findAll({
      where: { XuserId: req.params.userid }
    })
    // events is an array of eventIds?
    // Try the line below
    // const events = await Event.findAll({ where: {id: eventIds}})
    // res.status(200).json(events);
    res.status(200).json(eventIds);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

export default { newEvent, getEvent, updateEvent, deleteEvent, getUserEvents }