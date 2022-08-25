import mongoose, { Schema, Document } from 'mongoose';
import { IWallet } from './wallets.model';

/**
 * Exchange Interface
 */

export interface IExchange extends Document {
    txHash: String,
    amount: Number,
    fromAddress: String,
    toAddress: String,
    fromCurrency: String,
    toCurrency: String,
    walletId: IWallet['_id'],
    status: Boolean
}

/**
 * Exchange Schema
 * @private
 */

const ExchangeSchema: Schema = new Schema({
    txHash: { type: String },
    amount: { type: Number },
    fromAddress: { type: String },
    toAddress: { type: String },
    fromCurrency: { type: String }, //BSC, SOL
    toCurrency: { type: String }, //BSC, SOL
    walletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
    status: { type: Boolean, default: false },
}, { timestamps: true }
);

/**
 * @typedef Exchange
 */

export default mongoose.model<IExchange>('Exchange', ExchangeSchema);