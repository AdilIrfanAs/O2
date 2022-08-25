import mongoose, { Schema, Document } from 'mongoose';
import { IWallet } from './wallets.model';
/**
 * Transaction Interface
 */

export interface ITransaction extends Document {
    amount: Number,
    address: String,
    txHash: String,
    network: number,
    type: number,
    walletId: IWallet['_id'],
}

/**
 * Transaction Schema
 * @private
 */

const TransactionSchema: Schema = new Schema({
    amount: { type: Number },
    address: { type: String },
    txHash: { type: String },
    network: { type: Number }, //1 = BSC, 2 = SOL
    type: { type: Number }, //1 = On-Chain, 2 = Off-Chain
    walletId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
}, { timestamps: true }
);

/**
 * @typedef Transaction
 */

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);