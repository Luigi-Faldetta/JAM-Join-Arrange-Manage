import { Request, Response } from 'express';
import { Event } from '../models/associations'

const newEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.create(req.body)
    res.status(201).json(event);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findOne({
      where: { eventId: req.params.id }
    })
    res.status(200).json('hello');
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

const updateEvent = async (req: Request, res: Response) => {
  try {
    const updatedEvent = await Event.update(req.body, { where: { id: req.params.id }, returning: true })
    res.status(200).json(updatedEvent);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

const deleteEvent = async (req: Request, res: Response) => {
  try {
    const deletedEvent = await Event.destroy({ where: { id: req.params.id } })
    res.status(200).json(deletedEvent);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

const getUserEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.findAll({
      where: { host: req.params.id }
    })
    res.status(200).json(events);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

export default { newEvent, getEvent, updateEvent, deleteEvent, getUserEvents }