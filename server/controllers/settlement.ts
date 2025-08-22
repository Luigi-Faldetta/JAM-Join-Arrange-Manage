import { Request, Response } from 'express';
import { resBody } from '../utils';
import ExpenseSettlement from '../models/expenseSettlement';
import User from '../models/user';
import { Op } from 'sequelize';

// Confirm payment by payer
const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { eventId, receiverId, amount, payerId } = req.body;

    if (!eventId || !receiverId || !amount || !payerId) {
      return res.status(400).json(
        resBody(false, "400", null, "Missing required fields")
      );
    }

    // Check if settlement already exists
    let settlement = await ExpenseSettlement.findOne({
      where: {
        eventId,
        payerId,
        receiverId,
        amount: parseFloat(amount)
      }
    });

    if (settlement) {
      // Update existing settlement
      settlement.payerConfirmed = true;
      settlement.payerConfirmedAt = new Date();
      await settlement.save();
    } else {
      // Create new settlement
      settlement = await ExpenseSettlement.create({
        eventId,
        payerId,
        receiverId,
        amount: parseFloat(amount),
        payerConfirmed: true,
        payerConfirmedAt: new Date(),
        receiverConfirmed: false
      });
    }

    res.status(200).json(
      resBody(true, null, settlement, 'Payment confirmation recorded')
    );
  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500).json(
      resBody(false, "500", null, err.message)
    );
  }
};

// Confirm receipt by receiver
const confirmReceipt = async (req: Request, res: Response) => {
  try {
    const { settlementId, userId } = req.body;

    if (!settlementId || !userId) {
      return res.status(400).json(
        resBody(false, "400", null, "Missing required fields")
      );
    }

    const settlement = await ExpenseSettlement.findOne({
      where: {
        id: settlementId,
        receiverId: userId
      }
    });

    if (!settlement) {
      return res.status(404).json(
        resBody(false, "404", null, "Settlement not found or unauthorized")
      );
    }

    if (!settlement.payerConfirmed) {
      return res.status(400).json(
        resBody(false, "400", null, "Payment must be confirmed by payer first")
      );
    }

    settlement.receiverConfirmed = true;
    settlement.receiverConfirmedAt = new Date();
    await settlement.save();

    res.status(200).json(
      resBody(true, null, settlement, 'Receipt confirmation recorded')
    );
  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500).json(
      resBody(false, "500", null, err.message)
    );
  }
};

// Get all settlements for an event
const getEventSettlements = async (req: Request, res: Response) => {
  try {
    const { eventid } = req.params;

    if (!eventid) {
      return res.status(400).json(
        resBody(false, "400", null, "Event ID is required")
      );
    }

    const settlements = await ExpenseSettlement.findAll({
      where: { eventId: eventid },
      include: [
        {
          model: User,
          as: 'Payer',
          attributes: ['userId', 'name', 'profilePic']
        },
        {
          model: User,
          as: 'Receiver',
          attributes: ['userId', 'name', 'profilePic']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(
      resBody(true, null, settlements, 'Settlements fetched successfully')
    );
  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500).json(
      resBody(false, "500", null, err.message)
    );
  }
};

// Get settlements for a specific user
const getUserSettlements = async (req: Request, res: Response) => {
  try {
    const { userid } = req.params;
    const { eventId } = req.query;

    if (!userid) {
      return res.status(400).json(
        resBody(false, "400", null, "User ID is required")
      );
    }

    const whereClause: any = {
      [Op.or]: [
        { payerId: userid },
        { receiverId: userid }
      ]
    };

    if (eventId) {
      whereClause.eventId = eventId;
    }

    const settlements = await ExpenseSettlement.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'Payer',
          attributes: ['userId', 'name', 'profilePic']
        },
        {
          model: User,
          as: 'Receiver',
          attributes: ['userId', 'name', 'profilePic']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(
      resBody(true, null, settlements, 'User settlements fetched successfully')
    );
  } catch (err: any) {
    process.env.NODE_ENV !== 'test' && console.error(err);
    res.status(500).json(
      resBody(false, "500", null, err.message)
    );
  }
};

export { 
  confirmPayment, 
  confirmReceipt, 
  getEventSettlements,
  getUserSettlements 
};