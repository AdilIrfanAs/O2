import mongoose, { Schema, Document } from 'mongoose';
/**
 * NftMetadata Interface
 */

export interface INftMetadata extends Document {
    metadata: Object,
}

/**
 *  NftMetadata Schema
 * @private
 */

const NftMetadataSchema: Schema = new Schema({
    metadata: { type: Object },
}, { timestamps: true }
);

/**
 * @typedef NftMetadata
 */

export default mongoose.model<INftMetadata>('NftMetadata', NftMetadataSchema);