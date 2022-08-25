import Acitivity from '../../models/activity.model';
import Wallet from '../../models/wallets.model';

// API to list activity
export const list = async (req, res, next) => {
    try {
        let { page, limit, walletId } = req.query
        let wallet: any = await Wallet.findOne({ '_id': walletId }).exec();
        let filter: any = { $or: [{ from: wallet.bsc.public_key }, { from: wallet.sol.public_key }, { to: wallet.bsc.public_key }, { to: wallet.sol.public_key }] }
        page = page !== undefined && page !== '' ? parseInt(page) : 1
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10
        const total = await Acitivity.countDocuments(filter)

        const activity = await Acitivity.aggregate([
            {
                $match: filter
            },

            { $sort: { _id: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit },
        ])

        return res.send({
            status: true, message: 'Activity fetched successfully',
            data: {
                activity,
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

// API to find activity by wallet address
export const find = async (req, res, next) => {
    try {
        let { page, limit, walletAddress } = req.query
        let filter: any = {
            $or: [{ from: walletAddress }, { to: walletAddress }]
        }
        page = page !== undefined && page !== '' ? parseInt(page) : 1
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10
        const total = await Acitivity.countDocuments(filter)

        const activity = await Acitivity.aggregate([
            {
                $match: filter

            },

            { $sort: { _id: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit },
        ])
        return res.send({
            status: true, message: 'Activity fetched successfully',
            data: {
                activity,
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
