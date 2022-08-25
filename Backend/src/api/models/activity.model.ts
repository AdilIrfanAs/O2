import mongoose, { Schema, Document } from 'mongoose';
/**
 * Activity Interface
 */

export interface IActivity extends Document {
    title: String,
    item: String,
    imageUrl: String,
    name: String,
    serialNumber: String,
    from: String,
    to: String,
}

/**
 *  Activity Schema
 * @private
 */

const ActivitySchema: Schema = new Schema({
    title: { type: String },
    item: { type: String },
    imageUrl: { type: String },
    name: { type: String },
    serialNumber: { type: Number },
    from: { type: String },
    to: { type: String },
}, { timestamps: true }
);

/**
 * @typedef Activity
 */

export default mongoose.model<IActivity>('Activity', ActivitySchema);