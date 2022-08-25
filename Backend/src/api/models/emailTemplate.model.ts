import mongoose, { Schema, Document } from 'mongoose';

/**
 * EmailTemplate Interface
 */


export interface IEmailTemplate extends Document {
    type: string;
    subject: string;
    text: string;
}

/**
 * EmailTemplate Schema
 * @private
 */

const EmailTemplateSchema: Schema = new Schema({
    type: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    text: { type: String, required: true }
}, { timestamps: true }
);

/**
 * @typedef EmailTemplate
 */

export default mongoose.model<IEmailTemplate>('EmailTemplate', EmailTemplateSchema);