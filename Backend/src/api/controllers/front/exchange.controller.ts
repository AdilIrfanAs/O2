import Exchange, { IExchange } from '../../models/exchange.model';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from "express";

// API to create exchange
export const create = async (req, res, next) => {
    try {
        let exchange = await Exchange.create(req.body);
        return res.send({ status: true, data: exchange });
    } catch (error) {
        return next(error);
    }
};

// API to list exchange
export const list = async (req, res, next) => {
    try {
        let { page, limit, userId, startDate, endDate } = req.query
        let filter: any = {}

        if (userId !== undefined)
            filter.userId = new mongoose.Types.ObjectId(userId)

        if (startDate !== undefined && endDate !== undefined) {
            filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
        }

        page = page !== undefined && page !== '' ? parseInt(page) : 1
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10

        const total = await Exchange.countDocuments(filter)

        const exchange = await Exchange.aggregate([
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
        ])

        return res.send({
            status: true, message: 'Exchange fetched successfully',
            data: {
                exchange,
                pagination: {
                    page, limit, total,
                    pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit)
                }
            }
        })
    } catch (error) {
        return next(error)
    }
}

// API to get exchange
export const get = async (req, res, next) => {
    try {
        const exchange = await Exchange.findOne({ _id: req.params.id })
        if (exchange)
            return res.json({ status: true, message: 'Exchange retrieved successfully', exchange })
        else
            return res.json({ status: false, message: 'No record found' })
    } catch (error) {
        return next(error)
    }
}