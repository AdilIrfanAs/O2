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
exports.find = exports.list = void 0;
const activity_model_1 = __importDefault(require("../../models/activity.model"));
const wallets_model_1 = __importDefault(require("../../models/wallets.model"));
// API to list activity
const list = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page, limit, walletId } = req.query;
        let wallet = yield wallets_model_1.default.findOne({ '_id': walletId }).exec();
        let filter = { $or: [{ from: wallet.bsc.public_key }, { from: wallet.sol.public_key }, { to: wallet.bsc.public_key }, { to: wallet.sol.public_key }] };
        page = page !== undefined && page !== '' ? parseInt(page) : 1;
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10;
        const total = yield activity_model_1.default.countDocuments(filter);
        const activity = yield activity_model_1.default.aggregate([
            {
                $match: filter
            },
            { $sort: { _id: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit },
        ]);
        return res.send({
            status: true, message: 'Activity fetched successfully',
            data: {
                activity,
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
const find = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page, limit, walletAddress } = req.query;
        let filter = {
            $or: [{ from: walletAddress }, { to: walletAddress }]
        };
        page = page !== undefined && page !== '' ? parseInt(page) : 1;
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10;
        const total = yield activity_model_1.default.countDocuments(filter);
        const activity = yield activity_model_1.default.aggregate([
            {
                $match: filter
            },
            { $sort: { _id: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit },
        ]);
        return res.send({
            status: true, message: 'Activity fetched successfully',
            data: {
                activity,
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
exports.find = find;
