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
exports.get = exports.list = exports.create = void 0;
const exchange_model_1 = __importDefault(require("../../models/exchange.model"));
const mongoose_1 = __importDefault(require("mongoose"));
// API to create exchange
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let exchange = yield exchange_model_1.default.create(req.body);
        return res.send({ status: true, data: exchange });
    }
    catch (error) {
        return next(error);
    }
});
exports.create = create;
// API to list exchange
const list = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page, limit, userId, startDate, endDate } = req.query;
        let filter = {};
        if (userId !== undefined)
            filter.userId = new mongoose_1.default.Types.ObjectId(userId);
        if (startDate !== undefined && endDate !== undefined) {
            filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        page = page !== undefined && page !== '' ? parseInt(page) : 1;
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10;
        const total = yield exchange_model_1.default.countDocuments(filter);
        const exchange = yield exchange_model_1.default.aggregate([
            {
                $match: filter
            },
            // {
            //     '$lookup': {
            //         'from': 'users',
            //         'localField': 'userId',
            //         'foreignField': '_id',
            //         'as': 'user'
            //     }
            // }, {
            //     '$unwind': {
            //         'path': '$user'
            //     }
            // },
            { $sort: { _id: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit },
        ]);
        return res.send({
            status: true, message: 'Exchange fetched successfully',
            data: {
                exchange,
                pagination: {
                    page, limit, total,
                    pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit)
                }
            }
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.list = list;
// API to get exchange
const get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exchange = yield exchange_model_1.default.findOne({ _id: req.params.id });
        if (exchange)
            return res.json({ status: true, message: 'Exchange retrieved successfully', exchange });
        else
            return res.json({ status: false, message: 'No record found' });
    }
    catch (error) {
        return next(error);
    }
});
exports.get = get;
