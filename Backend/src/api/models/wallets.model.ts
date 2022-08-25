import mongoose, { Schema, Document } from 'mongoose';
/**
 * Wallet Interface
 */

export interface IWallet extends Document {
    titleId: string;
    email: string;
    username: string;
    bsc: {
        private_key: String,
        public_key: String,
        favouriteNfts: Array<any>,
    };
    sol: {
        private_key: String,
        public_key: String,
        favouriteNfts: Array<any>,
    };
}
/**
 * Wallet Schema
 * @private
 */
const WalletSchema: Schema = new Schema({
    titleId: { type: String },
    email: { type: String },
    username: { type: String },
    bsc: {
        private_key: String,
        public_key: String,
        favouriteNfts: { type: Array },
    },
    sol: {
        private_key: String,
        public_key: String,
        favouriteNfts: { type: Array },
    }
}, { timestamps: true }
);

/**
 * @typedef Wallet
 */

export default mongoose.model<IWallet>('Wallet', WalletSchema);