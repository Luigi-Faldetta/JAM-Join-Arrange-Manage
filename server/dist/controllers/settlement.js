"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSettlements = exports.getEventSettlements = exports.confirmReceipt = exports.confirmPayment = void 0;
const utils_1 = require("../utils");
const expenseSettlement_1 = __importDefault(require("../models/expenseSettlement"));
const user_1 = __importDefault(require("../models/user"));
const sequelize_1 = require("sequelize");
// Confirm payment by payer
const confirmPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId, receiverId, amount, payerId } = req.body;
        if (!eventId || !receiverId || !amount || !payerId) {
            return res.status(400).json((0, utils_1.resBody)(false, "400", null, "Missing required fields"));
        }
        // Check if settlement already exists
        let settlement = yield expenseSettlement_1.default.findOne({
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
            yield settlement.save();
        }
        else {
            // Create new settlement
            settlement = yield expenseSettlement_1.default.create({
                eventId,
                payerId,
                receiverId,
                amount: parseFloat(amount),
                payerConfirmed: true,
                payerConfirmedAt: new Date(),
                receiverConfirmed: false
            });
        }
        res.status(200).json((0, utils_1.resBody)(true, null, settlement, 'Payment confirmation recorded'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500).json((0, utils_1.resBody)(false, "500", null, err.message));
    }
});
exports.confirmPayment = confirmPayment;
// Confirm receipt by receiver
const confirmReceipt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { settlementId, userId } = req.body;
        if (!settlementId || !userId) {
            return res.status(400).json((0, utils_1.resBody)(false, "400", null, "Missing required fields"));
        }
        const settlement = yield expenseSettlement_1.default.findOne({
            where: {
                id: settlementId,
                receiverId: userId
            }
        });
        if (!settlement) {
            return res.status(404).json((0, utils_1.resBody)(false, "404", null, "Settlement not found or unauthorized"));
        }
        if (!settlement.payerConfirmed) {
            return res.status(400).json((0, utils_1.resBody)(false, "400", null, "Payment must be confirmed by payer first"));
        }
        settlement.receiverConfirmed = true;
        settlement.receiverConfirmedAt = new Date();
        yield settlement.save();
        res.status(200).json((0, utils_1.resBody)(true, null, settlement, 'Receipt confirmation recorded'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500).json((0, utils_1.resBody)(false, "500", null, err.message));
    }
});
exports.confirmReceipt = confirmReceipt;
// Get all settlements for an event
const getEventSettlements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventid } = req.params;
        if (!eventid) {
            return res.status(400).json((0, utils_1.resBody)(false, "400", null, "Event ID is required"));
        }
        const settlements = yield expenseSettlement_1.default.findAll({
            where: { eventId: eventid },
            include: [
                {
                    model: user_1.default,
                    as: 'Payer',
                    attributes: ['userId', 'name', 'profilePic']
                },
                {
                    model: user_1.default,
                    as: 'Receiver',
                    attributes: ['userId', 'name', 'profilePic']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json((0, utils_1.resBody)(true, null, settlements, 'Settlements fetched successfully'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500).json((0, utils_1.resBody)(false, "500", null, err.message));
    }
});
exports.getEventSettlements = getEventSettlements;
// Get settlements for a specific user
const getUserSettlements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userid } = req.params;
        const { eventId } = req.query;
        if (!userid) {
            return res.status(400).json((0, utils_1.resBody)(false, "400", null, "User ID is required"));
        }
        const whereClause = {
            [sequelize_1.Op.or]: [
                { payerId: userid },
                { receiverId: userid }
            ]
        };
        if (eventId) {
            whereClause.eventId = eventId;
        }
        const settlements = yield expenseSettlement_1.default.findAll({
            where: whereClause,
            include: [
                {
                    model: user_1.default,
                    as: 'Payer',
                    attributes: ['userId', 'name', 'profilePic']
                },
                {
                    model: user_1.default,
                    as: 'Receiver',
                    attributes: ['userId', 'name', 'profilePic']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json((0, utils_1.resBody)(true, null, settlements, 'User settlements fetched successfully'));
    }
    catch (err) {
        process.env.NODE_ENV !== 'test' && console.error(err);
        res.status(500).json((0, utils_1.resBody)(false, "500", null, err.message));
    }
});
exports.getUserSettlements = getUserSettlements;
